import { NextRequest, NextResponse } from 'next/server';
import { getCalculationRepository } from '@/lib/database';
import { performCalculation, validateInput } from '@/lib/calculator';
import { CalculationInput } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: CalculationInput = await req.json();

    const errors = validateInput(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(' ') },
        { status: 400 }
      );
    }

    const result = performCalculation(body);

    // Persist to DB
    const repo = await getCalculationRepository();
    const record = repo.create({
      description: body.description || 'Order Calculation',
      items: JSON.stringify(body.items),
      subtotal: result.subtotal,
      discount: result.discountAmount,
      tax: result.taxAmount,
      shipping: result.shippingCost,
      total: result.total,
    });
    const saved = await repo.save(record);

    return NextResponse.json({
      success: true,
      data: {
        id: saved.id,
        result,
      },
    });
  } catch (err) {
    console.error('Calculation error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
