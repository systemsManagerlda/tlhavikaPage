import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Produto from '../../../models/Produto';

export async function GET() {
  try {
    await dbConnect();
    
    const recentProducts = await Produto.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt')
      .lean();

    const activity = recentProducts.map(product => ({
      id: product._id.toString(),
      type: 'product_added',
      name: product.name,
      timestamp: product.createdAt,
      description: `Produto ${product.name} adicionado`
    }));

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Error fetching recent activity' },
      { status: 500 }
    );
  }
}