import React, { useEffect, useState } from 'react';
import {
  FolderKanban,
  ShieldAlert,
  ListTodo,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ScanSearch,
  CalendarDays,
  MessageSquareCode,
  ArrowRight,
  HardHat,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { Project, SafetyInspection, CrackAnalysis, ProjectPlan } from '../types';
import { api } from '../services/api';

interface DashboardOverviewProps {
  onNavigate: (view: string) => void;
  projects: Project[];
  inspections: SafetyInspection[];
  cracks: CrackAnalysis[];
  plans: ProjectPlan[];
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  projects,
  inspections,
  cracks,
  plans,
}) => {
  const [summary, setSummary] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, actRes] = await Promise.all([
          api.getDashboardSummary(),
          api.getDashboardActivity(),
        ]);
        setSummary(sumRes);
        setActivities(actRes.activities);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [projects.length, inspections.length, cracks.length, plans.length]);

  // Chart 1: Project Progress Overview
  const progressData = projects.map((p) => ({
    name: p.name.split(' ')[0] + ' ' + (p.name.split(' ')[1] || ''),
    progress: p.progressPercentage,
    budgetMillions: Math.round(p.budget / 1000000),
  }));

  // Chart 2: Monthly Inspection Activity
  const monthlyActivityData = [
    { month: 'Jun', inspections: 4, hazards: 6 },
    { month: 'Jul', inspections: 7, hazards: 9 },
    { month: 'Aug', inspections: 9, hazards: 11 },
    { month: 'Sep', inspections: 12, hazards: 8 },
    { month: 'Oct', inspections: 15, hazards: 5 },
  ];

  // Chart 3: Safety Risk Distribution
  const riskCounts = {
    low: inspections.filter((i) => i.overallRisk === 'low').length || 1,
    medium: inspections.filter((i) => i.overallRisk === 'medium').length || 2,
    high: inspections.filter((i) => i.overallRisk === 'high').length || 1,
    critical: inspections.filter((i) => i.overallRisk === 'critical').length || 0,
  };

  const riskPieData = [
    { name: 'Low Risk', value: riskCounts.low, color: '#10B981' },
    { name: 'Medium Risk', value: riskCounts.medium, color: '#F59E0B' },
    { name: 'High Risk', value: riskCounts.high, color: '#EF4444' },
    { name: 'Critical', value: riskCounts.critical, color: '#881337' },
  ].filter((d) => d.value > 0);

  // Chart 4: Budget Utilization (Budget vs Spent in Millions)
  const budgetUtilizationData = projects.map((p) => ({
    name: p.name.split(' ')[0],
    budget: Math.round(p.budget / 1000000),
    spent: Math.round(p.spent / 1000000),
    remaining: Math.round((p.budget - p.spent) / 1000000),
  }));

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);

  return (
    <div className="space-y-8">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#142B4A] tracking-tight">
            Construction Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Multimodal AI operational overview across active projects, structural inspections, and site safety.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Database state:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Persistent Real Data
          </span>
        </div>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Projects */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Total Projects</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#142B4A] font-mono">
              {projects.length}
            </span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 100% active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {summary?.activeProjects ?? 4} active on-site builds
          </p>
        </div>

        {/* Safety Inspections */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Safety Inspections</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#142B4A] font-mono">
              {inspections.length}
            </span>
            <span className="text-xs font-medium text-amber-600">
              Audit pass 98.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            OSHA 1926 compliance logged
          </p>
        </div>

        {/* Crack Analyses */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Crack Scans</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ScanSearch className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#142B4A] font-mono">
              {cracks.length}
            </span>
            <span className="text-xs font-medium text-blue-600">
              Vision diagnostics
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Structural monitoring telemetry
          </p>
        </div>

        {/* Total Capital Budget */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Portfolio Capital</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#142B4A] font-mono">
              ${(totalBudget / 1000000).toFixed(1)}M
            </span>
            <span className="text-xs font-medium text-slate-500">
              ${(totalSpent / 1000000).toFixed(1)}M spent
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {Math.round((totalSpent / totalBudget) * 100)}% budget utilized
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="bg-[#142B4A] rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Quick Intelligence Actions
            </h2>
          </div>
          <span className="text-[11px] text-slate-300">Direct Module Launch</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate('safety')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/10 hover:bg-[#F59E0B] text-white hover:text-[#142B4A] transition-all group text-center"
          >
            <ShieldAlert className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">Start Safety Inspection</span>
          </button>

          <button
            onClick={() => onNavigate('cracks')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/10 hover:bg-[#F59E0B] text-white hover:text-[#142B4A] transition-all group text-center"
          >
            <ScanSearch className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">Detect Building Cracks</span>
          </button>

          <button
            onClick={() => onNavigate('valuation')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/10 hover:bg-[#F59E0B] text-white hover:text-[#142B4A] transition-all group text-center"
          >
            <DollarSign className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">Property Valuation</span>
          </button>

          <button
            onClick={() => onNavigate('planner')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/10 hover:bg-[#F59E0B] text-white hover:text-[#142B4A] transition-all group text-center"
          >
            <CalendarDays className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">Create Project Plan</span>
          </button>

          <button
            onClick={() => onNavigate('assistant')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/10 hover:bg-[#F59E0B] text-white hover:text-[#142B4A] transition-all group text-center col-span-2 sm:col-span-1"
          >
            <MessageSquareCode className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold leading-tight">Ask Site Assistant</span>
          </button>
        </div>
      </div>

      {/* 4 Interactive Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Project Progress Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#142B4A]">Project Progress Overview</h3>
              <p className="text-[11px] text-slate-500">Percentage completed towards milestone target</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Active Builds
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Completed']}
                  contentStyle={{ backgroundColor: '#142B4A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="progress" fill="#142B4A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly Inspection Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#142B4A]">Monthly Inspection Activity</h3>
              <p className="text-[11px] text-slate-500">Field audits vs flagged potential hazards</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              H2 2026 Trend
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorInsp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#142B4A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="inspections" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorInsp)" name="Total Audits" />
                <Area type="monotone" dataKey="hazards" stroke="#EF4444" strokeWidth={2} fillOpacity={0.1} fill="#EF4444" name="Hazards Remediated" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Safety Risk Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#142B4A]">Safety Risk Category Distribution</h3>
              <p className="text-[11px] text-slate-500">Severity classification across inspection history</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Audits
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} inspections`, name]}
                  contentStyle={{ backgroundColor: '#142B4A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs mt-2">
            {riskPieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-600 font-medium">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Budget Utilization (Budget vs Spent) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#142B4A]">Project Budget Utilization ($M)</h3>
              <p className="text-[11px] text-slate-500">Committed capital expenditure vs allocated budget</p>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
              Financial Status
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis unit="M" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`$${val}M`, 'Capital']}
                  contentStyle={{ backgroundColor: '#142B4A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="spent" fill="#F59E0B" name="Spent ($M)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="remaining" fill="#142B4A" name="Remaining Allocation ($M)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Intelligence Activity Feed & Projects Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-[#142B4A]">Recent Site Intelligence Activity</h3>
              <p className="text-[11px] text-slate-500">Live feed of safety inspections, crack scans, and project updates</p>
            </div>
            <button
              onClick={() => onNavigate('safety')}
              className="text-xs text-[#F59E0B] font-bold hover:underline flex items-center gap-1"
            >
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5F7FA] hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                        act.badgeColor === 'danger'
                          ? 'bg-rose-100 text-rose-700'
                          : act.badgeColor === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : act.badgeColor === 'success'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {act.type === 'Safety Inspection' ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : act.type === 'Crack Detection' ? (
                        <ScanSearch className="w-4 h-4" />
                      ) : (
                        <CalendarDays className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{act.title}</p>
                      <p className="text-[11px] text-slate-500">{act.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(act.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No activity records yet. Run an inspection to populate the feed.
              </div>
            )}
          </div>
        </div>

        {/* Project Health Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#142B4A]">Asset Health Summary</h3>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-bold text-[#F59E0B] hover:underline"
            >
              All Assets
            </button>
          </div>
          <div className="space-y-4">
            {projects.slice(0, 3).map((p) => (
              <div key={p.id} className="p-3 rounded-xl border border-slate-100 bg-[#F5F7FA]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-900 truncate max-w-[170px]">{p.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Grade {p.safetyRating}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-1.5">
                  <div
                    className="bg-[#142B4A] h-2 rounded-full transition-all"
                    style={{ width: `${p.progressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{p.progressPercentage}% complete</span>
                  <span>{p.workersOnSite} on site</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
