import Link from 'next/link';
import { Atom, Scale, Sigma, ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function HomePage() {
  return (
    <AnimatedBackground>
      {/* Hero Section */}
      <div className="relative max-w-4xl mx-auto text-center py-20 lg:py-32 px-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          Chemistry Made <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Simple</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop struggling with manual calculations. Use this interactive toolkit to solve for molar mass, balance chemical equations, and perform stoichiometry.
        </p>

        <div className="flex justify-center">
          <Link
            href="/molar-mass"
            className="px-8 py-3.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2 group"
          >
            Start Calculating
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">

          {/* Card 1: Molar Mass */}
          <Link href="/molar-mass" className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all flex flex-col">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Atom size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Molar Mass Calculator</h3>
            <p className="text-slate-500 text-sm leading-relaxed flex-grow">
              Build molecules visually and instantly calculate total molar mass and percent composition with detailed breakdowns.
            </p>
            <div className="mt-4 text-blue-600 font-medium text-sm flex items-center gap-1">
              Open Tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Equation Balancer */}
          <Link href="/balancer" className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all flex flex-col">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Scale size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Equation Balancer</h3>
            <p className="text-slate-500 text-sm leading-relaxed flex-grow">
              Input your reactants and products to automatically balance chemical equations using algebraic methods.
            </p>
            <div className="mt-4 text-indigo-600 font-medium text-sm flex items-center gap-1">
              Open Tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Stoichiometry */}
          <Link href="/stoichiometry" className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-200 transition-all flex flex-col">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Sigma size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Stoichiometry Solver</h3>
            <p className="text-slate-500 text-sm leading-relaxed flex-grow">
              Solve mass-to-mass problems easily. Get a textbook-style grid and dimensional analysis steps automatically.
            </p>
            <div className="mt-4 text-teal-600 font-medium text-sm flex items-center gap-1">
              Open Tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </div>
    </AnimatedBackground>
  );
}
