'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { getPageByPath, PageConfig } from '@/lib/pageRegistry';

export function usePageConfig(): PageConfig | undefined {
    const pathname = usePathname();
    
    return useMemo(() => getPageByPath(pathname), [pathname]);
}

export function usePageTheme(pageConfig?: PageConfig) {
    return useMemo(() => {
        if (!pageConfig) {
            return {
                color: 'slate',
                bgColor: 'bg-slate-50',
                borderColor: 'border-slate-200',
                textColor: 'text-slate-800',
                buttonBg: 'bg-slate-600',
                buttonHover: 'hover:bg-slate-700',
                iconBg: 'bg-slate-50',
                iconColor: 'text-slate-600',
                resultColor: 'text-slate-600',
                stepHighlight: 'text-slate-700',
            };
        }

        const colorMap: Record<string, {
            textColor: string;
            buttonBg: string;
            buttonHover: string;
            iconBg: string;
            iconColor: string;
            resultColor: string;
            stepHighlight: string;
        }> = {
            blue: {
                textColor: 'text-blue-800',
                buttonBg: 'bg-blue-600',
                buttonHover: 'hover:bg-blue-700',
                iconBg: 'bg-blue-50',
                iconColor: 'text-blue-600',
                resultColor: 'text-blue-600',
                stepHighlight: 'text-blue-700',
            },
            indigo: {
                textColor: 'text-indigo-800',
                buttonBg: 'bg-indigo-600',
                buttonHover: 'hover:bg-indigo-700',
                iconBg: 'bg-indigo-50',
                iconColor: 'text-indigo-600',
                resultColor: 'text-indigo-600',
                stepHighlight: 'text-indigo-700',
            },
            teal: {
                textColor: 'text-teal-800',
                buttonBg: 'bg-teal-600',
                buttonHover: 'hover:bg-teal-700',
                iconBg: 'bg-teal-50',
                iconColor: 'text-teal-600',
                resultColor: 'text-teal-600',
                stepHighlight: 'text-teal-700',
            },
            rose: {
                textColor: 'text-rose-800',
                buttonBg: 'bg-rose-600',
                buttonHover: 'hover:bg-rose-700',
                iconBg: 'bg-rose-50',
                iconColor: 'text-rose-600',
                resultColor: 'text-rose-600',
                stepHighlight: 'text-rose-700',
            },
            violet: {
                textColor: 'text-violet-800',
                buttonBg: 'bg-violet-600',
                buttonHover: 'hover:bg-violet-700',
                iconBg: 'bg-violet-50',
                iconColor: 'text-violet-600',
                resultColor: 'text-violet-600',
                stepHighlight: 'text-violet-700',
            },
            emerald: {
                textColor: 'text-emerald-800',
                buttonBg: 'bg-emerald-600',
                buttonHover: 'hover:bg-emerald-700',
                iconBg: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
                resultColor: 'text-emerald-600',
                stepHighlight: 'text-emerald-700',
            },
        };

        const theme = colorMap[pageConfig.color] || colorMap.slate;

        return {
            color: pageConfig.color,
            bgColor: pageConfig.bgColor,
            borderColor: pageConfig.borderColor,
            ...theme,
        };
    }, [pageConfig]);
}
