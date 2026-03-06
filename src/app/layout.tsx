import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME || 'abc'} — E-Commerce Calculator`,
  description: 'Calculate product prices, taxes, discounts, and shipping for your orders.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
