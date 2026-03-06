'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Calculator from '@/components/Calculator';
import CalculationHistory from '@/components/CalculationHistory';

export default function HomePage() {
  const [historyKey, setHistoryKey] = useState(0);

  const handleCalculationSaved = () => {
    setHistoryKey((k) => k + 1);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          <Calculator onCalculationSaved={handleCalculationSaved} />
          <CalculationHistory key={historyKey} />
        </div>
      </main>
    </div>
  );
}
