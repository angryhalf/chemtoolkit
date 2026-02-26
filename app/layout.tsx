import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChemToolkit | High School Chemistry Solver',
  description: 'A simple, interactive toolkit for Molar Mass, Balancing Equations, and Stoichiometry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-800`}>
        {children}
      </body>
    </html>
  );
}