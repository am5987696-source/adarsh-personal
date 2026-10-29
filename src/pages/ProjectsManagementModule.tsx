import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  ShieldCheck,
  Building2,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Project } from '../types';
import { api, exportToCsv } from '../services/api';

interface ProjectsManagementModuleProps {
  projects: Project[];
  onRefreshData: () => void;
  onNavigateToModule: (module: string, projectId: string) => void;
}

export const ProjectsManagementModule: React.FC<ProjectsManagementModuleProps> = ({
  projects,
  onRefreshData,
  onNavigateToModule,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchVal, setSearchVal] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [projectType, setProjectType] = useState('Commercial High-Rise');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState(15000000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetCompletionDate, setTargetCompletionDate] = useState('2028-06-30');
  const [manager, setManager] = useState('David Reynolds, PE');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesSearch =
      !searchVal ||
      p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.location.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.code.toLowerCase().includes(searchVal.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.createProject({
        name,
        code: code || `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
        projectType,
        location: location || 'Metropolitan Core',
        budget: Number(budget),
        startDate,
        targetCompletionDate,
        manager,
        description: description || 'Managed civil construction asset in BuildMind AI platform.',
      });

      if (res.success) {
        setShowCreateModal(false);
        // Reset form
        setName('');
        setCode('');
        setDescription('');
        onRefreshData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove project "${name}" from the active database?`)) return;
    try {
      await api.deleteProject(id);
      onRefreshData();
    } catch (err) {
      console.error('Delete project failed:', err);
    }
  };

  const handleExportCsv = () => {
    if (!projects.length) return;
    const rows = projects.map((p) => ({
      ID: p.id,
      Code: p.code,
      Name: p.name,
      Type: p.projectType,
      Location: p.location,
      Budget: p.budget,
      Spent: p.spent,
      ProgressPct: p.progressPercentage,
      Status: p.status,
      Manager: p.manager,
      Workers: p.workersOnSite,
      SafetyRating: p.safetyRating,
    }));
    exportToCsv('BuildMind_Construction_Projects', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#142B4A] tracking-tight flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-[#F59E0B]" />
            <span>My Construction Projects</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Central repository of civil construction assets, progress tracking, budget burn rates, and site compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#142B4A] bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#142B4A] bg-[#F59E0B] hover:bg-[#d97706] px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Construction Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search projects by name, code, or city..."
            className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#142B4A]"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium self-stretch sm:self-auto">
          {['All', 'Active', 'In Planning', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-md transition-all ${
                filterStatus === st
                  ? 'bg-white text-[#142B4A] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((proj) => {
          const budgetPct = Math.min(100, Math.round((proj.spent / proj.budget) * 100));
          return (
            <div
              key={proj.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#F59E0B] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {proj.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        proj.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {proj.status}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Rating {proj.safetyRating}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#142B4A]">{proj.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{proj.location}</span>
                </p>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Progress & Financials */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-600">Physical Milestone Completion</span>
                    <span className="text-[#142B4A]">{proj.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#142B4A] h-full rounded-full transition-all"
                      style={{ width: `${proj.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] bg-[#F5F7FA] p-3 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-slate-400 block">Total Budget</span>
                    <span className="font-bold text-slate-800 font-mono">
                      ${(proj.budget / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Committed</span>
                    <span className="font-bold text-[#F59E0B] font-mono">
                      ${(proj.spent / 1000000).toFixed(1)}M ({budgetPct}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Crew On Site</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {proj.workersOnSite} workers
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToModule('safety', proj.id)}
                      className="text-xs font-bold text-[#142B4A] hover:text-[#F59E0B] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Safety Audit
                    </button>
                    <button
                      onClick={() => onNavigateToModule('cracks', proj.id)}
                      className="text-xs font-bold text-[#142B4A] hover:text-[#F59E0B] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Crack Scan
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(proj.id, proj.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#142B4A]">
                Create New Construction Project
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grand Harbor Logistics Terminal Phase 1"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-slate-800 font-semibold focus:ring-1 focus:ring-[#142B4A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asset Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. GHL-2026-01"
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Classification</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-slate-800"
                  >
                    <option value="Commercial High-Rise">Commercial High-Rise</option>
                    <option value="Residential Multi-Family">Residential Multi-Family</option>
                    <option value="Industrial Logistics Facility">Industrial Logistics Facility</option>
                    <option value="Civil Infrastructure / Bridge">Civil Infrastructure / Bridge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jobsite Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Sector, or GPS Coordinates"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Budget ($ USD)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Director / Manager</label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Completion</label>
                  <input
                    type="date"
                    value={targetCompletionDate}
                    onChange={(e) => setTargetCompletionDate(e.target.value)}
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Structural Overview & Scope</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe framing systems, foundation type, square footage..."
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-[#142B4A] hover:bg-[#1E3E66] text-[#F59E0B] font-bold shadow transition-all cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Register Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
