import { Atom, Scale, Sigma, LucideIcon, Beaker, Wind, FlaskConical } from 'lucide-react';

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
    activeColorClass: string;
    activeBgClass: string;
    activeBorderClass: string;
    activeIconColor: string;
    description?: string;
}

export interface PageConfig {
    id: string;
    title: string;
    path: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
    navLabel: string;
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
    {
        id: 'molarity',
        label: 'Molarity',
        href: '/molarity',
        icon: FlaskConical,
        activeColorClass: 'text-emerald-700',
        activeBgClass: 'bg-emerald-50',
        activeBorderClass: 'border-emerald-100',
        activeIconColor: 'text-emerald-600',
    },
];

export const pageConfigs: PageConfig[] = [
    {
        id: 'molar-mass',
        title: 'Molar Mass Calculator',
        path: '/molar-mass',
        icon: Atom,
        color: 'blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        description: 'Calculate molar mass and percent composition of compounds',
        navLabel: 'Molar Mass',
    },
    {
        id: 'balancer',
        title: 'Equation Balancer',
        path: '/balancer',
        icon: Scale,
        color: 'indigo',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        description: 'Balance chemical equations with step-by-step solutions',
        navLabel: 'Equation Balancer',
    },
    {
        id: 'stoichiometry',
        title: 'Stoichiometry Calculator',
        path: '/stoichiometry',
        icon: Sigma,
        color: 'teal',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200',
        description: 'Perform stoichiometric calculations for chemical reactions',
        navLabel: 'Stoichiometry',
    },
    {
        id: 'limiting-reactant',
        title: 'Limiting Reactant Calculator',
        path: '/limiting-reactant',
        icon: Beaker,
        color: 'rose',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        description: 'Find limiting reactants and theoretical yields',
        navLabel: 'Limiting Reactant',
    },
    {
        id: 'gas-laws',
        title: 'Gas Laws Calculator',
        path: '/gas-laws',
        icon: Wind,
        color: 'violet',
        bgColor: 'bg-violet-50',
        borderColor: 'border-violet-200',
        description: 'Calculate gas properties using Boyle\'s, Charles\'s, and Combined Gas Laws',
        navLabel: 'Gas Laws',
    },
    {
        id: 'molarity',
        title: 'Molarity Calculator',
        path: '/molarity',
        icon: FlaskConical,
        color: 'emerald',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        description: 'Calculate molarity, moles, volume, or mass for solutions',
        navLabel: 'Molarity',
    },
];

export const getPageByPath = (path: string): PageConfig | undefined => {
    return pageConfigs.find(page => page.path === path || path.startsWith(page.path + '/'));
};

export const getPageById = (id: string): PageConfig | undefined => {
    return pageConfigs.find(page => page.id === id);
};

export const getNavItemByHref = (href: string): NavItem | undefined => {
    return navigationConfig.find(item => item.href === href || href.startsWith(item.href + '/'));
};
