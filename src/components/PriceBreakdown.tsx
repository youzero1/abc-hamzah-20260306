'use client';

import { CalculationResult } from '@/types';

interface Props {
  result: CalculationResult;
  savedId: number | null;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export default function PriceBreakdown({ result, savedId }: Props) {
  const {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    shippingCost,
    total,
    freeShipping,
  } = result;

  return (
    <div
      className="card"
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e8f5e9 100%)',
        border: '1.5px solid #a7f3d0',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
          💰 Price Breakdown
        </h2>
        {savedId && (
          <span className="badge badge-success">✓ Saved #{savedId}</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        <Row label="Subtotal" value={fmt(subtotal)} />

        {discountAmount > 0 && (
          <Row
            label="Discount"
            value={`-${fmt(discountAmount)}`}
            valueColor="var(--secondary)"
          />
        )}

        {discountAmount > 0 && (
          <Row label="After Discount" value={fmt(taxableAmount)} muted />
        )}

        <Row label="Tax" value={fmt(taxAmount)} />

        <Row
          label={freeShipping ? 'Shipping (FREE 🎉)' : 'Shipping'}
          value={freeShipping ? fmt(0) : fmt(shippingCost)}
          valueColor={freeShipping ? 'var(--secondary)' : undefined}
        />
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '2px solid #a7f3d0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>Grand Total</span>
        <span
          style={{
            fontWeight: 900,
            fontSize: '1.5rem',
            color: 'var(--primary)',
            letterSpacing: '-0.5px',
          }}
        >
          {fmt(total)}
        </span>
      </div>

      {freeShipping && (
        <div
          style={{
            marginTop: '0.6rem',
            padding: '0.5rem 0.75rem',
            background: '#d1fae5',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            color: '#065f46',
            fontWeight: 600,
          }}
        >
          🎉 You qualify for free shipping!
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  valueColor,
  muted,
}: {
  label: string;
  value: string;
  valueColor?: string;
  muted?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        opacity: muted ? 0.7 : 1,
      }}
    >
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
      <span
        style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: valueColor || 'var(--text)',
        }}
      >
        {value}
      </span>
    </div>
  );
}
