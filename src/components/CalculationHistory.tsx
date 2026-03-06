'use client';

import { useEffect, useState, useCallback } from 'react';
import { CalculationRecord } from '@/types';

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export default function CalculationHistory() {
  const [records, setRecords] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/history');
      const json = await res.json();
      if (json.success) {
        setRecords(json.data);
      } else {
        setError(json.error || 'Failed to load history.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        if (expanded === id) setExpanded(null);
      } else {
        alert(json.error || 'Failed to delete.');
      }
    } catch {
      alert('Network error.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card" style={{ position: 'sticky', top: '80px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
          📋 Calculation History
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {records.length > 0 && (
            <span className="badge badge-info">{records.length}</span>
          )}
          <button className="btn btn-secondary btn-sm" onClick={fetchHistory}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          ⏳ Loading history…
        </div>
      )}

      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 0.9rem',
            color: 'var(--danger)',
            fontSize: '0.85rem',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            color: 'var(--text-light)',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧮</div>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No calculations yet</div>
          <div style={{ fontSize: '0.82rem' }}>Your calculations will appear here.</div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
          paddingRight: '0.25rem',
        }}
      >
        {records.map((record) => (
          <div
            key={record.id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              transition: 'box-shadow 0.15s',
            }}
          >
            {/* Summary Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                background: expanded === record.id ? 'var(--surface-2)' : 'var(--surface)',
                cursor: 'pointer',
              }}
              onClick={() => setExpanded(expanded === record.id ? null : record.id)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: 'var(--text)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {record.description}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {new Date(record.createdAt).toLocaleString()}
                </div>
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: 'var(--primary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {fmt(record.total)}
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {expanded === record.id ? '▲' : '▼'}
              </span>
            </div>

            {/* Expanded Detail */}
            {expanded === record.id && (
              <div
                style={{
                  padding: '0.75rem 0.85rem',
                  borderTop: '1px solid var(--border)',
                  background: '#fafbfc',
                }}
              >
                {/* Items */}
                <div style={{ marginBottom: '0.6rem' }}>
                  <div style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
                    Items
                  </div>
                  {record.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        color: 'var(--text)',
                        padding: '0.2rem 0',
                      }}
                    >
                      <span>{item.name} × {item.quantity}</span>
                      <span>{fmt(item.quantity * item.unitPrice)}</span>
                    </div>
                  ))}
                </div>

                {/* Breakdown */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <MiniRow label="Subtotal" value={fmt(record.subtotal)} />
                  {record.discount > 0 && <MiniRow label="Discount" value={`-${fmt(record.discount)}`} color="var(--secondary)" />}
                  <MiniRow label="Tax" value={fmt(record.tax)} />
                  <MiniRow label="Shipping" value={record.shipping === 0 ? 'FREE' : fmt(record.shipping)} color={record.shipping === 0 ? 'var(--secondary)' : undefined} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.3rem', borderTop: '1px solid var(--border)', marginTop: '0.2rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary)' }}>{fmt(record.total)}</span>
                  </div>
                </div>

                <div style={{ marginTop: '0.65rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }}
                    disabled={deletingId === record.id}
                  >
                    {deletingId === record.id ? '⏳ Deleting…' : '🗑 Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: color || 'var(--text)' }}>{value}</span>
    </div>
  );
}
