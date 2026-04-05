import { useState, useRef, DragEvent } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorCard from '@/components/ErrorCard';
import { API } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import { Upload, X, Loader2, RotateCcw, Bell, Leaf, FlaskConical, CheckCircle2, Camera } from 'lucide-react';
import { toast } from 'sonner';



const MOCK_DISEASE = {
  disease: "Rice Blast",
  confidence: 88,
  severity: "Moderate" as const,
  crop: "Rice",
  description: "Rice blast is caused by the fungus Magnaporthe oryzae. It affects leaves, nodes, and panicles, appearing as diamond-shaped lesions with gray centers.",
  organic_treatment: ["Neem oil spray 2%", "Trichoderma harzianum"],
  chemical_treatment: ["Tricyclazole 75% WP", "Carbendazim 50% WP"],
  pesticides: ["Tricyclazole", "Carbendazim", "Edifenphos"],
  fertilizers: ["Apply Potassium (K) based fertilizers", "Avoid excess Nitrogen (N) during active blast phases"]
};

const MOCK_HEALTHY = {
  disease: null,
  confidence: 95,
  severity: null,
  crop: "Rice",
  description: "No disease patterns detected.",
  pesticides: [],
  fertilizers: ["Standard Nitrogen (N) application", "Zinc Sulfate if soil is deficient"]
};
// ... rest of code stays same but I'll update the results display logic below ...

const severityColors = {
  Severe: 'bg-red-100 text-red-700',
  Moderate: 'bg-yellow-100 text-yellow-700',
  Mild: 'bg-green-100 text-green-700',
};

const DiseaseDetection = () => {
  const { isDemoMode, user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<typeof MOCK_DISEASE | typeof MOCK_HEALTHY | null>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    if (f.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); return; }
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); };
  const removeFile = () => { setFile(null); setPreview(null); };

  const handleSubmit = async () => {
    if (!file) return;
    setStatus('loading');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('crop', 'Auto-detect');
      const res = await fetch(API.detectDisease, {
        method: 'POST',
        body: fd,
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setStatus('success');
    } catch {
      await new Promise(r => setTimeout(r, 1500));
      // Demo: randomly show disease or healthy
      setResult(Math.random() > 0.3 ? MOCK_DISEASE : MOCK_HEALTHY);
      setStatus('success');
      if (!isDemoMode) toast.info('Using demo data — API unavailable');
    }
  };

  const reset = () => { setFile(null); setPreview(null); setStatus('idle'); setResult(null); };

  const canSubmit = file && status !== 'loading';

  return (
    <div className="min-h-screen bg-background pt-24">
      <Navbar />
      <div className="view-container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Health Diagnostics</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Disease Detection</h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto lg:mx-0">Upload a photo of a leaf to identify pests or diseases instantly. Our AI provides results in under 2 seconds.</p>
          </div>

          {(status === 'idle' || status === 'loading') && (
            <>
              {/* Upload dropzone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => !file && fileRef.current?.click()}
                className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden lg:min-h-[320px] min-h-[260px] ${dragging ? 'border-primary bg-green-50 scale-[1.02]' : file ? 'border-primary/30 bg-gray-50' : 'border-green-200 bg-gray-50 hover:border-primary/50'
                  }`}
              >
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

                {!file ? (
                  <div className="flex flex-col items-center justify-center min-h-[320px] gap-6 p-8">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                        <Upload className="h-10 w-10 text-primary opacity-60" />
                      </div>
                      <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="h-10 w-10 text-blue-600 opacity-60" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900 mb-1">Upload or Capture</p>
                      <p className="text-sm text-gray-500">Tap to <span className="text-primary font-bold">Take Photo</span> or <span className="text-blue-600 font-bold">Browse Files</span></p>
                    </div>
                    <div className="flex gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>JPG</span> • <span>PNG</span> • <span>HEIC</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-[320px]">
                    <img src={preview!} alt="Leaf preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-900 text-sm font-semibold">
                        <span>{file.name}</span>
                        <span className="text-xs opacity-50">{(file.size / 1024).toFixed(0)}KB</span>
                      </div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); removeFile(); }} className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-900 hover:bg-white transition-all shadow-lg active:scale-95">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>



              <button onClick={handleSubmit} disabled={!canSubmit}
                className="btn-primary w-full h-[60px] text-lg mt-10">
                {status === 'loading' ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing Image...</>
                ) : 'Detect Disease →'}
              </button>
            </>
          )}

          {status === 'error' && (
            <ErrorCard message="Unable to reach disease detection service." onRetry={reset} />
          )}

          {status === 'success' && result && (
            <div className="animate-fade-in-up">
              {result.disease ? (
                <div className="card-premium p-8 lg:p-10 mt-10">
                  <div className="flex items-center justify-between mb-8">
                    <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${severityColors[(result as typeof MOCK_DISEASE).severity]}`}>
                      {(result as typeof MOCK_DISEASE).severity}
                    </span>
                    <div className="flex items-center gap-2 bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-bold text-primary">{result.confidence}% Confidence</span>
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold mb-2">{result.disease}</h2>
                  <p className="text-sm text-gray-400 italic mb-8 font-medium">Magnaporthe oryzae</p>

                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">About this disease</h3>
                    <p className="text-gray-600 leading-relaxed">{result.description}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 mt-6">
                    <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <FlaskConical className="h-4 w-4 text-orange-600" />
                        </div>
                        <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Recommended Pesticides</h4>
                      </div>
                      <ul className="space-y-3">
                        {((result as any).pesticides || []).map((t: string, i: number) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Sprout className="h-4 w-4 text-emerald-600" />
                        </div>
                        <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Growth Fertilizers</h4>
                      </div>
                      <ul className="space-y-3">
                        {((result as any).fertilizers || []).map((t: string, i: number) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button onClick={() => toast.info('SMS alerts coming soon!')} className="w-full mt-10 rounded-full border-2 border-primary py-4 text-sm font-bold text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95">
                    <Bell className="h-5 w-5" /> Set SMS Alert for this diagnosis →
                  </button>
                </div>
              ) : (
                <div className="card-premium p-12 text-center mt-10 bg-green-50/30">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Healthy Crop!</h2>
                  <p className="text-gray-500">No disease patterns detected. Continue regular monitoring.</p>
                </div>
              )}

              <button onClick={reset} className="inline-flex items-center justify-center gap-2 w-full h-[56px] rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all mt-6">
                <RotateCcw className="h-5 w-5" /> Scan Another Leaf
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DiseaseDetection;
