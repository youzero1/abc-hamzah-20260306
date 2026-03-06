import { NextRequest, NextResponse } from 'next/server';
import { getCalculationRepository } from '@/lib/database';

export async function GET() {
  try {
    const repo = await getCalculationRepository();
    const records = await repo.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });

    const data = records.map((r) => ({
      id: r.id,
      description: r.description,
      items: JSON.parse(r.items),
      subtotal: Number(r.subtotal),
      discount: Number(r.discount),
      tax: Number(r.tax),
      shipping: Number(r.shipping),
      total: Number(r.total),
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('History fetch error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required.' },
        { status: 400 }
      );
    }

    const repo = await getCalculationRepository();
    const record = await repo.findOne({ where: { id: parseInt(id) } });

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Record not found.' },
        { status: 404 }
      );
    }

    await repo.remove(record);
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
