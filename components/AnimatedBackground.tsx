"use client";

import React, { useState, useEffect } from 'react';

export const AnimatedBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative min-h-screen bg-slate-50 overflow-hidden">
            {/* SVG Filter Definition */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id="gooey-filter">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            {/* 
         Blob Container 
         - filter: url(#gooey-filter) applies the effect
      */}
            <div className="absolute inset-0 z-0 overflow-hidden" style={{ filter: 'url(#gooey-filter)' }}>

                {/* Mouse Follower Blob (Still uses px for accurate pointer tracking) */}
                <div
                    className="absolute pointer-events-none rounded-full opacity-70 transition-transform duration-100 ease-out"
                    style={{
                        width: '50em', // Larger size
                        height: '50em',
                        background: 'radial-gradient(circle, rgba(147, 197, 253, 0.8) 0%, rgba(147, 197, 253, 0) 70%)',
                        transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`, // Pixel offset for centering
                    }}
                ></div>

                {/* Orbital Blobs (Sized in em) */}

                {/* Blob 1: Large Indigo */}
                <div
                    className="absolute top-1/2 left-1/2 rounded-full animate-orbit"
                    style={{
                        width: '50em',
                        height: '50em',
                        background: 'radial-gradient(circle, rgba(199, 210, 254, 0.8) 0%, rgba(199, 210, 254, 0) 70%)',
                        '--orbit-radius': '10em',
                        marginTop: '-15em', // Half of height
                        marginLeft: '-15em', // Half of width
                        animationDuration: '20s',
                    } as React.CSSProperties}
                ></div>

                {/* Blob 2: Extra Large Teal */}
                <div
                    className="absolute top-1/2 left-1/2 rounded-full animate-orbit"
                    style={{
                        width: '45em',
                        height: '45em',
                        background: 'radial-gradient(circle, rgba(153, 246, 228, 0.8) 0%, rgba(153, 246, 228, 0) 70%)',
                        '--orbit-radius': '20em',
                        marginTop: '-20em',
                        marginLeft: '-20em',
                        animationDuration: '25s',
                        animationDirection: 'reverse',
                    } as React.CSSProperties}
                ></div>

                {/* Blob 3: Huge Purple */}
                <div
                    className="absolute top-1/2 left-1/2 rounded-full animate-orbit"
                    style={{
                        width: '55em',
                        height: '50em',
                        background: 'radial-gradient(circle, rgba(233, 213, 255, 0.8) 0%, rgba(233, 213, 255, 0) 70%)',
                        '--orbit-radius': '25em',
                        marginTop: '-22.5em',
                        marginLeft: '-22.5em',
                        animationDuration: '30s',
                    } as React.CSSProperties}
                ></div>

                {/* Blob 4: Medium Sky Blue */}
                <div
                    className="absolute top-1/2 left-1/2 rounded-full animate-orbit"
                    style={{
                        width: '40em',
                        height: '40em',
                        background: 'radial-gradient(circle, rgba(186, 230, 253, 0.8) 0%, rgba(186, 230, 253, 0) 70%)',
                        '--orbit-radius': '5em',
                        marginTop: '-12.5em',
                        marginLeft: '-12.5em',
                        animationDuration: '15s',
                        animationDirection: 'reverse',
                    } as React.CSSProperties}
                ></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};