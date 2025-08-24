import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Produto from '../../../models/Produto';

export async function GET() {
  try {
    await dbConnect();
    
    const totalProducts = await Produto.countDocuments();
    const totalStock = await Produto.aggregate([
      { $group: { _id: null, total: { $sum: '$stock' } } }
    ]);
    const totalValue = await Produto.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$stock'] } } } }
    ]);

    const stats = {
      totalProducts,
      totalStock: totalStock[0]?.total || 0,
      totalValue: totalValue[0]?.total || 0,
      averagePrice: totalStock[0]?.total > 0 ? totalValue[0]?.total / totalStock[0]?.total : 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Error fetching statistics' },
      { status: 500 }
    );
  }
}