import React, { useState } from 'react';
import {
  ScanSearch,
  AlertTriangle,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Printer,
  History,
  FileSpreadsheet,
  ShieldAlert,
  ArrowRight,
  Info,
  Maximize2,
} from 'lucide-react';
import { Project, CrackAnalysis } from '../types';
import { api, triggerPrintReport, exportToCsv } from '../services/api';
import { ImageDropzone } from '../components/ImageDropzone';

interface CrackDetectionModuleProps {
  projects: Project[];
  selectedProjectId: string;
  onRefreshData: () => void;
  crackAnalyses: CrackAnalysis[];
}

export const CrackDetectionModule: React.FC<CrackDetectionModuleProps> = ({
  projects,
  selectedProjectId,
  onRefreshData,
  crackAnalyses,
}) => {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'history'>('diagnostics');
  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');
  const [structureType, setStructureType] = useState('Reinforced Concrete Beam');
  const [buildingAge, setBuildingAge] = useState('18 Years');
  const [approximateWidth, setApproximateWidth] = useState('0.8 mm - 1.2 mm');
  const [crackLocation, setCrackLocation] = useState('Pier 3 Girder Web (Near Column Bearing)');
  const [observedChanges, setObservedChanges] = useState('Widened approximately 0.2 mm over previous winter cycle');
  const [notes, setNotes] = useState('Live axle loading increased due to transit detour route.');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');

  const [loading, setLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<CrackAnalysis | null>(
    crackAnalyses[0] || null
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [showOverlay, setShowOverlay] = useState(true);

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
      const res = await api.analyzeCrack({
        projectId,
        structureType,
        buildingAge,
        approximateWidth,
        crackLocation,
        observedChanges,
        notes,
        imageBase64: imageBase64 || undefined,
        imageMimeType,
      });

      if (res.success && res.analysis) {
        setCurrentRecord(res.analysis);
        onRefreshData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Crack diagnostics failed. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const handlePrintReport = () => {
    if (!currentRecord) return;
    const causesHtml = currentRecord.possibleCauses.map((c) => `<li>${c}</li>`).join('');
    const actionsHtml = currentRecord.recommendedActions.map((a) => `<li>${a}</li>`).join('');

    const html = `
      <div class="header-meta">
        <strong>Structure:</strong> ${currentRecord.structureType} | <strong>Asset:</strong> ${currentRecord.projectName}<br/>
        <strong>Location:</strong> ${currentRecord.crackLocation} | <strong>Building Age:</strong> ${currentRecord.buildingAge}<br/>
        <strong>Field Est. Width:</strong> ${currentRecord.approximateWidth} | <strong>Identified Pattern:</strong> ${currentRecord.crackType}<br/>
        <strong>Severity:</strong> <span class="badge badge-${currentRecord.severity}">${currentRecord.severity.toUpperCase()}</span> |
        <strong>Urgency:</strong> ${currentRecord.urgencyLevel}
      </div>
      <h2>Visual Pathology Findings</h2>
      <p>${currentRecord.visualFindings}</p>
      <h2>Potential Contributing Factors & Root Causes</h2>
      <ul>${causesHtml}</ul>
      <h2>Recommended Structural Engineering Actions</h2>
      <ul>${actionsHtml}</ul>
      <h2>Diagnostic Limitations</h2>
      <ul>${currentRecord.limitations.map((l) => `<li>${l}</li>`).join('')}</ul>
    `;
    triggerPrintReport(`Crack_Diagnostics_${currentRecord.structureType.replace(/\s+/g, '_')}`, html);
  };

  const handleExportCsv = () => {
    if (!crackAnalyses.length) return;
    const rows = crackAnalyses.map((c) => ({
      ID: c.id,
      Project: c.projectName,
      Structure: c.structureType,
      Pattern: c.crackType,
      Severity: c.severity,
      Urgency: c.urgencyLevel,
      Timestamp: c.timestamp,
      VisualFindings: c.visualFindings,
    }));
    exportToCsv('BuildMind_Crack_Diagnostics', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#142B4A] tracking-tight flex items-center gap-2.5">
            <ScanSearch className="w-6 h-6 text-[#F59E0B]" />
            <span>Structural Crack Detection & Diagnostics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Multimodal visual inspection of concrete elements, shear patterns, flexural tension, and settlement risks.
          </p>
        </div>

        <div className="flex p-1 bg-slate-200/80 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'diagnostics' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diagnostics Scan
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'history' ? 'bg-white text-[#142B4A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diagnostics Log ({crackAnalyses.length})
          </button>
        </div>
      </div>

      {activeTab === 'diagnostics' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Input Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#142B4A] uppercase tracking-wide">
                Structural Element Submission
              </h2>
              <p className="text-[11px] text-slate-500">Upload photograph of concrete face, beam, or facade</p>
            </div>

            <form onSubmit={handleRunAnalysis} className="space-y-4">
              <ImageDropzone
                label="Structural Photograph"
                helperText="Upload clear close-up or elevation photo of the crack"
                value={imageBase64}
                onImageSelected={handleImageSelected}
                onClear={handleClearImage}
                presetType="crack"
              />

              {/* Structure type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Structural Element Type</label>
                <select
                  value={structureType}
                  onChange={(e) => setStructureType(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#142B4A]"
                >
                  <option value="Reinforced Concrete Beam">Reinforced Concrete Beam / Girder</option>
                  <option value="Concrete Shear Wall">Concrete Shear Wall / Core</option>
                  <option value="Column / Pier">Structural Column / Bridge Pier</option>
                  <option value="Elevated Floor Slab">Elevated Post-Tensioned Slab</option>
                  <option value="Building Exterior Facade">Building Exterior Facade / Masonry</option>
                  <option value="Foundation Mat / Raft">Foundation Mat / Retaining Wall</option>
                </select>
              </div>

              {/* Building age & approximate width */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Building Age</label>
                  <input
                    type="text"
                    value={buildingAge}
                    onChange={(e) => setBuildingAge(e.target.value)}
                    placeholder="e.g. 18 Years"
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Approx. Width (Field est.)</label>
                  <input
                    type="text"
                    value={approximateWidth}
                    onChange={(e) => setApproximateWidth(e.target.value)}
                    placeholder="e.g. 0.8 mm (Hairline / Wide)"
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                  />
                </div>
              </div>

              {/* Crack location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Crack Location & Orientation</label>
                <input
                  type="text"
                  value={crackLocation}
                  onChange={(e) => setCrackLocation(e.target.value)}
                  placeholder="e.g. Pier 3 Girder Web, 45-degree angle from bearing"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                  required
                />
              </div>

              {/* Observed changes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Observed Changes Over Time</label>
                <input
                  type="text"
                  value={observedChanges}
                  onChange={(e) => setObservedChanges(e.target.value)}
                  placeholder="e.g. Propagated 5cm vertically after winter freeze-thaw"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                />
              </div>

              {/* Additional notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inspector Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Noticeable moisture seepage, spalling, or efflorescence..."
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
                    <span>Analyzing Crack Morphology...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Crack Diagnostics</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Results Pane */}
          <div className="lg:col-span-7 space-y-6">
            {currentRecord ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                {/* Result Top Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">{currentRecord.structureType}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">{currentRecord.crackLocation}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#142B4A] mt-0.5">
                      {currentRecord.crackType}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getSeverityBadge(
                        currentRecord.severity
                      )}`}
                    >
                      {currentRecord.severity} Severity
                    </span>
                    <button
                      onClick={handlePrintReport}
                      className="p-2 text-slate-600 hover:text-[#142B4A] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Print or Save Diagnostic Report"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Urgency Alert Bar */}
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">Recommended Urgency Level</p>
                      <p className="text-xs text-amber-800">{currentRecord.urgencyLevel}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-1 bg-amber-200 text-amber-900 rounded">
                    Action Plan
                  </span>
                </div>

                {/* Interactive Crack Annotation Visualizer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Visual Crack Localization & Coordinate Overlay</span>
                    <button
                      onClick={() => setShowOverlay(!showOverlay)}
                      className="text-xs font-semibold text-[#142B4A] hover:underline flex items-center gap-1"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>{showOverlay ? 'Hide Highlight Box' : 'Show Highlight Box'}</span>
                    </button>
                  </div>

                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-64 flex items-center justify-center">
                    <img
                      src={imageBase64 || currentRecord.imageUrl || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80'}
                      alt="Crack element visual"
                      className="w-full h-full object-contain"
                    />

                    {/* Bounding box visual annotation overlay */}
                    {showOverlay && currentRecord.annotationCoordinates && (
                      <div
                        className="absolute border-2 border-dashed border-[#EF4444] bg-[#EF4444]/15 rounded flex items-start justify-end p-1 transition-all"
                        style={{
                          left: `${currentRecord.annotationCoordinates.x}%`,
                          top: `${currentRecord.annotationCoordinates.y}%`,
                          width: `${currentRecord.annotationCoordinates.width}%`,
                          height: `${currentRecord.annotationCoordinates.height}%`,
                        }}
                      >
                        <span className="bg-[#EF4444] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          Detected Crack Zone ({currentRecord.crackType.split(' ')[0]})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visual Pathology Findings */}
                <div className="bg-[#F5F7FA] rounded-xl p-4 border border-slate-200/80">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Visual Pathology Findings
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentRecord.visualFindings}
                  </p>
                </div>

                {/* Contributing factors & Recommended Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100">
                    <p className="text-xs font-bold text-rose-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Potential Contributing Factors</span>
                    </p>
                    <ul className="space-y-1.5 text-xs text-rose-900">
                      {currentRecord.possibleCauses.map((cause, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Recommended Engineering Steps</span>
                    </p>
                    <ul className="space-y-1.5 text-xs text-emerald-900">
                      {currentRecord.recommendedActions.map((act, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mandatory Professional Engineer Warning */}
                <div className="p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    <span>MANDATORY PROFESSIONAL NOTICE (ACI 224.1R)</span>
                  </p>
                  This AI diagnostic provides preliminary pattern recognition and screening. Uncalibrated 2D photographs cannot establish absolute structural load capacity, internal rebar yield states, or definitive sub-surface degradation. A physical inspection by a licensed Professional Structural Engineer (PE / SE) is required before implementing structural modifications or load rating changes.
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <ScanSearch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700 text-sm">No Crack Scan Selected</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Upload a concrete photo and select structural parameters to execute multimodal crack diagnostics.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History Log */
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#142B4A]">Structural Crack Diagnostic History</h2>
              <p className="text-[11px] text-slate-500">Archive of scanned beams, columns, facades, and shear walls</p>
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
                  <th className="p-3">Structure</th>
                  <th className="p-3">Crack Pattern</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Urgency</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {crackAnalyses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-semibold text-slate-800">{item.structureType}</td>
                    <td className="p-3 text-slate-600">{item.crackType}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getSeverityBadge(
                          item.severity
                        )}`}
                      >
                        {item.severity}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{item.urgencyLevel}</td>
                    <td className="p-3 text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setCurrentRecord(item);
                          setActiveTab('diagnostics');
                        }}
                        className="text-xs text-[#142B4A] hover:text-[#F59E0B] font-bold"
                      >
                        View Details
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
