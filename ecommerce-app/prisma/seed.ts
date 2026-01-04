import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { initialProducts } from '../src/lib/constants/products';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created (admin@example.com / admin123)');

  // Seed products
  console.log(`Found ${initialProducts.length} products to seed`);

  let seededCount = 0;

  for (const product of initialProducts) {
    const {
      images,
      reviews,
      options,
      features,
      specifications,
      sku,
      tags,
      releaseDate,
      createdAt,
      updatedAt,
      ...productData
    } = product;

    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        id: productData.id,
        title: productData.title,
        description: productData.description,
        price: productData.price,
        discount: productData.discount || 0,
        stock: productData.stock,
        brand: productData.brand,
        category: productData.category,
        rating: productData.rating,
        reviewCount: productData.reviewCount,
        thumbnail: productData.thumbnail || null,
        images: {
          create: images.map((url) => ({ url })),
        },
      },
    });

    seededCount++;
    if (seededCount % 10 === 0) {
      console.log(
        `Seeded ${seededCount}/${initialProducts.length} products...`
      );
    }
  }

  console.log(
    `✅ Seeding finished! Successfully seeded ${seededCount} products.`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
