import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  DollarSign,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  ListTodo,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { ProjectPlan, PlanPhase, PlanTask } from '../types';
import { api, triggerPrintReport, exportToCsv } from '../services/api';

interface ProjectPlannerModuleProps {
  plans: ProjectPlan[];
  onRefreshData: () => void;
}

export const ProjectPlannerModule: React.FC<ProjectPlannerModuleProps> = ({
  plans,
  onRefreshData,
}) => {
  const [currentPlan, setCurrentPlan] = useState<ProjectPlan | null>(plans[0] || null);

  // Form states
  const [projectName, setProjectName] = useState('Skyline Commercial Tower Superstructure & Facade');
  const [projectType, setProjectType] = useState('Commercial High-Rise');
  const [projectLocation, setProjectLocation] = useState('Downtown Financial District, Metro Central');
  const [plotArea, setPlotArea] = useState<number>(35000);
  const [plannedBuiltUpArea, setPlannedBuiltUpArea] = useState<number>(480000);
  const [floors, setFloors] = useState<number>(38);
  const [startDate, setStartDate] = useState('2026-11-01');
  const [targetCompletionDate, setTargetCompletionDate] = useState('2027-10-30');
  const [totalBudget, setTotalBudget] = useState<number>(24000000);
  const [workers, setWorkers] = useState<number>(180);
  const [materialPreferences, setMaterialPreferences] = useState('High-performance C50/60 concrete, post-tensioned slabs, unitized curtain wall facade');
  const [requirements, setRequirements] = useState('Strict crane wind limits, downtown noise curfew, just-in-time delivery logistics');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.generateProjectPlan({
        projectName,
        projectType,
        projectLocation,
        plotArea,
        plannedBuiltUpArea,
        floors,
        startDate,
        targetCompletionDate,
        totalBudget,
        workers,
        materialPreferences,
        requirements,
      });

      if (res.success && res.plan) {
        setCurrentPlan(res.plan);
        onRefreshData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate project plan');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusToggle = async (phaseId: string, taskId: string) => {
    if (!currentPlan) return;
    const nextStatusMap: Record<string, 'Completed' | 'In Progress' | 'Pending'> = {
      Pending: 'In Progress',
      'In Progress': 'Completed',
      Completed: 'Pending',
    };

    const updatedPhases = currentPlan.phases.map((ph) => {
      if (ph.id !== phaseId) return ph;
      const updatedTasks = ph.tasks.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, status: nextStatusMap[t.status] || 'Pending' };
      });
      return { ...ph, tasks: updatedTasks };
    });

    const updatedPlan = { ...currentPlan, phases: updatedPhases };
    setCurrentPlan(updatedPlan);

    try {
      await api.updatePlan(currentPlan.id, { phases: updatedPhases });
      onRefreshData();
    } catch (err) {
      console.error('Failed to sync updated task status:', err);
    }
  };

  // Budget distribution data for Recharts
  const budgetChartData = currentPlan
    ? currentPlan.phases.map((ph, idx) => ({
        name: ph.name.split(':')[0] || `Phase ${idx + 1}`,
        value: ph.budget,
        color: ['#142B4A', '#F59E0B', '#10B981', '#6366F1', '#EC4899'][idx % 5],
      }))
    : [];

  const handlePrintPlan = () => {
    if (!currentPlan) return;
    const phasesHtml = currentPlan.phases
      .map(
        (ph) => `
        <div style="margin-bottom:16px; padding:12px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px;">
          <h3 style="margin:0 0 6px 0; color:#142B4A;">${ph.name} (${ph.durationDays} Days) — Budget: $${ph.budget.toLocaleString()}</h3>
          <p style="margin:0 0 8px 0; font-size:12px; color:#64748B;">Schedule: ${ph.startDate} to ${ph.endDate} | Status: <strong>${ph.status}</strong></p>
          <table>
            <tr><th>Task</th><th>Duration</th><th>Assignee</th><th>Priority</th><th>Status</th></tr>
            ${ph.tasks
              .map(
                (t) => `
              <tr>
                <td>${t.name}</td>
                <td>${t.durationDays}d</td>
                <td>${t.assignee}</td>
                <td>${t.priority}</td>
                <td><strong>${t.status}</strong></td>
              </tr>
            `
              )
              .join('')}
          </table>
        </div>
      `
      )
      .join('');

    const html = `
      <div class="header-meta">
        <strong>Project:</strong> ${currentPlan.projectName} (${currentPlan.projectType})<br/>
        <strong>Location:</strong> ${currentPlan.projectLocation} | <strong>Total Floors:</strong> ${currentPlan.floors}<br/>
        <strong>Target Window:</strong> ${currentPlan.startDate} to ${currentPlan.targetCompletionDate} | 
        <strong>Total Budget:</strong> $${currentPlan.totalBudget.toLocaleString()} | <strong>Workforce:</strong> ${currentPlan.workers} workers
      </div>
      <h2>Construction Execution Phases & Tasks Breakdown</h2>
      ${phasesHtml}
      <h2>Key Project Milestones</h2>
      <ul>
        ${currentPlan.milestones.map((m) => `<li><strong>${m.title} (${m.date}):</strong> ${m.criteria}</li>`).join('')}
      </ul>
      <h2>Risk Matrix & Quality Mitigation</h2>
      <ul>
        ${currentPlan.risks.map((r) => `<li><strong>${r.risk} (Severity: ${r.severity}):</strong> ${r.mitigation}</li>`).join('')}
      </ul>
    `;
    triggerPrintReport(`Project_Plan_${currentPlan.projectName.replace(/\s+/g, '_')}`, html);
  };

  const handleExportCsv = () => {
    if (!currentPlan) return;
    const rows: any[] = [];
    currentPlan.phases.forEach((ph) => {
      ph.tasks.forEach((t) => {
        rows.push({
          Phase: ph.name,
          PhaseBudget: ph.budget,
          TaskName: t.name,
          DurationDays: t.durationDays,
          Assignee: t.assignee,
          Priority: t.priority,
          Status: t.status,
        });
      });
    });
    exportToCsv(`${currentPlan.projectName}_Schedule_WBS`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#142B4A] tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-[#F59E0B]" />
            <span>AI Construction Project Planner & Master Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated master WBS phase schedules, Gantt timeline tracking, milestone gates, and risk matrix synthesis.
          </p>
        </div>

        {currentPlan && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#142B4A] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export WBS (CSV)</span>
            </button>
            <button
              onClick={handlePrintPlan}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#142B4A] hover:bg-[#1E3E66] px-3.5 py-1.5 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Print Schedule</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Plan Generation Parameters */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#142B4A] uppercase tracking-wide">
              Project Parameters & Constraints
            </h2>
            <p className="text-[11px] text-slate-500">Provide dimensions, budget, schedule window, and trades</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:ring-1 focus:ring-[#142B4A]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Type</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                >
                  <option value="Commercial High-Rise">Commercial High-Rise</option>
                  <option value="Residential Multi-Family">Residential Multi-Family</option>
                  <option value="Industrial Logistics Facility">Industrial Logistics Facility</option>
                  <option value="Civil Infrastructure / Bridge">Civil Infrastructure / Bridge</option>
                  <option value="Institutional / Hospital">Institutional / Healthcare</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Number of Floors</label>
                <input
                  type="number"
                  value={floors}
                  onChange={(e) => setFloors(Number(e.target.value))}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Budget ($ USD)</label>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono focus:ring-1 focus:ring-[#142B4A]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Workforce Peak</label>
                <input
                  type="number"
                  value={workers}
                  onChange={(e) => setWorkers(Number(e.target.value))}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Completion Date</label>
                <input
                  type="date"
                  value={targetCompletionDate}
                  onChange={(e) => setTargetCompletionDate(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Material Preferences</label>
              <textarea
                rows={2}
                value={materialPreferences}
                onChange={(e) => setMaterialPreferences(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Special Site Constraints</label>
              <textarea
                rows={2}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#142B4A] hover:bg-[#1E3E66] text-[#F59E0B] font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin"></span>
                  <span>Synthesizing Master Schedule...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Construction Plan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Schedule Timeline & Budget Visuals */}
        <div className="lg:col-span-8 space-y-6">
          {currentPlan ? (
            <div className="space-y-6">
              {/* Executive Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Total Budget</span>
                  <p className="text-xl font-black text-[#142B4A] font-mono mt-1">
                    ${(currentPlan.totalBudget / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Workforce</span>
                  <p className="text-xl font-black text-[#142B4A] font-mono mt-1">
                    {currentPlan.workers} Crew
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Phases</span>
                  <p className="text-xl font-black text-[#142B4A] font-mono mt-1">
                    {currentPlan.phases.length} Phases
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Floors</span>
                  <p className="text-xl font-black text-[#F59E0B] font-mono mt-1">
                    {currentPlan.floors} Levels
                  </p>
                </div>
              </div>

              {/* Gantt-Style Schedule Timeline */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-[#142B4A]">
                      Master Gantt Timeline & Phase Execution
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Sequential progression from substructure earthworks through dry-in envelope and MEP
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#142B4A] bg-slate-100 px-2.5 py-1 rounded-md">
                    Schedule
                  </span>
                </div>

                <div className="space-y-4">
                  {currentPlan.phases.map((phase, idx) => {
                    const statusColor =
                      phase.status === 'Completed'
                        ? 'bg-emerald-500'
                        : phase.status === 'In Progress'
                        ? 'bg-[#F59E0B]'
                        : 'bg-slate-300';

                    return (
                      <div
                        key={phase.id || idx}
                        className="p-4 rounded-xl border border-slate-200 bg-[#F5F7FA] space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-slate-900">{phase.name}</span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span>{phase.startDate} → {phase.endDate}</span>
                              <span>·</span>
                              <span>{phase.durationDays} Days</span>
                              <span>·</span>
                              <span>Dep: {phase.dependencies}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-[#142B4A] font-mono">
                              ${(phase.budget / 1000000).toFixed(2)}M
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded text-white ${
                                phase.status === 'Completed'
                                  ? 'bg-emerald-600'
                                  : phase.status === 'In Progress'
                                  ? 'bg-amber-600'
                                  : 'bg-slate-500'
                              }`}
                            >
                              {phase.status}
                            </span>
                          </div>
                        </div>

                        {/* Visual timeline bar */}
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${statusColor}`}
                            style={{
                              width:
                                phase.status === 'Completed'
                                  ? '100%'
                                  : phase.status === 'In Progress'
                                  ? '50%'
                                  : '15%',
                            }}
                          />
                        </div>

                        {/* Task breakdown list with interactive status toggles */}
                        <div className="pt-2 border-t border-slate-200/60">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Phase Deliverables & Work Packages (Click badge to toggle status):
                          </div>
                          <div className="space-y-1.5">
                            {phase.tasks.map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-slate-200/70 hover:border-slate-300"
                              >
                                <span className="font-medium text-slate-800">{task.name}</span>
                                <div className="flex items-center gap-2.5">
                                  <span className="text-[11px] text-slate-400">{task.assignee}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">{task.durationDays}d</span>
                                  <button
                                    onClick={() => handleTaskStatusToggle(phase.id, task.id)}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                                      task.status === 'Completed'
                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                        : task.status === 'In Progress'
                                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {task.status}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Budget Allocation Pie & Milestones Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget Pie Chart */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Phase Budget Allocation
                  </h4>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={budgetChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {budgetChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val: any) => [`$${(val / 1000000).toFixed(2)}M`, 'Budget']}
                          contentStyle={{ backgroundColor: '#142B4A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1 text-xs mt-2">
                    {budgetChartData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }}></span>
                          <span className="text-slate-600 truncate">{d.name}</span>
                        </div>
                        <span className="font-mono text-slate-800 font-bold ml-2">
                          ${(d.value / 1000000).toFixed(2)}M
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones & Risk Matrix */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Key Quality Milestones
                    </h4>
                    <div className="space-y-2">
                      {currentPlan.milestones.map((m, i) => (
                        <div key={i} className="text-xs p-2 rounded-lg bg-[#F5F7FA] border border-slate-200/80">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{m.title}</span>
                            <span className="text-[#F59E0B] font-mono">{m.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{m.criteria}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Identified Project Risks & Mitigations
                    </h4>
                    <div className="space-y-2">
                      {currentPlan.risks.map((r, i) => (
                        <div key={i} className="text-xs p-2 rounded-lg bg-rose-50/60 border border-rose-100">
                          <span className="font-bold text-rose-900 block">{r.risk}</span>
                          <span className="text-[11px] text-rose-800">{r.mitigation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Engineering Disclaimer */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-relaxed">
                <strong>PRELIMINARY ESTIMATE NOTICE:</strong> AI-generated construction timelines, costs, and resource schedules are generated for preliminary planning and critical path simulation. They must be validated against stamped structural drawings, local labor agreements, and geotechnical site conditions.
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">No Project Plan Selected</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Fill in the parameters on the left to develop a multimodal project plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
