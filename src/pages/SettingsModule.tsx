import React, { useState } from 'react';
import {
  Settings,
  User as UserIcon,
  Building,
  Shield,
  Database,
  Cpu,
  CheckCircle2,
  Save,
  Bell,
  Scale,
  Sparkles,
} from 'lucide-react';
import { User } from '../types';

interface SettingsModuleProps {
  currentUser: User | null;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({ currentUser }) => {
  const [name, setName] = useState(currentUser?.name || 'David Reynolds, PE');
  const [email, setEmail] = useState(currentUser?.email || 'am5987696@gmail.com');
  const [company, setCompany] = useState(currentUser?.company || 'Vanguard Civil Construction Corp.');
  const [role, setRole] = useState(currentUser?.role || 'Senior Project Director');

  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('metric');
  const [riskSensitivity, setRiskSensitivity] = useState<'high' | 'standard'>('high');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-[#142B4A] tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#F59E0B]" />
          <span>Platform Settings & Engineering Preferences</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage user credentials, organization licensing, AI model telemetry, and engineering units.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <UserIcon className="w-4 h-4 text-[#142B4A]" />
            <h2 className="text-sm font-bold text-[#142B4A] uppercase tracking-wide">
              Inspector & Professional Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name & Credentials</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-slate-800 font-semibold focus:ring-1 focus:ring-[#142B4A]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Professional Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Organization / Contracting Firm</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Role / Job Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Engineering Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Scale className="w-4 h-4 text-[#142B4A]" />
            <h2 className="text-sm font-bold text-[#142B4A] uppercase tracking-wide">
              Engineering Calculations & Unit Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Measurement Unit System</label>
              <select
                value={unitSystem}
                onChange={(e: any) => setUnitSystem(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-slate-800"
              >
                <option value="metric">Metric (SI) — mm, meters, m², MPa, °C</option>
                <option value="imperial">Imperial (US Customary) — in, feet, sq ft, psi, °F</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">AI Hazard Sensitivity Threshold</label>
              <select
                value={riskSensitivity}
                onChange={(e: any) => setRiskSensitivity(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-slate-800"
              >
                <option value="high">Conservative / High Sensitivity (Flag all potential ambiguities)</option>
                <option value="standard">Standard OSHA / Regulatory Baseline</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Engine & Database Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Cpu className="w-4 h-4 text-[#142B4A]" />
            <h2 className="text-sm font-bold text-[#142B4A] uppercase tracking-wide">
              Server-Side AI Model & Storage Architecture
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7FA] border border-slate-200">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <div>
                  <p className="font-bold text-slate-800">Gemini 3.8 Flash Multimodal Engine</p>
                  <p className="text-[11px] text-slate-500">Configured via server-side `@google/genai` TypeScript SDK</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7FA] border border-slate-200">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-bold text-slate-800">Persistent Storage Engine</p>
                  <p className="text-[11px] text-slate-500">Atomic file-backed JSON database store with automated backup</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
                CONNECTED
              </span>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Engineering preferences saved successfully.</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#142B4A] hover:bg-[#1E3E66] text-[#F59E0B] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl shadow transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
