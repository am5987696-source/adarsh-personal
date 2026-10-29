import React from 'react';
import { HardHat, ShieldCheck, Mail, Globe, FileText, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B192C] text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded bg-[#F59E0B] flex items-center justify-center text-[#142B4A]">
                <HardHat className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span>BuildMind AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise multimodal construction intelligence platform integrating site safety monitoring, structural crack diagnostics, automated project scheduling, and property valuation.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gemini 3.8 Flash Multimodal Engine</span>
            </div>
          </div>

          {/* Platform Modules */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Intelligence Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('safety')} className="hover:text-white transition-colors">
                  Site Safety Monitor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cracks')} className="hover:text-white transition-colors">
                  Structural Crack Detection
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('valuation')} className="hover:text-white transition-colors">
                  Real Estate Valuation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('planner')} className="hover:text-white transition-colors">
                  AI Construction Planner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assistant')} className="hover:text-white transition-colors">
                  Daily Site Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('weather')} className="hover:text-white transition-colors">
                  Weather-Aware Advisory
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Resources & Codes</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('knowledge')} className="hover:text-white transition-colors">
                  Civil Engineering Knowledge Base
                </button>
              </li>
              <li>
                <span className="text-slate-500">ACI 318 & 224 Concrete Specs</span>
              </li>
              <li>
                <span className="text-slate-500">OSHA 1926 Safety Matrix</span>
              </li>
              <li>
                <span className="text-slate-500">ASTM Testing Reference</span>
              </li>
              <li>
                <span className="text-slate-500">IBC 2024 International Code</span>
              </li>
            </ul>
          </div>

          {/* Compliance & Contact */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Platform Compliance</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Observations and preliminary analytics are powered by server-side generative artificial intelligence. Always verify critical load decisions with a certified Professional Engineer (PE).
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>am5987696@gmail.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>BuildMind Global Infrastructure</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} BuildMind AI Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Security Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
