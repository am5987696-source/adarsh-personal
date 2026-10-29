import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  ScanSearch,
  Building,
  CalendarDays,
  MessageSquareCode,
  CloudSun,
  BookOpen,
  History,
  Settings,
  HardHat,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentUser: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  collapsed,
  onToggleCollapse,
  currentUser,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'My Projects', icon: FolderKanban },
    { id: 'safety', label: 'Site Safety Monitor', icon: ShieldAlert, badge: 'AI' },
    { id: 'cracks', label: 'Crack Detection', icon: ScanSearch, badge: 'Vision' },
    { id: 'valuation', label: 'Real Estate Valuation', icon: Building },
    { id: 'planner', label: 'Project Planner', icon: CalendarDays, badge: 'AI' },
    { id: 'assistant', label: 'Daily Site Assistant', icon: MessageSquareCode },
    { id: 'weather', label: 'Weather Advisory', icon: CloudSun },
    { id: 'knowledge', label: 'Construction Knowledge', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 bg-[#142B4A] text-white flex flex-col border-r border-slate-700/60 transition-all duration-300 shadow-xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/60">
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden select-none"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B] flex items-center justify-center text-[#142B4A] flex-shrink-0 font-bold shadow-md">
            <HardHat className="w-6 h-6 stroke-[2.2]" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="font-extrabold text-base tracking-tight text-white">BuildMind</span>
              <span className="text-[#F59E0B] text-xs font-semibold ml-1.5 px-1 py-0.5 rounded bg-[#F59E0B]/20">
                AI
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-[#F59E0B] text-[#142B4A] font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  isActive ? 'text-[#142B4A]' : 'text-slate-400 group-hover:text-[#F59E0B]'
                }`}
              />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold tracking-wide ${
                        isActive
                          ? 'bg-[#142B4A] text-[#F59E0B]'
                          : 'bg-slate-800 text-[#F59E0B] border border-[#F59E0B]/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom user card */}
      <div className="p-3 border-t border-slate-700/60 bg-slate-900/40">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                DR
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser?.name || 'David Reynolds, PE'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentUser?.role || 'Senior Project Director'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('landing')}
              title="Return to Public Landing Page"
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('landing')}
            title="Public View"
            className="w-full flex justify-center py-2 text-slate-400 hover:text-white"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
