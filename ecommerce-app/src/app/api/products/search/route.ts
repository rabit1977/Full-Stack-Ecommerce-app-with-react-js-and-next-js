import { getProducts } from '@/lib/data/get-products';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
    }

    // Correctly call getProducts with an options object and a limit
    const { products } = await getProducts({ query: query, limit: 5 });

    return NextResponse.json(products);
    
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}