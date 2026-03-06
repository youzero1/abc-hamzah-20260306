'use client';

import { useState } from 'react';
import { CartItem, DiscountType, CalculationResult } from '@/types';
import PriceBreakdown from './PriceBreakdown';

const DEFAULT_TAX = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_TAX_RATE || '0.08') || 0.08;

interface Props {
  onCalculationSaved: () => void;
}

const emptyItem = (): CartItem => ({ name: '', quantity: 1, unitPrice: 0 });

export default function Calculator({ onCalculationSaved }: Props) {
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<CartItem[]>([emptyItem()]);
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('0');
  const [taxRate, setTaxRate] = useState<string>(String(DEFAULT_TAX * 100));
  const [weight, setWeight] = useState<string>('0');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);

  const updateItem = (index: number, field: keyof CartItem, value: string | number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setResult(null);
    setSavedId(null);
    setError(null);
  };

  const addItem = () => {
    setItems((prev) => [...prev, emptyItem()]);
    setResult(null);
    setSavedId(null);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
    setSavedId(null);
  };

  const handleCalculate = async () => {
    setError(null);
    setLoading(true);
    setSavedId(null);

    const parsedTaxRate = parseFloat(taxRate) / 100;
    const parsedDiscount = parseFloat(discountValue) || 0;
    const parsedWeight = parseFloat(weight) || 0;

    const payload = {
      description: description.trim() || 'Order Calculation',
      items: items.map((it) => ({
        name: it.name.trim(),
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
      })),
      discountType,
      discountValue: parsedDiscount,
      taxRate: parsedTaxRate,
      weight: parsedWeight,
    };

    try {
      const res = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'Calculation failed.');
      } else {
        setResult(json.data.result);
        setSavedId(json.data.id);
        onCalculationSaved();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDescription('');
    setItems([emptyItem()]);
    setDiscountType('percentage');
    setDiscountValue('0');
    setTaxRate(String(DEFAULT_TAX * 100));
    setWeight('0');
    setResult(null);
    setError(null);
    setSavedId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Description */}
      <div className="card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
          🧾 Order Details
        </h2>
        <label style={labelStyle}>Order Description</label>
        <input
          style={inputStyle}
          type="text"
          placeholder="e.g., Summer Sale Order"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
        />
      </div>

      {/* Items */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>🛍 Cart Items</h2>
          <button className="btn btn-secondary btn-sm" onClick={addItem}>
            + Add Item
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 110px 36px', gap: '0.5rem' }}>
            <span style={colHeaderStyle}>Product Name</span>
            <span style={colHeaderStyle}>Qty</span>
            <span style={colHeaderStyle}>Unit Price ($)</span>
            <span />
          </div>

          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 110px 36px', gap: '0.5rem', alignItems: 'center' }}>
              <input
                style={inputStyle}
                type="text"
                placeholder="Product name"
                value={item.name}
                onChange={(e) => updateItem(idx, 'name', e.target.value)}
              />
              <input
                style={inputStyle}
                type="number"
                min="1"
                step="1"
                value={item.quantity}
                onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
              />
              <input
                style={inputStyle}
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
              />
              <button
                className="btn btn-danger btn-sm"
                style={{ padding: '0.35rem 0.5rem' }}
                onClick={() => removeItem(idx)}
                disabled={items.length === 1}
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Discount, Tax, Shipping */}
      <div className="card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
          ⚙️ Pricing Options
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Discount Type</label>
            <select
              style={inputStyle}
              value={discountType}
              onChange={(e) => { setDiscountType(e.target.value as DiscountType); setResult(null); }}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>
              Discount Value ({discountType === 'percentage' ? '%' : '$'})
            </label>
            <input
              style={inputStyle}
              type="number"
              min="0"
              step={discountType === 'percentage' ? '1' : '0.01'}
              max={discountType === 'percentage' ? '100' : undefined}
              value={discountValue}
              onChange={(e) => { setDiscountValue(e.target.value); setResult(null); }}
            />
          </div>
          <div>
            <label style={labelStyle}>Tax Rate (%)</label>
            <input
              style={inputStyle}
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={taxRate}
              onChange={(e) => { setTaxRate(e.target.value); setResult(null); }}
            />
          </div>
          <div>
            <label style={labelStyle}>Package Weight (kg)</label>
            <input
              style={inputStyle}
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={(e) => { setWeight(e.target.value); setResult(null); }}
            />
          </div>
        </div>
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.6rem 0.9rem',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          💡 Free shipping on orders over ${process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '50.00'}. Weight-based surcharge: $0.50/kg.
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem',
            color: 'var(--danger)',
            fontSize: '0.88rem',
            fontWeight: 500,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          className="btn btn-primary"
          style={{ flex: 1, justifyContent: 'center', padding: '0.7rem' }}
          onClick={handleCalculate}
          disabled={loading}
        >
          {loading ? '⏳ Calculating…' : '🧮 Calculate Total'}
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          ↺ Reset
        </button>
      </div>

      {/* Result */}
      {result && (
        <PriceBreakdown result={result} savedId={savedId} />
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.35rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
  fontSize: '0.92rem',
  outline: 'none',
  transition: 'border-color 0.15s',
};

const colHeaderStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};
