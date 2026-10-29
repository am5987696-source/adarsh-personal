import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Download,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Printer,
  History,
  FileSpreadsheet,
  AlertOctagon,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Project, SafetyInspection } from '../types';
import { api, triggerPrintReport, exportToCsv } from '../services/api';
import { ImageDropzone } from '../components/ImageDropzone';

interface SafetyMonitorModuleProps {
  projects: Project[];
  selectedProjectId: string;
  onRefreshData: () => void;
  inspections: SafetyInspection[];
}

export const SafetyMonitorModule: React.FC<SafetyMonitorModuleProps> = ({
  projects,
  selectedProjectId,
  onRefreshData,
  inspections,
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');
  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');
  const [location, setLocation] = useState('Level 14 Perimeter Formwork Deck');
  const [conditions, setConditions] = useState('Dry slab, overcast, moderate wind (22 km/h), active ironwork shift');
  const [notes, setNotes] = useState('Leading edge shuttering progress review prior to next pour cycle.');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');

  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<SafetyInspection | null>(
    inspections[0] || null
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageSelected = (base64: string, mime: string) => {
    setImageBase64(base64);
    setImageMimeType(mime);
    setErrorMsg('');
  };

  const handleClearImage = () => {
    setImageBase64('');
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const selectedProj = projects.find((p) => p.id === projectId);
      const res = await api.analyzeSafety({
        projectId,
        location,
        conditions,
        notes,
        imageBase64: imageBase64 || undefined,
        imageMimeType,
        inspectorName: 'David Reynolds, PE',
      });

      if (res.success && res.analysis) {
        setCurrentResult(res.analysis);
        onRefreshData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Inspection analysis failed. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const handleDownloadReport = () => {
    if (!currentResult) return;
    const hazardsHtml = currentResult.hazards
      .map(
        (h) => `
        <div class="hazard-item">
          <strong>${h.title}</strong> — <span class="badge badge-${h.severity}">${h.severity.toUpperCase()} (Priority: ${h.priority})</span>
          <p style="margin:4px 0;"><strong>Evidence:</strong> ${h.evidence}</p>
          <p style="margin:4px 0;"><strong>Description:</strong> ${h.description}</p>
          <p style="margin:4px 0; color:#142B4A;"><strong>Corrective Action:</strong> ${h.recommendedAction}</p>
        </div>
      `
      )
      .join('');

    const html = `
      <div class="header-meta">
        <strong>Project:</strong> ${currentResult.projectName} | <strong>Location:</strong> ${currentResult.location}<br/>
        <strong>Inspector:</strong> ${currentResult.inspectorName} | <strong>Conditions:</strong> ${currentResult.conditions}<br/>
        <strong>Overall Risk Assessment:</strong> <span class="badge badge-${currentResult.overallRisk}">${currentResult.overallRisk.toUpperCase()}</span>
      </div>
      <h2>Executive Summary</h2>
      <p>${currentResult.summary}</p>
      <h2>Identified Potential Hazards (${currentResult.hazards.length})</h2>
      ${hazardsHtml}
      <h2>Site Recommendations</h2>
      <ul>
        ${currentResult.recommendations.map((r) => `<li>${r}</li>`).join('')}
      </ul>
      <h2>Analysis Limitations</h2>
      <ul>
        ${currentResult.limitations.map((l) => `<li>${l}</li>`).join('')}
      </ul>
    `;
    triggerPrintReport(`Safety_Inspection_${currentResult.projectName.replace(/\s+/g, '_')}`, html);
  };

  const handleExportCsv = () => {
    if (!inspections.length) return;
    const rows = inspections.map((i) => ({
      ID: i.id,
      Project: i.projectName,
      Location: i.location,
      Timestamp: i.timestamp,
      OverallRisk: i.overallRisk,
      HazardsCount: i.hazards.length,
      Summary: i.summary,
    }));
    exportToCsv('BuildMind_Safety_Inspections', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#142B4A] tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-[#F59E0B]" />
            <span>Construction Site Safety Monitoring</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Multimodal AI audit evaluating PPE, working at heights, fall arrest, housekeeping, and electrical safety.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-200/80 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('scan')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'scan' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inspection & Analysis
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'history' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audit Records ({inspections.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'scan' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#142B4A] uppercase tracking-wide">
                New Safety Audit Submission
              </h2>
              <p className="text-[11px] text-slate-500">Provide site imagery and environmental metadata</p>
            </div>

            <form onSubmit={handleRunAnalysis} className="space-y-4">
              {/* Image Uploader */}
              <ImageDropzone
                label="Site Photo or Hazard Vantage Point"
                helperText="Upload JPG/PNG of scaffolding, deck edge, or rigging zone"
                value={imageBase64}
                onImageSelected={handleImageSelected}
                onClear={handleClearImage}
                presetType="safety"
              />

              {/* Project selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Project Asset</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#142B4A]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Inspection Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specific Inspection Location</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Level 14 South Formwork Cantilever Edge"
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                    required
                  />
                </div>
              </div>

              {/* Environmental Conditions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Site Environmental Conditions</label>
                <input
                  type="text"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="e.g. Clear, dry slab, wind 25 km/h, active crane hoisting"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inspector Observations & Field Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional context on active trades, work permits, or temporary controls..."
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
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
                    <span>Running Multimodal Safety AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Safety Inspection</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Results Pane */}
          <div className="lg:col-span-7 space-y-6">
            {currentResult ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                {/* Result Top Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">{currentResult.projectName}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">{currentResult.location}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#142B4A] mt-0.5">
                      Safety Diagnostic Assessment
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getRiskColor(
                        currentResult.overallRisk
                      )}`}
                    >
                      {currentResult.overallRisk} RISK
                    </span>
                    <button
                      onClick={handleDownloadReport}
                      className="p-2 text-slate-600 hover:text-[#142B4A] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Print or Save Official PDF Report"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-[#F5F7FA] rounded-xl p-4 border border-slate-200/80">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Executive Finding Summary
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentResult.summary}
                  </p>
                </div>

                {/* Hazards List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Identified Potential Hazards ({currentResult.hazards.length})
                    </h4>
                    <span className="text-[11px] text-slate-400">Classified per severity</span>
                  </div>

                  <div className="space-y-3">
                    {currentResult.hazards.map((hazard, index) => (
                      <div
                        key={hazard.id || index}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{hazard.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getRiskColor(
                                hazard.severity
                              )}`}
                            >
                              {hazard.severity}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              Priority: {hazard.priority}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          <strong className="text-slate-800">Visual Evidence:</strong> {hazard.evidence}
                        </p>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          <strong className="text-slate-800">Description:</strong> {hazard.description}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-xs text-[#142B4A]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="font-medium">
                            <strong>Recommended Corrective Action:</strong> {hazard.recommendedAction}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations & Limitations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Recommended Site Directives</span>
                    </p>
                    <ul className="space-y-1.5 text-xs text-emerald-800">
                      {currentResult.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
                    <p className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-amber-700" />
                      <span>AI Model Limitations & Uncertainty</span>
                    </p>
                    <ul className="space-y-1.5 text-xs text-amber-800">
                      {currentResult.limitations.map((lim, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{lim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Crucial Standard Disclaimer */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-relaxed">
                  <strong>CRITICAL SAFETY MANDATE:</strong> AI observations represent preliminary screening based on available visual cues and field descriptions. Absence of flagged hazards in an uploaded image does not certify a jobsite as safe. Always adhere to OSHA 1926 standards and verify physical barriers with a designated Competent Person on site.
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700 text-sm">No Inspection Selected</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Submit an image and site parameters on the left to run an automated multimodal safety inspection.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#142B4A]">Historical Site Safety Audits</h2>
              <p className="text-[11px] text-slate-500">Log of all multimodal assessments conducted across assets</p>
            </div>
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#142B4A] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Asset / Project</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Hazards</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inspections.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-semibold text-slate-800">{item.projectName}</td>
                    <td className="p-3 text-slate-600">{item.location}</td>
                    <td className="p-3 text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getRiskColor(
                          item.overallRisk
                        )}`}
                      >
                        {item.overallRisk}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{item.hazards.length} flagged</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setCurrentResult(item);
                          setActiveTab('scan');
                        }}
                        className="text-xs text-[#142B4A] hover:text-[#F59E0B] font-bold"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
