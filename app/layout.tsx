import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SigFigProvider } from '@/lib/SigFigContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChemToolkit',
  description: 'A simple, interactive toolkit for molar mass, balancing chemical equations, stoichiometry, and finding limiting reactants.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full m-0 p-0 bg-slate-50 text-slate-800`}>
        <SigFigProvider>
          {children}
        </SigFigProvider>
      </body>
    </html>
  );
}