import { Atom, Scale, Sigma, LucideIcon, Beaker, Wind } from 'lucide-react';

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
    activeColorClass: string;
    activeBgClass: string;
    activeBorderClass: string;
    activeIconColor: string;
}

export const navigationConfig: NavItem[] = [
    {
        id: 'molar-mass',
        label: 'Molar Mass',
        href: '/molar-mass',
        icon: Atom,
        activeColorClass: 'text-blue-700',
        activeBgClass: 'bg-blue-50',
        activeBorderClass: 'border-blue-100',
        activeIconColor: 'text-blue-600',
    },
    {
        id: 'balancer',
        label: 'Equation Balancer',
        href: '/balancer',
        icon: Scale,
        activeColorClass: 'text-indigo-700',
        activeBgClass: 'bg-indigo-50',
        activeBorderClass: 'border-indigo-100',
        activeIconColor: 'text-indigo-600',
    },
    {
        id: 'stoichiometry',
        label: 'Stoichiometry',
        href: '/stoichiometry',
        icon: Sigma,
        activeColorClass: 'text-teal-700',
        activeBgClass: 'bg-teal-50',
        activeBorderClass: 'border-teal-100',
        activeIconColor: 'text-teal-600',
    },
    {
        id: 'limiting-reactant',
        label: 'Limiting Reactant',
        href: '/limiting-reactant',
        icon: Beaker,
        activeColorClass: 'text-rose-700',
        activeBgClass: 'bg-rose-50',
        activeBorderClass: 'border-rose-100',
        activeIconColor: 'text-rose-600',
    },
    {
        id: 'gas-laws',
        label: 'Gas Laws',
        href: '/gas-laws',
        icon: Wind,
        activeColorClass: 'text-violet-700',
        activeBgClass: 'bg-violet-50',
        activeBorderClass: 'border-violet-100',
        activeIconColor: 'text-violet-600',
    },
];