"use client";

import React from 'react';

interface FormulaProps {
    html: string;
    className?: string;
}

export const Formula: React.FC<FormulaProps> = ({ html, className = '' }) => (
    <span 
        className={className} 
        dangerouslySetInnerHTML={{ __html: html }} 
    />
);
