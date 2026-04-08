'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Atom, Menu, X } from 'lucide-react';
import { navigationConfig } from '@/lib/pageRegistry';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const pathname = usePathname();

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed top-0 left-0 z-40 h-screen w-64 border-r border-slate-200 bg-white shadow-sm flex flex-col
                transition-transform duration-300 lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>

                <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 hover:bg-slate-50 transition-colors -ml-2 px-2 py-1 rounded-lg"
                        onClick={onClose}
                    >
                        <Atom className="text-blue-600" size={24} />
                        <h1 className="text-lg font-bold tracking-tight text-slate-900">ChemToolkit</h1>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded-md hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                    {navigationConfig.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                        const linkClasses = isActive
                            ? `${item.activeBgClass} ${item.activeColorClass} shadow-sm border ${item.activeBorderClass}`
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent';

                        const iconClasses = isActive
                            ? item.activeIconColor
                            : 'text-slate-400';

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={onClose}
                                className={`
                    flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                    ${linkClasses}
                  `}
                            >
                                <item.icon size={18} className={iconClasses} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export function useSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(prev => !prev);
    return { isOpen, open, close, toggle };
}
