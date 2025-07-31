import { NextResponse } from 'next/server';
import { getSession } from '../../lib/auth';
import { db } from '../../lib/db';

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, data, result } = await request.json();

  try {
    const calculation = await db.calculation.create({
      data: {
        userId: session.user.id,
        type,
        data: JSON.stringify(data),
        result: JSON.stringify(result),
      },
    });

    return NextResponse.json(calculation);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const calculations = await db.calculation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(calculations);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}