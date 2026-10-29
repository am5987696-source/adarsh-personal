import React from 'react';
import {
  HardHat,
  ArrowRight,
  ShieldAlert,
  ScanSearch,
  Building,
  CalendarDays,
  MessageSquareCode,
  CloudSun,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Layers,
  Sparkles,
  BarChart3,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const modules = [
    {
      id: 'safety',
      title: 'Construction Site Safety Monitoring',
      desc: 'Multimodal computer vision inspecting PPE compliance, leading-edge fall protection, housekeeping, and crane clearances.',
      icon: ShieldAlert,
      badge: 'Multimodal Vision',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'cracks',
      title: 'Structural Crack Detection & Diagnostics',
      desc: 'Forensic evaluation of concrete walls, beams, columns, and slabs identifying shear, flexure, and settlement patterns.',
      icon: ScanSearch,
      badge: 'Diagnostic AI',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'valuation',
      title: 'Real Estate Valuation Intelligence',
      desc: 'Institutional-grade automated property valuation combining area, construction quality, condition, and depreciation factors.',
      icon: Building,
      badge: 'AVM Financial',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'planner',
      title: 'AI Construction Project Planner',
      desc: 'Generates multi-phase master construction schedules, WBS task breakdowns, Gantt schedules, and budget allocations.',
      icon: CalendarDays,
      badge: 'WBS & Schedule',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'assistant',
      title: 'Daily Site Assistant',
      desc: 'Interactive civil engineering advisor providing daily pre-pour checklists, inspection procedures, and progress summaries.',
      icon: MessageSquareCode,
      badge: 'Site Copilot',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'weather',
      title: 'Weather-Aware Construction Advisory',
      desc: 'Activity-specific weather risk matrix for concrete pouring, exterior coatings, roofing, excavation, and worker safety.',
      icon: CloudSun,
      badge: 'Operational Safety',
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      id: 'knowledge',
      title: 'Civil Engineering Knowledge Base',
      desc: 'Curated technical reference covering concrete technology, ACI/ASTM standards, OSHA guidelines, and expert Q&A.',
      icon: BookOpen,
      badge: 'Technical Standards',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Upload or Enter Data',
      desc: 'Submit jobsite photographs, structural crack imagery, project parameters, or site observations.',
    },
    {
      num: '02',
      title: 'Analyze with Multimodal AI',
      desc: 'Gemini 3.8 Flash evaluates visual evidence, compares technical standards, and computes risk parameters.',
    },
    {
      num: '03',
      title: 'Receive Actionable Insights',
      desc: 'Review structured findings, download inspection reports, export Gantt schedules, and act with confidence.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#142B4A]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#142B4A] via-[#142B4A] to-[#1E3E66] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle architectural grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#F59E0B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Multimodal AI Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Build Smarter. <br />
                Build Safer. <br />
                <span className="text-[#F59E0B]">Build with AI.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Transform construction data into intelligent decisions. Analyze site images, detect potential safety risks, assess structural cracks, estimate property values, and plan construction projects using multimodal artificial intelligence.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-2.5 bg-[#F59E0B] hover:bg-[#d97706] text-[#142B4A] font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <span>Explore AI Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-white/20 transition-all"
                >
                  <span>Discover Features</span>
                </button>
              </div>

              <div className="pt-6 border-t border-slate-700/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Multimodal Vision & Structured Data</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ACI, ASTM & OSHA Aligned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Exportable Inspection Reports</span>
                </div>
              </div>
            </div>

            {/* Right Architectural Visual / Interactive Mockup */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="ml-2 font-mono text-[11px] text-slate-300">BuildMind Multimodal Telemetry</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-mono">LIVE FEED</span>
                </div>

                {/* Simulated Visual Overlay */}
                <div className="relative mt-3 rounded-lg overflow-hidden bg-slate-950 h-64 border border-slate-800">
                  <svg className="w-full h-full" viewBox="0 0 400 240">
                    <rect width="400" height="240" fill="#1e293b" />
                    {/* Building frame */}
                    <rect x="50" y="30" width="180" height="190" fill="#334155" stroke="#475569" strokeWidth="2" />
                    <line x1="50" y1="70" x2="230" y2="70" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="50" y1="110" x2="230" y2="110" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="50" y1="150" x2="230" y2="150" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="50" y1="190" x2="230" y2="190" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="110" y1="30" x2="110" y2="220" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="170" y1="30" x2="170" y2="220" stroke="#64748b" strokeWidth="1.5" />
                    {/* Tower Crane */}
                    <line x1="280" y1="20" x2="280" y2="220" stroke="#f59e0b" strokeWidth="3" />
                    <line x1="220" y1="40" x2="380" y2="40" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1="330" y1="40" x2="330" y2="100" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />
                    {/* Bounding Box 1: Fall Risk */}
                    <rect x="160" y="65" width="65" height="30" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" />
                    <text x="162" y="60" fill="#ef4444" fontSize="8" fontFamily="sans-serif" fontWeight="bold">FALL HAZARD: PERIMETER</text>
                    {/* Bounding Box 2: Crane clearance */}
                    <circle cx="330" cy="100" r="12" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="1.5" />
                  </svg>

                  {/* Glassmorphic metric badge */}
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-lg p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400">Target Asset</p>
                      <p className="font-bold text-white">Skyline Tower Level 14</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Risk Assessment</p>
                      <span className="font-bold text-amber-400">HIGH RISK (Action Req.)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                    <p className="text-[10px] text-slate-400">Multimodal Confidence</p>
                    <p className="font-bold text-white text-sm">96.4%</p>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                    <p className="text-[10px] text-slate-400">Inspection Time</p>
                    <p className="font-bold text-emerald-400 text-sm">1.8s</p>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                    <p className="text-[10px] text-slate-400">OSHA Codes</p>
                    <p className="font-bold text-[#F59E0B] text-sm">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Key Benefits Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">
              AI-Powered Construction Analysis
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Synthesize visual site imagery, technical engineering specifications, and field logs into concrete, verifiable findings.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">
              Intelligent Safety Monitoring
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detect missing edge guardrails, non-compliant PPE, and crane swing radius hazards before incidents occur.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">
              Data-Driven Project Planning
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generate work breakdown structures, milestone targets, and risk mitigations tailored to structural project scale.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <MessageSquareCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">
              Real-Time Construction Assistance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              On-demand site copilot for pre-pour checklists, concrete temperature hydration limits, and trade coordination.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Showcase (7 Main Modules) */}
      <section id="features-section" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-2">
            Complete Enterprise Suite
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142B4A] tracking-tight">
            Seven Specialized Modules for Modern Construction
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Every module is fully functional and connected directly to backend AI analysis pipelines, structured validation, and persistent records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => onNavigate(m.id)}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-[#142B4A]/30 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#142B4A]/5 group-hover:bg-[#142B4A] text-[#142B4A] group-hover:text-[#F59E0B] flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#142B4A] transition-colors mb-2">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#142B4A] group-hover:text-[#F59E0B] transition-colors">
                  <span>Open Intelligence Module</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="workflow-section" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-2">
              Three-Step Execution Workflow
            </p>
            <h2 className="text-3xl font-extrabold text-[#142B4A]">
              From Raw Jobsite Input to Certified Action
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((s, index) => (
              <div key={s.num} className="relative bg-[#F5F7FA] rounded-2xl p-8 border border-slate-200">
                <span className="text-3xl font-black text-[#F59E0B]/80 font-mono mb-4 block">
                  {s.num}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Actual Data Metrics */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#142B4A] rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center sm:text-left border-b border-slate-700/80 pb-8 mb-8">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Capital Tracked</p>
              <p className="text-3xl lg:text-4xl font-extrabold text-[#F59E0B] mt-1 font-mono">$149,700,000</p>
              <p className="text-[11px] text-slate-400 mt-1">Across 4 major civil developments</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Safety Compliance Score</p>
              <p className="text-3xl lg:text-4xl font-extrabold text-white mt-1 font-mono">98.2%</p>
              <p className="text-[11px] text-slate-400 mt-1">Based on OSHA standard audits</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Site Personnel</p>
              <p className="text-3xl lg:text-4xl font-extrabold text-white mt-1 font-mono">339 Workers</p>
              <p className="text-[11px] text-slate-400 mt-1">Live shift safety monitoring</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Technical Knowledge Articles</p>
              <p className="text-3xl lg:text-4xl font-extrabold text-emerald-400 mt-1 font-mono">10 Disciplines</p>
              <p className="text-[11px] text-slate-400 mt-1">ACI, ASTM, AISC standards</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">Ready to streamline your jobsite intelligence?</h3>
              <p className="text-xs text-slate-300 mt-1">
                Access multimodal hazard detection, crack diagnostics, and project schedules immediately.
              </p>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-[#F59E0B] hover:bg-[#d97706] text-[#142B4A] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow transition-all whitespace-nowrap"
            >
              Enter AI Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
