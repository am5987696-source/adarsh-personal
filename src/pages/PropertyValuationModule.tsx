import React, { useState } from 'react';
import {
  Building,
  DollarSign,
  TrendingUp,
  MapPin,
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ValuationEstimate } from '../types';
import { api, triggerPrintReport, exportToCsv } from '../services/api';

interface PropertyValuationModuleProps {
  valuations: ValuationEstimate[];
  onRefreshData: () => void;
}

export const PropertyValuationModule: React.FC<PropertyValuationModuleProps> = ({
  valuations,
  onRefreshData,
}) => {
  const [propertyType, setPropertyType] = useState('Commercial Office Space');
  const [location, setLocation] = useState('Downtown Financial District, Metro Central');
  const [totalArea, setTotalArea] = useState<number>(12500);
  const [builtUpArea, setBuiltUpArea] = useState<number>(10800);
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(6);
  const [age, setAge] = useState<number>(3);
  const [constructionQuality, setConstructionQuality] = useState('Grade A+ Corporate');
  const [condition, setCondition] = useState('Excellent');
  const [floorNumber, setFloorNumber] = useState('Floor 18 (High-Rise Panoramic)');
  const [amenities, setAmenities] = useState('LEED Gold Certified, 12 Dedicated EV Parking, Dual Fiber Redundancy, 24/7 Security Concierge');
  const [parkingAvailability, setParkingAvailability] = useState('12 Dedicated Subterranean Spaces');
  const [nearbyFacilities, setNearbyFacilities] = useState('Multimodal Metro Terminal (150m), Commercial Banking District, International Airport (20 min)');

  const [loading, setLoading] = useState(false);
  const [currentValuation, setCurrentValuation] = useState<ValuationEstimate | null>(
    valuations[0] || null
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.estimateValuation({
        propertyType,
        location,
        totalArea: Number(totalArea),
        builtUpArea: Number(builtUpArea),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        age: Number(age),
        constructionQuality,
        condition,
        floorNumber,
        amenities,
        parkingAvailability,
        nearbyFacilities,
      });

      if (res.success && res.valuation) {
        setCurrentValuation(res.valuation);
        onRefreshData();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Valuation estimate failed');
    } finally {
      setLoading(false);
    }
  };

  const valuationRangeData = currentValuation
    ? [
        { label: 'Conservative Low', value: currentValuation.estimatedValueRange.low / 1000000, color: '#94A3B8' },
        { label: 'Expected Benchmark', value: currentValuation.estimatedValueRange.expected / 1000000, color: '#F59E0B' },
        { label: 'Optimistic High', value: currentValuation.estimatedValueRange.high / 1000000, color: '#10B981' },
      ]
    : [];

  const handlePrint = () => {
    if (!currentValuation) return;
    const factorsHtml = currentValuation.keyFactors.map((f) => `<li>${f}</li>`).join('');
    const strengthsHtml = currentValuation.strengths.map((s) => `<li>${s}</li>`).join('');

    const html = `
      <div class="header-meta">
        <strong>Property:</strong> ${currentValuation.propertyType} | <strong>Location:</strong> ${currentValuation.location}<br/>
        <strong>Total Area:</strong> ${currentValuation.totalArea.toLocaleString()} sq ft | <strong>Built-up:</strong> ${currentValuation.builtUpArea.toLocaleString()} sq ft<br/>
        <strong>Construction Quality:</strong> ${currentValuation.constructionQuality} | <strong>Condition:</strong> ${currentValuation.condition}<br/>
        <strong>Estimated Value:</strong> $${currentValuation.estimatedValue.toLocaleString()} ($${currentValuation.pricePerUnit}/sq ft)
      </div>
      <h2>Valuation Range Breakdown</h2>
      <table>
        <tr><th>Conservative Low</th><th>Expected Market Value</th><th>Optimistic High</th></tr>
        <tr>
          <td>$${currentValuation.estimatedValueRange.low.toLocaleString()}</td>
          <td><strong>$${currentValuation.estimatedValueRange.expected.toLocaleString()}</strong></td>
          <td>$${currentValuation.estimatedValueRange.high.toLocaleString()}</td>
        </tr>
      </table>
      <h2>Key Valuation Determinants</h2>
      <ul>${factorsHtml}</ul>
      <h2>Property Strengths & Competitive Advantages</h2>
      <ul>${strengthsHtml}</ul>
      <h2>Appraisal Methodology</h2>
      <p>${currentValuation.methodology}</p>
    `;
    triggerPrintReport(`Valuation_${currentValuation.propertyType.replace(/\s+/g, '_')}`, html);
  };

  const handleExportCsv = () => {
    if (!valuations.length) return;
    const rows = valuations.map((v) => ({
      ID: v.id,
      PropertyType: v.propertyType,
      Location: v.location,
      TotalArea: v.totalArea,
      BuiltUpArea: v.builtUpArea,
      EstimatedValue: v.estimatedValue,
      PricePerSqFt: v.pricePerUnit,
      ConstructionQuality: v.constructionQuality,
      Condition: v.condition,
      Date: v.timestamp,
    }));
    exportToCsv('BuildMind_Property_Valuations', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#142B4A] tracking-tight flex items-center gap-2.5">
            <Building className="w-6 h-6 text-[#F59E0B]" />
            <span>AI Real Estate Valuation & Feasibility</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated valuation model (AVM) combining structural quality, age depreciation, area efficiency, and comparative rate algorithms.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#142B4A] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-center"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Export All Valuations (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#142B4A] uppercase tracking-wide">
              Property Specifications & Asset Inputs
            </h2>
            <p className="text-[11px] text-slate-500">Provide dimensions, construction specifications, and site location</p>
          </div>

          <form onSubmit={handleEstimate} className="space-y-4">
            {/* Property type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Property Asset Classification</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#142B4A]"
              >
                <option value="Commercial Office Space">Commercial Office Space / Floor Plate</option>
                <option value="Residential Multi-Family Apartment">Residential High-Rise Condominium</option>
                <option value="Industrial Logistics Warehouse">Industrial Logistics & Cold Storage</option>
                <option value="Mixed-Use Retail & Residential">Mixed-Use Commercial & Retail Podium</option>
                <option value="Luxury Residential Villa">Luxury Residential Estate / Villa</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Property Location / Submarket</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                  required
                />
              </div>
            </div>

            {/* Areas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Plot / Gross Area (sq ft)</label>
                <input
                  type="number"
                  value={totalArea}
                  onChange={(e) => setTotalArea(Number(e.target.value))}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Built-Up Area (sq ft)</label>
                <input
                  type="number"
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                  required
                />
              </div>
            </div>

            {/* Construction Quality & Condition */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Construction Quality</label>
                <select
                  value={constructionQuality}
                  onChange={(e) => setConstructionQuality(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                >
                  <option value="Grade A+ Corporate">Grade A+ Corporate</option>
                  <option value="Ultra Luxury">Ultra Luxury Architectural</option>
                  <option value="Premium Architectural">Premium Standard</option>
                  <option value="Standard Commercial / Residential">Standard Commercial</option>
                  <option value="Economy / Basic">Economy / Basic</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Structural Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                >
                  <option value="Brand New / Pristine">Brand New / Pristine</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair / Needs Modernization">Fair / Needs Modernization</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>

            {/* Age & Floor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Asset Age (Years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Floor Level / Elevation</label>
                <input
                  type="text"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
                />
              </div>
            </div>

            {/* Amenities & Parking */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Key Amenities & Building Features</label>
              <input
                type="text"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#142B4A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parking & Transit Access</label>
              <input
                type="text"
                value={parkingAvailability}
                onChange={(e) => setParkingAvailability(e.target.value)}
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
                  <span>Calculating Valuation Metrics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Property Valuation</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Valuation Output Pane */}
        <div className="lg:col-span-7 space-y-6">
          {currentValuation ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-500">{currentValuation.propertyType}</span>
                  <h3 className="text-lg font-bold text-[#142B4A]">
                    Automated Appraisal Estimate
                  </h3>
                  <p className="text-xs text-slate-500">{currentValuation.location}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrint}
                    className="p-2 text-slate-600 hover:text-[#142B4A] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Print or Save PDF Report"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Big Financial Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#142B4A] to-[#1E3E66] text-white p-5 rounded-2xl shadow-sm">
                  <p className="text-xs text-slate-300 uppercase font-semibold">Expected Market Value</p>
                  <p className="text-3xl font-black text-[#F59E0B] mt-1 font-mono">
                    ${currentValuation.estimatedValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-300 mt-2">
                    ${currentValuation.pricePerUnit} / sq ft (Built-Up)
                  </p>
                </div>

                <div className="bg-[#F5F7FA] border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Valuation Spread Range</p>
                    <div className="flex items-baseline justify-between mt-2 font-mono">
                      <span className="text-xs text-slate-600">Low: ${(currentValuation.estimatedValueRange.low / 1000000).toFixed(2)}M</span>
                      <span className="text-sm font-bold text-emerald-700">High: ${(currentValuation.estimatedValueRange.high / 1000000).toFixed(2)}M</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#F59E0B] h-full w-2/3 mx-auto rounded-full" />
                  </div>
                </div>
              </div>

              {/* Recharts Valuation Range Comparison */}
              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  Valuation Range Sensitivity Model ($ Millions)
                </h4>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={valuationRangeData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis unit="M" tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(val: any) => [`$${val} Million`, 'Estimated Value']}
                        contentStyle={{ backgroundColor: '#142B4A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Bar dataKey="value" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key Determinants & Strengths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#F59E0B]" />
                    <span>Key Valuation Drivers</span>
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {currentValuation.keyFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#F59E0B] font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Asset Strengths</span>
                  </p>
                  <ul className="space-y-1.5 text-xs text-emerald-800">
                    {currentValuation.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Methodology & Legal Notice */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                <strong>APPRAISAL ADVISORY & METHODOLOGY:</strong> {currentValuation.methodology}. Estimates provided are indicative for planning and preliminary screening. They do not constitute formal, certified appraisal reports (MAI, RICS, or USPAP accredited) or legally binding financing commitments.
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">No Property Valuation Selected</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Fill in property details on the left to compute automated valuations and comparative charts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
