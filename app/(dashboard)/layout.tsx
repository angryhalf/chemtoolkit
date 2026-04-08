"use client";

import { Sidebar, useSidebar } from '@/components/Sidebar';
import { SigFigSelector } from '@/components/SigFigSelector';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isOpen, close, toggle } = useSidebar();

    return (
        <div className="flex h-screen">
            <Sidebar isOpen={isOpen} onClose={close} />
            
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-20 flex items-center px-4">
                <button
                    onClick={toggle}
                    className="p-2 rounded-md hover:bg-slate-100"
                >
                    <Menu size={24} />
                </button>
                <span className="ml-3 font-bold text-slate-900">ChemToolkit</span>
            </div>

            <main className="flex-1 lg:ml-64 overflow-auto bg-slate-50 pt-14 lg:pt-0">
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-2 flex justify-end">
                    <SigFigSelector />
                </div>
                {children}
            </main>
        </div>
    );
}