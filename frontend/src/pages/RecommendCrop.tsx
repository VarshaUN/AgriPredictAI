import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkeletonCard from '@/components/SkeletonCard';
import ErrorCard from '@/components/ErrorCard';
import { API } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Sprout, Thermometer, Droplets, CloudRain, Beaker, FlaskConical, Leaf, RotateCcw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

// ── Mock fallback ────────────────────────────────────────────────────────────
const MOCK_RESULT = {
  recommended_crop: 'Rice',
  confidence: '87.4%',
};

// ── Crop metadata for visuals ────────────────────────────────────────────────
const CROP_META: Record<string, { emoji: string; color: string; desc: string }> = {
  Rice:       { emoji: '🌾', color: 'from-amber-400 to-yellow-300',  desc: 'Ideal for wet/humid conditions with moderate soil pH.' },
  Wheat:      { emoji: '🌿', color: 'from-yellow-500 to-amber-400',  desc: 'Best for cool, dry climates with well-drained loamy soil.' },
  Maize:      { emoji: '🌽', color: 'from-orange-400 to-yellow-300', desc: 'Grows well in warm temperatures with moderate rainfall.' },
  Sugarcane:  { emoji: '🎋', color: 'from-green-500 to-emerald-400', desc: 'Thrives in tropical climates with high moisture.' },
  Cotton:     { emoji: '☁️', color: 'from-blue-300 to-cyan-200',     desc: 'Requires long warm seasons and moderate water.' },
  Jute:       { emoji: '🌿', color: 'from-lime-500 to-green-400',    desc: 'Prefers warm humid climate and waterlogged conditions.' },
  Coconut:    { emoji: '🥥', color: 'from-teal-500 to-emerald-400',  desc: 'Coastal tropical crop needing high humidity.' },
  Papaya:     { emoji: '🍈', color: 'from-orange-500 to-amber-400',  desc: 'Tropical fruit crop that grows year-round in warm climates.' },
  default:    { emoji: '🌱', color: 'from-primary to-emerald-400',   desc: 'Suitable for your current soil and weather conditions.' },
};

const getCropMeta = (crop: string) =>
  CROP_META[crop] ?? { ...CROP_META.default, desc: `${crop} suits your current soil and weather profile.` };

// ── Component ────────────────────────────────────────────────────────────────
const RecommendCrop = () => {
  const { user, isDemoMode } = useAuth();

  const [form, setForm] = useState({
    // Auto-filled from soil profile
    nitrogen:    user?.soilDetails?.nitrogen    ?? 0,
    phosphorus:  user?.soilDetails?.phosphorus  ?? 0,
    potassium:   user?.soilDetails?.potassium   ?? 0,
    ph:          user?.soilDetails?.ph          ?? 7.0,
    // User provides weather conditions
    temperature: '',
    humidity:    '',
    rainfall:    '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<{ recommended_crop: string; confidence: string } | null>(null);

  // Keep soil in sync if user updates profile elsewhere
  useEffect(() => {
    if (user?.soilDetails) {
      setForm(prev => ({
        ...prev,
        nitrogen:   user.soilDetails!.nitrogen,
        phosphorus: user.soilDetails!.phosphorus,
        potassium:  user.soilDetails!.potassium,
        ph:         user.soilDetails!.ph,
      }));
    }
  }, [user]);

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const temp = parseFloat(String(form.temperature));
    const hum  = parseFloat(String(form.humidity));
    const rain = parseFloat(String(form.rainfall));

    if (isNaN(temp) || isNaN(hum) || isNaN(rain)) {
      toast.error('Please fill in all weather fields.');
      return;
    }

    setStatus('loading');

    try {
      // POST /recommend-crop
      // Body: CropRecommendRequest { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall }
      const res = await fetch(API.recommendCrop, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({
          nitrogen:    Number(form.nitrogen),
          phosphorus:  Number(form.phosphorus),
          potassium:   Number(form.potassium),
          temperature: temp,
          humidity:    hum,
          ph:          Number(form.ph),
          rainfall:    rain,
        }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      // Backend CropRecommendResponse: { recommended_crop: str, confidence: str }
      setResult({ recommended_crop: data.recommended_crop, confidence: data.confidence });
      setStatus('success');
    } catch {
      await new Promise(r => setTimeout(r, 1200));
      setResult(MOCK_RESULT);
      setStatus('success');
      if (!isDemoMode) toast.info('Using demo result — API unavailable');
    }
  };

  const reset = () => { setStatus('idle'); setResult(null); };

  const meta = result ? getCropMeta(result.recommended_crop) : null;
  const confidenceNum = result ? parseFloat(result.confidence) : 0;
  const hasSoil = !!user?.soilDetails;

  return (
    <div className="min-h-screen bg-background pt-24">
      <Navbar />
      <div className="view-container py-12">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">AI Crop Intelligence</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Crop Recommendation</h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto lg:mx-0">
              Enter your local weather conditions and our ML model will recommend the best crop for your soil.
            </p>
          </div>

          {/* No soil warning */}
          {!hasSoil && (
            <div className="mb-8 flex items-start gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-200">
              <Sprout className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800">Soil Profile Required</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Your N/P/K/pH values will use defaults (0 / 7.0). For accurate results,{' '}
                  <a href="/soil-details" className="underline font-semibold">complete your soil profile first</a>.
                </p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-[1fr_0.4fr] gap-8">

            {/* Form card */}
            <div className="card-premium p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Soil Data (read-only display, editable values) */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sprout className="h-3.5 w-3.5 text-primary" /> Soil Profile (from your account)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Nitrogen (N)', key: 'nitrogen',   unit: 'mg/kg', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-100'  },
                      { label: 'Phosphorus (P)', key: 'phosphorus', unit: 'mg/kg', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100'},
                      { label: 'Potassium (K)', key: 'potassium',  unit: 'mg/kg', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100'},
                      { label: 'pH',             key: 'ph',         unit: '',      bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-100' },
                    ].map(f => (
                      <div key={f.key} className={`${f.bg} ${f.border} border rounded-2xl p-3 text-center`}>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${f.text} mb-1`}>{f.label}</p>
                        <p className="text-lg font-black text-gray-900">
                          {Number(form[f.key as keyof typeof form]).toFixed(f.key === 'ph' ? 1 : 0)}
                          <span className="text-[10px] font-medium text-gray-400 ml-1">{f.unit}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weather Inputs */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CloudRain className="h-3.5 w-3.5 text-primary" /> Current Weather Conditions
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="text-sm font-bold text-gray-900 block mb-2 flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-400" /> Temperature (°C)
                      </label>
                      <input
                        type="number" step="0.1" min="-10" max="60" placeholder="e.g. 28"
                        value={form.temperature}
                        onChange={e => update('temperature', e.target.value)}
                        required
                        className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-900 block mb-2 flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-400" /> Humidity (%)
                      </label>
                      <input
                        type="number" step="1" min="0" max="100" placeholder="e.g. 75"
                        value={form.humidity}
                        onChange={e => update('humidity', e.target.value)}
                        required
                        className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-900 block mb-2 flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-cyan-400" /> Rainfall (mm)
                      </label>
                      <input
                        type="number" step="1" min="0" placeholder="e.g. 1200"
                        value={form.rainfall}
                        onChange={e => update('rainfall', e.target.value)}
                        required
                        className="w-full rounded-2xl border border-border bg-gray-50/50 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full h-[60px] text-lg"
                >
                  {status === 'loading'
                    ? <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing...</>
                    : 'Get Crop Recommendation →'}
                </button>
              </form>
            </div>

            {/* Tips sidebar */}
            <div className="space-y-4">
              {[
                { icon: Thermometer, color: 'text-orange-400', bg: 'bg-orange-50', label: 'Temperature', tip: 'Check your local weather app or nearest IMD station for accurate readings.' },
                { icon: Droplets,    color: 'text-blue-400',   bg: 'bg-blue-50',   label: 'Humidity',    tip: 'Relative humidity — typically 60–90% in tropical Indian regions.' },
                { icon: CloudRain,   color: 'text-cyan-400',   bg: 'bg-cyan-50',   label: 'Rainfall',    tip: 'Annual rainfall in mm. Kharif avg: 800–1500mm; Rabi avg: 200–500mm.' },
                { icon: Beaker,      color: 'text-primary',    bg: 'bg-green-50',  label: 'Soil Data',   tip: 'N/P/K and pH pulled from your profile. Update via Profile page.' },
              ].map((item) => (
                <div key={item.label} className={`${item.bg} rounded-2xl p-4 flex items-start gap-3`}>
                  <item.icon className={`h-4 w-4 ${item.color} mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-xs font-bold text-gray-700">{item.label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results area */}
          <div className="mt-12">
            {status === 'idle' && (
              <div className="rounded-3xl border-2 border-dashed border-green-200 bg-green-50/50 p-16 text-center animate-fade-in-up">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <Leaf className="h-10 w-10 text-primary opacity-40" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ready to recommend?</h3>
                <p className="text-gray-500">Enter your weather data above and we'll find the best crop for your field.</p>
              </div>
            )}

            {status === 'loading' && <SkeletonCard />}

            {status === 'error' && (
              <ErrorCard message="Could not reach recommendation service." onRetry={reset} />
            )}

            {status === 'success' && result && meta && (
              <div className="animate-fade-in-up space-y-6">
                {/* Crop result hero */}
                <div className={`rounded-3xl bg-gradient-to-br ${meta.color} p-10 text-white shadow-2xl relative overflow-hidden`}>
                  {/* Background decoration */}
                  <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                  <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    {/* Emoji */}
                    <div className="h-24 w-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl flex-shrink-0 shadow-lg">
                      {meta.emoji}
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-sm font-bold text-white/70 uppercase tracking-widest mb-1">Recommended Crop</p>
                      <h2 className="text-4xl font-black tracking-tight mb-2">{result.recommended_crop}</h2>
                      <p className="text-white/80 max-w-lg leading-relaxed">{meta.desc}</p>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="relative z-10 mt-8">
                    <div className="flex justify-between text-xs font-bold text-white/80 mb-2">
                      <span>ML MODEL CONFIDENCE</span>
                      <span>{result.confidence}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-1000"
                        style={{ width: `${isNaN(confidenceNum) ? 85 : confidenceNum}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Input summary */}
                <div className="card-premium p-8">
                  <p className="text-sm font-bold text-primary uppercase tracking-wider mb-6 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Parameters Used
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Temperature', value: `${form.temperature}°C` },
                      { label: 'Humidity',    value: `${form.humidity}%` },
                      { label: 'Rainfall',    value: `${form.rainfall} mm` },
                      { label: 'Soil pH',     value: Number(form.ph).toFixed(1) },
                      { label: 'Nitrogen',    value: `${form.nitrogen} mg/kg` },
                      { label: 'Phosphorus',  value: `${form.phosphorus} mg/kg` },
                      { label: 'Potassium',   value: `${form.potassium} mg/kg` },
                    ].map(item => (
                      <div key={item.label} className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-sm font-black text-gray-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={reset}
                    className="inline-flex flex-1 items-center justify-center gap-2 h-[56px] rounded-full border-2 border-primary text-primary font-bold shadow-sm hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                  >
                    <RotateCcw className="h-5 w-5" /> Try Different Conditions
                  </button>
                  <a
                    href="/predict"
                    className="inline-flex flex-1 items-center justify-center gap-2 h-[56px] rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                  >
                    <Leaf className="h-5 w-5" /> Predict Yield for {result.recommended_crop} →
                  </a>
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

export default RecommendCrop;
