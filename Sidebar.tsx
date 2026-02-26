"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Atom } from 'lucide-react';
import { navigationConfig } from '@/lib/navigation';

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="fixed top-0 left-0 z-40 h-screen w-64 border-r border-slate-200 bg-white shadow-sm flex flex-col">

            {/* Logo Header */}
            <Link
                href="/"
                className="flex h-16 items-center gap-2 border-b border-slate-200 px-6 hover:bg-slate-50 transition-colors"
            >
                <Atom className="text-blue-600" size={24} />
                <h1 className="text-lg font-bold tracking-tight text-slate-900">ChemToolkit</h1>
            </Link>

            {/* Navigation Links */}
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
    );
};