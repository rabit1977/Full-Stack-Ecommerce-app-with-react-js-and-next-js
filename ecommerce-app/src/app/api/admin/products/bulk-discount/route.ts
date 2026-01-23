// app/api/admin/products/bulk-discount/route.ts
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Prisma } from '@/generated/prisma/client';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { discountType, category, brand, discount } = body;

    // Validate discount (allow 0 to remove discounts)
    if (discount === undefined || discount === null || discount < 0 || discount > 100) {
      return NextResponse.json(
        { error: 'Discount must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Build where clause based on type
    let where: Prisma.ProductWhereInput = {};
    let description = 'all products';

    if (discountType === 'category' && category) {
      where = { category };
      description = `all products in "${category}" category`;
    } else if (discountType === 'brand' && brand) {
      where = { brand };
      description = `all "${brand}" products`;
    }

    // Update products in database
    const result = await prisma.product.updateMany({
      where,
      data: {
        discount: discount,
      },
    });

    // Revalidate ALL pages that show products
    revalidatePath('/', 'layout'); // Revalidate entire app
    revalidatePath('/products');
    revalidatePath('/admin/products');

    const message = discount === 0 
      ? `Successfully removed discounts from ${description}`
      : `Successfully applied ${discount}% discount to ${description}`;

    return NextResponse.json({
      success: true,
      count: result.count,
      message: message,
      details: {
        discount,
        productsUpdated: result.count,
        appliedTo: description,
      },
    });
  } catch (error) {
    console.error('Bulk discount error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to apply discount' },
      { status: 500 }
    );
  }
}