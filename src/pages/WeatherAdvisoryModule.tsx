import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Sun,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { WeatherAdvisory } from '../types';
import { api } from '../services/api';

interface WeatherAdvisoryModuleProps {
  defaultLocation?: string;
}

export const WeatherAdvisoryModule: React.FC<WeatherAdvisoryModuleProps> = ({
  defaultLocation,
}) => {
  const [location, setLocation] = useState(defaultLocation || 'Downtown Financial District, Metro Central');
  const [plannedActivity, setPlannedActivity] = useState('Mass Concrete Pouring (Transfer Slab)');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);

  const [loading, setLoading] = useState(false);
  const [advisoryData, setAdvisoryData] = useState<WeatherAdvisory | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAdvisory = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await api.getWeatherAdvisory({
        location,
        plannedActivity,
        scheduledDate,
      });
      setAdvisoryData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to retrieve weather advisory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisory();
  }, [plannedActivity]);

  const getSuitabilityBadge = (suitability: string) => {
    switch (suitability) {
      case 'optimal':
        return { text: 'OPTIMAL CONDITIONS', style: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'caution':
        return { text: 'PROCEED WITH CAUTION', style: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'restricted':
        return { text: 'RESTRICTED / MODIFIED', style: 'bg-orange-100 text-orange-800 border-orange-300' };
      default:
        return { text: 'HAZARDOUS / HALT OPERATION', style: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#142B4A] tracking-tight flex items-center gap-2.5">
            <CloudSun className="w-6 h-6 text-[#F59E0B]" />
            <span>Weather-Aware Construction Advisory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic operational guidelines calibrated for thermal hydration, wind speed crane cutoffs, and rain delays.
          </p>
        </div>
      </div>

      {/* Input Selector Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchAdvisory();
          }}
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Planned Activity</label>
            <select
              value={plannedActivity}
              onChange={(e) => setPlannedActivity(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-semibold focus:ring-1 focus:ring-[#142B4A]"
            >
              <option value="Mass Concrete Pouring (Transfer Slab)">Mass Concrete Pouring (Transfer Slab)</option>
              <option value="Tower Crane Heavy Hoisting Operations">Tower Crane Heavy Hoisting Operations</option>
              <option value="Exterior Facade Silicone Caulking & Painting">Exterior Facade Silicone Caulking & Painting</option>
              <option value="Deep Foundation Earthworks & Trench Excavation">Deep Foundation Earthworks & Excavation</option>
              <option value="Roof Elastomeric Membrane Hot-Applied Torch-on">Roof Membrane Waterproofing</option>
              <option value="High-Elevation Scaffolding Erection">High-Elevation Scaffolding Erection</option>
              <option value="Outdoor Rebar Crew Full-Day Shift">Outdoor Rebar Crew Full-Day Shift (Heat Index)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Jobsite Location</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#142B4A] hover:bg-[#1E3E66] text-[#F59E0B] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin"></span>
                <span>Fetching Weather...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Evaluate Weather Risk</span>
              </>
            )}
          </button>
        </form>
      </div>

      {advisoryData && (
        <div className="space-y-6">
          {/* Current Weather Snapshot Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Temperature</span>
              <p className="text-2xl font-black text-[#142B4A] font-mono mt-1">
                {advisoryData.weather.temperatureC}°C
              </p>
              <p className="text-[10px] text-slate-500">{advisoryData.weather.temperatureF}°F</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Precipitation</span>
              <p className="text-2xl font-black text-blue-600 font-mono mt-1 flex items-center justify-center gap-1">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span>{advisoryData.weather.precipitationProbability}%</span>
              </p>
              <p className="text-[10px] text-slate-500">Rain risk</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Wind Velocity</span>
              <p className="text-2xl font-black text-[#142B4A] font-mono mt-1 flex items-center justify-center gap-1">
                <Wind className="w-4 h-4 text-slate-500" />
                <span>{advisoryData.weather.windSpeedKmh}</span>
              </p>
              <p className="text-[10px] text-slate-500">km/h steady</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Humidity</span>
              <p className="text-2xl font-black text-[#142B4A] font-mono mt-1">
                {advisoryData.weather.humidityPercent}%
              </p>
              <p className="text-[10px] text-slate-500">Relative humidity</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">UV Solar Index</span>
              <p className="text-2xl font-black text-[#F59E0B] font-mono mt-1 flex items-center justify-center gap-1">
                <Sun className="w-4 h-4 text-[#F59E0B]" />
                <span>{advisoryData.weather.uvIndex}</span>
              </p>
              <p className="text-[10px] text-slate-500">Moderate solar load</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Air Quality</span>
              <p className="text-xs font-black text-emerald-700 mt-2">
                {advisoryData.weather.airQualityIndex}
              </p>
              <p className="text-[10px] text-slate-500">Clear breathing</p>
            </div>
          </div>

          {/* Activity Verdict Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Operational Recommendation for:
                </span>
                <h3 className="text-xl font-extrabold text-[#142B4A] mt-0.5">
                  {plannedActivity}
                </h3>
              </div>

              {(() => {
                const badge = getSuitabilityBadge(advisoryData.advisory.suitability);
                return (
                  <span
                    className={`text-xs font-extrabold uppercase px-3 py-1.5 rounded-full border ${badge.style}`}
                  >
                    {badge.text}
                  </span>
                );
              })()}
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
              {advisoryData.advisory.summary}
            </div>

            {/* Best time window banner */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">Recommended Operational Time Window</p>
                  <p className="text-xs text-emerald-800">{advisoryData.advisory.bestTimeWindow}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-1 bg-emerald-200 text-emerald-900 rounded">
                Optimal Slot
              </span>
            </div>

            {/* Key risks and precautions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100">
                <p className="text-xs font-bold text-rose-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Atmospheric & Operational Risks</span>
                </p>
                <ul className="space-y-1.5 text-xs text-rose-800">
                  {advisoryData.advisory.keyRisks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                  <span>Mandatory Jobsite Mitigations</span>
                </p>
                <ul className="space-y-1.5 text-xs text-blue-800">
                  {advisoryData.advisory.recommendedPrecautions.map((prec, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{prec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mandatory Weather Notice */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-relaxed">
              <strong>SAFETY CRITICAL PROTOCOL:</strong> Weather advisories provide automated guidance based on atmospheric data models. High-consequence activities such as tower crane lifting (critical limit typically 38–45 km/h depending on manufacturer load chart) and hot-weather mass concrete placing (ACI 305R limits) must adhere strictly to site anemometer readings and manufacturer specifications.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
