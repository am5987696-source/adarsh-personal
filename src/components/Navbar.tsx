import React from 'react';
import { HardHat, ArrowRight, ShieldCheck, Cpu, Building2, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#142B4A] text-white border-b border-slate-700/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B] flex items-center justify-center text-[#142B4A] shadow-inner group-hover:scale-105 transition-transform">
            <HardHat className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-extrabold text-lg tracking-tight">
              <span>BuildMind</span>
              <span className="text-[#F59E0B] text-xs font-semibold px-1.5 py-0.5 rounded bg-[#F59E0B]/20 border border-[#F59E0B]/40">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium tracking-wide uppercase">
              Multimodal Construction Intelligence
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200">
          <button
            onClick={() => onNavigate('landing')}
            className={`hover:text-[#F59E0B] transition-colors ${currentView === 'landing' ? 'text-[#F59E0B]' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-[#F59E0B] transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                document.getElementById('workflow-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-[#F59E0B] transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate('knowledge')}
            className="hover:text-[#F59E0B] transition-colors"
          >
            Knowledge Base
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#d97706] text-[#142B4A] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
