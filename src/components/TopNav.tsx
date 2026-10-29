import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Project, User } from '../types';

interface TopNavProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  currentUser: User | null;
  onSearch: (query: string) => void;
  onNavigate: (view: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  currentUser,
  onSearch,
  onNavigate,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  const notifications = [
    {
      id: 1,
      title: 'Safety Alert: Level 14 Deck',
      desc: 'Inspection flagged perimeter edge cable requirement.',
      time: '18m ago',
      level: 'high',
    },
    {
      id: 2,
      title: 'Crack Telemetry Updated',
      desc: 'Pier 3 girder NDT diagnostics recorded in log.',
      time: '2h ago',
      level: 'info',
    },
    {
      id: 3,
      title: 'Weather Advisory Active',
      desc: 'High wind forecasted (28 km/h); check crane limits.',
      time: '3h ago',
      level: 'warning',
    },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchVal}
            onChange={handleSearchChange}
            placeholder="Search projects, inspection records, crack scans, or knowledge base..."
            className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#142B4A] focus:border-[#142B4A]"
          />
          {searchVal && (
            <button
              onClick={() => {
                setSearchVal('');
                onSearch('');
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Active Project Dropdown Switcher */}
        <div className="hidden lg:flex items-center gap-2 border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-1.5 text-xs">
          <Building2 className="w-3.5 h-3.5 text-[#142B4A]" />
          <span className="text-slate-500 font-medium">Active Asset:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-transparent font-semibold text-[#142B4A] focus:outline-none cursor-pointer max-w-[190px] truncate"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* AI Engine Status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-md text-[11px] font-medium text-slate-700 border border-slate-200">
          <Sparkles className="w-3 h-3 text-[#F59E0B]" />
          <span>Gemini 3.8 Flash</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowHelp(false);
            }}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F59E0B]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Site Notifications</span>
                <span className="text-[10px] text-slate-400">3 new</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs transition-colors">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Modal toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowHelp(!showHelp);
              setShowNotifications(false);
            }}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Quick Help & Instructions"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {showHelp && (
            <div className="absolute right-0 mt-2 w-84 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900">BuildMind AI Guide</span>
                <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-slate-600 mb-2 leading-relaxed">
                BuildMind AI processes site images, numerical parameters, and civil engineering specifications.
              </p>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Use <strong>Site Safety</strong> to inspect PPE and height hazards.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Use <strong>Crack Detection</strong> to analyze shear, flexural, or settlement cracks.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Use <strong>Project Planner</strong> to generate Gantt phase schedules.</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* User profile avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#142B4A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {currentUser?.name?.slice(0, 2).toUpperCase() || 'DR'}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">
              {currentUser?.name || 'David Reynolds, PE'}
            </p>
            <p className="text-[10px] text-slate-500">Licensed Professional Engineer</p>
          </div>
        </div>
      </div>
    </header>
  );
};
