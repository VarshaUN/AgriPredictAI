import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkeletonCard from '@/components/SkeletonCard';
import ErrorCard from '@/components/ErrorCard';
import { API } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import { Loader2, RotateCcw, BarChart3, CheckCircle2, Sprout, Beaker, FlaskConical, Thermometer, Edit2, Save, X, CalendarDays, Bell, BellRing, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const CROPS = ["Rice", "Wheat", "Sugarcane", "Cotton", "Tomato", "Potato", "Maize", "Pulses", "Others"];
const SEASONS = ["Kharif", "Rabi", "Zaid"];
const SOIL_TYPES = ["Loamy", "Clay", "Sandy"] as const;

const MOCK_RESULT = {
  yield_kg_per_acre: 2400,
  profit_inr: 38500,
  confidence: 91,
  recommendations: [
    "Apply 40kg Urea before sowing",
    "Irrigate every 7 days during growth phase",
    "Monitor for brown spot disease in humid conditions",
  ],
};

const AnimatedCounter = ({ target, prefix = "", suffix = "", duration = 800 }: { target: number; prefix?: string; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);
  return <span>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
};

const PredictYield = () => {
  const { isDemoMode, user, updateUser } = useAuth();
  const [form, setForm] = useState({
    crop: '',
    season: '',
    fertilizerAmount: '',
    pesticideAmount: '',
    soil_type: 'Loamy',                               // YieldInputRequest.soil_type
    area: String(user?.land_area_acres || ''),          // YieldInputRequest.area
    // Auto-filled from soil profile
    n: user?.soilDetails?.nitrogen || 0,
    p: user?.soilDetails?.phosphorus || 0,
    k: user?.soilDetails?.potassium || 0,
    ph: user?.soilDetails?.ph || 7.0
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<typeof MOCK_RESULT | null>(null);

  // /predict-profit MSP recalculator state
  const [customMsp, setCustomMsp] = useState('');
  const [mspLoading, setMspLoading] = useState(false);
  const [mspProfit, setMspProfit] = useState<number | null>(null);

  // Harvest planner
  const [reminderDates, setReminderDates] = useState({ sowingDate: '', harvestDate: '' });
  const [reminderSet, setReminderSet] = useState(false);

  const harvestDaysLeft = reminderDates.harvestDate
    ? Math.ceil((new Date(reminderDates.harvestDate).getTime() - Date.now()) / 86400000)
    : null;

  const alertStartDate = reminderDates.harvestDate
    ? new Date(new Date(reminderDates.harvestDate).getTime() - 15 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const handleSetReminder = () => {
    if (!reminderDates.sowingDate || !reminderDates.harvestDate) {
      toast.error('Please select both sowing and harvest dates.');
      return;
    }
    if (new Date(reminderDates.harvestDate) <= new Date(reminderDates.sowingDate)) {
      toast.error('Harvest date must be after sowing date.');
      return;
    }
    const reminder = {
      crop: form.crop,
      season: form.season,
      sowingDate: reminderDates.sowingDate,
      harvestDate: reminderDates.harvestDate,
      alertStartDate: new Date(new Date(reminderDates.harvestDate).getTime() - 15 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    const existing = (user as any)?.harvestReminders || [];
    updateUser({ harvestReminders: [...existing, reminder] } as any);
    setReminderSet(true);
    toast.success(`Market alerts will start from ${alertStartDate}!`, { duration: 5000 });
  };

  // Soil inline edit
  const [isEditingSoil, setIsEditingSoil] = useState(false);
  const [soilDraft, setSoilDraft] = useState({ n: form.n, p: form.p, k: form.k, ph: form.ph, area: form.area });

  const handleSoilSave = async () => {
    const soilPayload = {
      nitrogen: Number(soilDraft.n),
      phosphorus: Number(soilDraft.p),
      potassium: Number(soilDraft.k),
      ph: Number(soilDraft.ph),
      land_area_acres: Number(soilDraft.area) || undefined,
    };
    updateUser({ soilDetails: { nitrogen: soilPayload.nitrogen, phosphorus: soilPayload.phosphorus, potassium: soilPayload.potassium, ph: soilPayload.ph }, land_area_acres: soilPayload.land_area_acres });
    setForm(prev => ({ ...prev, n: soilPayload.nitrogen, p: soilPayload.phosphorus, k: soilPayload.potassium, ph: soilPayload.ph, area: String(soilDraft.area) }));
    setIsEditingSoil(false);

    // Persist to backend — SoilUpdateRequest now accepts land_area_acres
    if (user?.access_token && user.access_token !== 'demo-token-123') {
      try {
        await fetch(import.meta.env.VITE_API_URL + '/auth/profile/soil', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.access_token}` },
          body: JSON.stringify(soilPayload),
        });
      } catch { /* non-critical */ }
    }

    toast.success('Soil profile updated!');
  };

  const handleSoilCancel = () => {
    setSoilDraft({ n: form.n, p: form.p, k: form.k, ph: form.ph, area: form.area });
    setIsEditingSoil(false);
  };

  useEffect(() => {
    if (user?.soilDetails) {
      setForm(prev => ({
        ...prev,
        n: user.soilDetails!.nitrogen,
        p: user.soilDetails!.phosphorus,
        k: user.soilDetails!.potassium,
        ph: user.soilDetails!.ph || 7.0
      }));
    }
  }, [user]);

  const update = (key: string, value: string | number) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.soilDetails) {
      toast.error('Please complete your soil profile first!');
      return;
    }
    setStatus('loading');
    try {
      // Step 1: Save yield input
      const saveRes = await fetch(API.saveYieldInput, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify({
          crop_name: form.crop,
          season: form.season,
          area: Number(form.area) || 1,
          fertilizer: Number(form.fertilizerAmount),
          pesticide: Number(form.pesticideAmount),
          soil_type: form.soil_type.toLowerCase(),   // backend expects lowercase
        }),
      });
      if (!saveRes.ok) throw new Error();

      // Step 2: Get prediction
      const res = await fetch(API.getYieldPredict, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`
        },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      setResult({
        yield_kg_per_acre: data.prediction.predicted_yield,
        profit_inr: data.profit.estimated_profit_per_acre,
        confidence: 91,
        recommendations: [
          `Best season for ${form.crop}: ${form.season}`,
          `Apply ${form.fertilizerAmount}kg fertilizer as planned`,
          `Monitor crop health regularly`
        ]
      });
      setStatus('success');
    } catch {
      await new Promise(r => setTimeout(r, 1500));
      setResult(MOCK_RESULT);
      setStatus('success');
      if (!isDemoMode) toast.info('Using demo logic — API unavailable');
    }
  };


  const reset = () => {
    setStatus('idle');
    setResult(null);
    setMspProfit(null);
    setCustomMsp('');
  };

  // POST /predict-profit — query params: predicted_yield, crop, msp_price
  // Response: ProfitResponse { estimated_profit_per_acre, currency }
  const handleMspRecalculate = async () => {
    const msp = parseFloat(customMsp);
    if (!result || isNaN(msp) || msp <= 0) {
      toast.error('Enter a valid MSP price first.');
      return;
    }
    setMspLoading(true);
    try {
      const params = new URLSearchParams({
        predicted_yield: String(result.yield_kg_per_acre),
        crop: form.crop,
        msp_price: String(msp),
      });
      const res = await fetch(`${API.predictProfit}?${params}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user?.access_token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Backend ProfitResponse: { estimated_profit_per_acre, currency }
      setMspProfit(data.estimated_profit_per_acre);
      toast.success('Profit recalculated with custom MSP!');
    } catch {
      // Fallback: simple local estimate
      const estimatedProfit = Math.round((result.yield_kg_per_acre * msp) / 100);
      setMspProfit(estimatedProfit);
      toast.info('Estimated locally — API unavailable');
    } finally {
      setMspLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <Navbar />
      <div className="view-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Advanced Yield Intelligence</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Predict Your Harvest</h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto lg:mx-0">
              Get an accurate forecast by combining your current farming inputs with your stored soil profile.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_0.4fr] gap-8">
            <div className="card-premium p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Crop Selection</label>
                    <select value={form.crop} onChange={e => update('crop', e.target.value)} required
                      className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm">
                      <option value="">Select Crop</option>
                      {CROPS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Growth Season</label>
                    <select value={form.season} onChange={e => update('season', e.target.value)} required
                      className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm">
                      <option value="">Select Season</option>
                      {SEASONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2 flex items-center gap-2">
                      <Beaker className="h-4 w-4 text-emerald-500" /> Fertilizer Amount (kg/acre)
                    </label>
                    <input
                      type="number" step="1" min="0" placeholder="e.g. 50"
                      value={form.fertilizerAmount}
                      onChange={e => update('fertilizerAmount', e.target.value)}
                      required
                      className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2 flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-emerald-500" /> Pesticide Amount (kg/acre)
                    </label>
                    <input
                      type="number" step="0.1" min="0" placeholder="e.g. 2.5"
                      value={form.pesticideAmount}
                      onChange={e => update('pesticideAmount', e.target.value)}
                      required
                      className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  {/* Farm Area — YieldInputRequest.area */}
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2 flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-emerald-500" /> Farm Area (acres)
                    </label>
                    <input
                      type="number" step="0.1" min="0.1" placeholder="e.g. 2.5"
                      value={form.area}
                      onChange={e => update('area', e.target.value)}
                      required
                      className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Pre-filled from your profile</p>
                  </div>
                  {/* Soil Type — YieldInputRequest.soil_type */}
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2 flex items-center gap-2">
                      <Sprout className="h-4 w-4 text-emerald-500" /> Soil Type
                    </label>
                    <select
                      value={form.soil_type}
                      onChange={e => update('soil_type', e.target.value)}
                      required
                      className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm"
                    >
                      {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={status === 'loading'}
                  className="btn-primary w-full h-[60px] text-lg mt-10">
                  {status === 'loading' ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Calculating Yield...</>
                  ) : 'Generate Harvest Forecast →'}
                </button>
              </form>
            </div>

            {/* Profile Data Preview */}
            <div className="space-y-6">
              <div className="card-premium p-6 border-l-[6px] border-emerald-500">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Sprout size={16} className="text-emerald-500" /> Your Soil Profile
                  </h3>
                  {!isEditingSoil ? (
                    <button
                      onClick={() => { setSoilDraft({ n: form.n, p: form.p, k: form.k, ph: form.ph, area: form.area }); setIsEditingSoil(true); }}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all hover:shadow-sm"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSoilSave}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-xl transition-all shadow-sm hover:shadow-md"
                      >
                        <Save size={12} /> Save
                      </button>
                      <button
                        onClick={handleSoilCancel}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-xl transition-all"
                      >
                        <X size={12} /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Soil Parameters */}
                <div className="space-y-3">
                  {[
                    { label: 'Nitrogen (N)',    key: 'n'    as const, unit: 'mg/kg', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
                    { label: 'Phosphorus (P)', key: 'p'    as const, unit: 'mg/kg', bg: 'bg-orange-50',  border: 'border-orange-100',  text: 'text-orange-700'  },
                    { label: 'Potassium (K)',  key: 'k'    as const, unit: 'mg/kg', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700' },
                    { label: 'Soil pH',        key: 'ph'   as const, unit: '',      bg: 'bg-amber-50',  border: 'border-amber-100',  text: 'text-amber-700'  },
                    { label: 'Farm Size',      key: 'area' as const, unit: 'acres', bg: 'bg-green-50',  border: 'border-green-100',  text: 'text-green-700'  },
                  ].map(field => (
                    <div key={field.key} className={`flex justify-between items-center ${field.bg} p-3 rounded-xl border ${field.border} transition-all`}>
                      <span className={`text-xs font-bold ${field.text}`}>{field.label}</span>
                      {isEditingSoil ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={soilDraft[field.key]}
                          onChange={e => setSoilDraft(prev => ({ ...prev, [field.key]: e.target.value }))}
                          className="w-24 text-right text-sm font-black bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                        />
                      ) : (
                        <span className="text-sm font-black text-gray-900">
                          {field.key === 'ph' ? form.ph : form[field.key]}{field.unit ? ` ${field.unit}` : ''}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-gray-400 mt-4 leading-relaxed italic">
                  {isEditingSoil ? 'Editing soil values — changes will be saved to your profile.' : '*Fetched automatically from your profile settings.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            {status === 'idle' && (
              <div className="rounded-3xl border-2 border-dashed border-green-200 bg-green-50/50 p-16 text-center animate-fade-in-up">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-10 w-10 text-primary opacity-40" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ready to predict?</h3>
                <p className="text-gray-500">Fill in your input amounts and we'll calculate your yield based on your soil health.</p>
              </div>
            )}

            {status === 'loading' && (
              <div className="space-y-6">
                <SkeletonCard />
              </div>
            )}

            {status === 'error' && (
              <ErrorCard message="Unable to reach prediction service." onRetry={() => setStatus('idle')} />
            )}

            {status === 'success' && result && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card-premium p-8 border-l-[6px] border-primary shadow-xl shadow-primary/10">
                    <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Estimated Yield</p>
                    <p className="text-5xl font-bold tracking-tighter text-gray-900">
                      <AnimatedCounter target={result.yield_kg_per_acre} suffix=" kg/ac" />
                    </p>
                    <div className="mt-6">
                      <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>MODEL CONFIDENCE</span>
                        <span>{result.confidence}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${result.confidence}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="card-premium p-8 border-l-[6px] border-primary shadow-xl shadow-primary/10">
                    <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Projected Profit</p>
                    <p className="text-5xl font-bold tracking-tighter text-gray-900">
                      <AnimatedCounter target={result.profit_inr} prefix="₹" />
                    </p>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Estimated based on local market rates</p>
                  </div>
                </div>

                <div className="card-premium p-8">
                  <p className="text-sm font-bold text-primary uppercase tracking-wider mb-6">Smart Recommendations</p>
                  <ul className="space-y-4">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-gray-700 font-medium leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ── MSP Profit Recalculator — POST /predict-profit ── */}
                <div className="rounded-3xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
                  <div className="px-8 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-black text-base tracking-tight">Custom MSP Profit Calculator</p>
                      <p className="text-blue-100 text-xs font-medium">Recalculate profit with your own market price</p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-5">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="text-[11px] font-bold text-blue-700 uppercase tracking-widest block mb-2">
                          Your MSP Price (₹ per quintal)
                        </label>
                        <input
                          type="number" step="10" min="1" placeholder="e.g. 2800"
                          value={customMsp}
                          onChange={e => { setCustomMsp(e.target.value); setMspProfit(null); }}
                          className="w-full rounded-2xl border-2 border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        />
                        <p className="text-[10px] text-blue-500 mt-1">Default govt MSP = ₹2300/quintal</p>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={handleMspRecalculate}
                          disabled={mspLoading || !customMsp}
                          className="h-[50px] px-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
                        >
                          {mspLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                          Recalculate
                        </button>
                      </div>
                    </div>

                    {mspProfit !== null && (
                      <div className="grid sm:grid-cols-2 gap-4 animate-fade-in-up">
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Original Profit (Govt MSP)</p>
                          <p className="text-2xl font-black text-gray-900">₹{result!.profit_inr.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-400 mt-1">per acre</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Custom MSP Profit</p>
                          <p className={`text-2xl font-black ${mspProfit >= result!.profit_inr ? 'text-emerald-600' : 'text-red-500'}`}>
                            ₹{mspProfit.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-blue-500 mt-1">
                            {mspProfit >= result!.profit_inr
                              ? `▲ ₹${(mspProfit - result!.profit_inr).toLocaleString('en-IN')} more`
                              : `▼ ₹${(result!.profit_inr - mspProfit).toLocaleString('en-IN')} less`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Harvest Planner & Market Alert ── */}
                <div className="rounded-3xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
                  {/* Header */}
                  <div className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                      <CalendarDays className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-black text-base tracking-tight">Harvest Planner &amp; Market Alert</p>
                      <p className="text-emerald-100 text-xs font-medium">Get daily market prices 15 days before your harvest</p>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    {!reminderSet ? (
                      <>
                        {/* Date inputs */}
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest block mb-2">
                              🌱 Sowing Date
                            </label>
                            <input
                              type="date"
                              value={reminderDates.sowingDate}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={e => setReminderDates(prev => ({ ...prev, sowingDate: e.target.value }))}
                              className="w-full rounded-2xl border-2 border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest block mb-2">
                              🌾 Expected Harvest Date
                            </label>
                            <input
                              type="date"
                              value={reminderDates.harvestDate}
                              min={reminderDates.sowingDate || new Date().toISOString().split('T')[0]}
                              onChange={e => setReminderDates(prev => ({ ...prev, harvestDate: e.target.value }))}
                              className="w-full rounded-2xl border-2 border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Preview pill when dates picked */}
                        {reminderDates.harvestDate && harvestDaysLeft !== null && (
                          <div className="flex flex-wrap gap-3 animate-fade-in-up">
                            <div className="flex items-center gap-2 bg-white border border-emerald-200 rounded-2xl px-4 py-2.5 shadow-sm">
                              <CalendarDays size={14} className="text-emerald-500" />
                              <span className="text-xs font-bold text-gray-700">
                                {harvestDaysLeft > 0 ? `${harvestDaysLeft} days to harvest` : 'Harvest date passed'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 shadow-sm">
                              <TrendingUp size={14} className="text-amber-500" />
                              <span className="text-xs font-bold text-gray-700">
                                Market alerts start: <span className="text-emerald-600">{alertStartDate}</span>
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Info box */}
                        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                          <Bell size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-blue-600 font-medium leading-relaxed">
                            We'll send you <strong>daily market price updates</strong> for <strong>{form.crop}</strong> starting 15 days before your harvest date, so you can decide the best time to sell.
                          </p>
                        </div>

                        <button
                          onClick={handleSetReminder}
                          className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <BellRing size={18} /> Set Harvest Reminder &amp; Market Alerts
                        </button>
                      </>
                    ) : (
                      /* Success confirmation */
                      <div className="text-center py-4 space-y-4 animate-fade-in-up">
                        <div className="h-16 w-16 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mx-auto">
                          <BellRing size={28} className="text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-gray-900">Reminder Active! 🎉</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Daily market price alerts for <strong>{form.crop}</strong> will begin on{' '}
                            <span className="font-bold text-emerald-600">{alertStartDate}</span>
                          </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sowing</p>
                            <p className="text-sm font-bold text-gray-800">{new Date(reminderDates.sowingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harvest</p>
                            <p className="text-sm font-bold text-gray-800">{new Date(reminderDates.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 shadow-sm">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Alerts Start</p>
                            <p className="text-sm font-bold text-emerald-700">{alertStartDate}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setReminderSet(false)}
                          className="text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
                        >
                          Change dates
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={reset} className="inline-flex flex-1 items-center justify-center gap-2 h-[56px] rounded-full border-2 border-primary text-primary font-bold shadow-sm hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
                    <RotateCcw className="h-5 w-5" /> Run Another Prediction
                  </button>
                  <button
                    onClick={() => {
                      const name = prompt("Enter a name for this report:", `${form.crop} Report - ${new Date().toLocaleDateString()}`);
                      if (name) {
                        const newReport = {
                          id: Math.random().toString(36).substr(2, 9),
                          name,
                          date: new Date().toISOString(),
                          crop: form.crop,
                          season: form.season,
                          yield: result.yield_kg_per_acre,
                          profit: result.profit_inr,
                          inputs: {
                            fertilizer: Number(form.fertilizerAmount),
                            pesticide: Number(form.pesticideAmount),
                            n: form.n,
                            p: form.p,
                            k: form.k,
                            ph: form.ph
                          }
                        };
                        const currentReports = user?.reports || [];
                        updateUser({ reports: [...currentReports, newReport] });
                        toast.success("Report saved to your profile!");
                      }
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-2 h-[56px] rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                  >
                    <CheckCircle2 className="h-5 w-5" /> Save Report to Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PredictYield;