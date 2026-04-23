import { useState, useRef, DragEvent } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorCard from '@/components/ErrorCard';
import { API } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import { Upload, X, Loader2, RotateCcw, Bell, Leaf, FlaskConical, CheckCircle2, Camera, Sprout, ShoppingBag, Star, ExternalLink, Tag, Package } from 'lucide-react';
import { toast } from 'sonner';



// ─── Unified result type for both API + mock responses ─────────────────────
interface DiseaseResult {
  disease: string | null;
  confidence: number;              // mapped from confidence_percent
  severity: string | null;
  crop: string;
  description: string;
  organic_treatment?: string[];
  chemical_treatment?: string[];
  pesticides: string[];
  fertilizers: string[];
}

const MOCK_DISEASE: DiseaseResult = {
  disease: "Rice Blast",
  confidence: 88,
  severity: "Moderate",
  crop: "Rice",
  description: "Rice blast is caused by the fungus Magnaporthe oryzae. It affects leaves, nodes, and panicles, appearing as diamond-shaped lesions with gray centers.",
  organic_treatment: ["Neem oil spray 2%", "Trichoderma harzianum"],
  chemical_treatment: ["Tricyclazole 75% WP", "Carbendazim 50% WP"],
  pesticides: ["Tricyclazole", "Carbendazim", "Edifenphos"],
  fertilizers: ["Apply Potassium (K) based fertilizers", "Avoid excess Nitrogen (N) during active blast phases"]
};

const MOCK_HEALTHY: DiseaseResult = {
  disease: null,
  confidence: 95,
  severity: null,
  crop: "Rice",
  description: "No disease patterns detected.",
  pesticides: [],
  fertilizers: ["Standard Nitrogen (N) application", "Zinc Sulfate if soil is deficient"]
};

const severityColors: Record<string, string> = {
  Severe: 'bg-red-100 text-red-700',
  Moderate: 'bg-yellow-100 text-yellow-700',
  Mild: 'bg-green-100 text-green-700',
};

// ─── GreenShift Marketplace Product Data ───────────────────────────────────
interface MarketProduct {
  id: string;
  name: string;
  brand: string;
  type: 'pesticide' | 'fertilizer';
  description: string;
  price: string;
  rating: number;
  reviews: number;
  badge?: string;
  emoji: string;
}

const MARKETPLACE_PRODUCTS: Record<string, MarketProduct[]> = {
  'Rice Blast': [
    { id: 'p1', name: 'Trizole 75 WP', brand: 'CropCare India', type: 'pesticide', description: 'Systemic fungicide with Tricyclazole – proven against blast lesions', price: '₹320', rating: 4.6, reviews: 218, badge: 'Best Seller', emoji: '🧪' },
    { id: 'p2', name: 'Carbo Shield 50', brand: 'GreenShield Labs', type: 'pesticide', description: 'Carbendazim 50% WP – broad-spectrum fungal control', price: '₹280', rating: 4.4, reviews: 145, emoji: '⚗️' },
    { id: 'f1', name: 'K-Boost Granules', brand: 'NutriGrow', type: 'fertilizer', description: 'High-Potassium formula – strengthens cell walls against blast', price: '₹450', rating: 4.8, reviews: 302, badge: 'Recommended', emoji: '🌿' },
    { id: 'f2', name: 'Tricho-Root Pro', brand: 'BioFarm Solutions', type: 'fertilizer', description: 'Trichoderma harzianum – organic biocontrol for root and leaf blast', price: '₹390', rating: 4.5, reviews: 178, emoji: '🍃' },
  ],
  'Leaf Blight': [
    { id: 'p3', name: 'Mancozeb 75 WP', brand: 'AgroStar', type: 'pesticide', description: 'Contact fungicide effective against blight, broad spectrum protection', price: '₹260', rating: 4.3, reviews: 189, badge: 'Best Seller', emoji: '🧪' },
    { id: 'p4', name: 'Copper Oxychloride', brand: 'CropCare India', type: 'pesticide', description: 'Protective and curative action against blight pathogens', price: '₹195', rating: 4.2, reviews: 120, emoji: '⚗️' },
    { id: 'f3', name: 'Zinc Pro Mix', brand: 'NutriGrow', type: 'fertilizer', description: 'Zinc Sulfate blend that boosts immunity and leaf health', price: '₹340', rating: 4.6, reviews: 210, badge: 'Recommended', emoji: '🌿' },
    { id: 'f4', name: 'NPK 20-20-20', brand: 'GreenRoot', type: 'fertilizer', description: 'Balanced macro-nutrient blend for rapid recovery', price: '₹420', rating: 4.7, reviews: 265, emoji: '🍃' },
  ],
  'Powdery Mildew': [
    { id: 'p5', name: 'Sulphur 80 WDG', brand: 'GreenShield Labs', type: 'pesticide', description: 'Wettable sulphur – contact action against powdery mildew', price: '₹175', rating: 4.5, reviews: 310, badge: 'Best Seller', emoji: '🧪' },
    { id: 'p6', name: 'Hexaconazole 5 EC', brand: 'CropCare India', type: 'pesticide', description: 'Systemic triazole fungicide for mildew management', price: '₹290', rating: 4.4, reviews: 142, emoji: '⚗️' },
    { id: 'f5', name: 'Calcium Boron Plus', brand: 'BioFarm Solutions', type: 'fertilizer', description: 'Strengthens cell walls, reduces mildew susceptibility', price: '₹360', rating: 4.5, reviews: 197, badge: 'Recommended', emoji: '🌿' },
    { id: 'f6', name: 'Neem Gold Oil 1%', brand: 'NaturaFarm', type: 'fertilizer', description: 'Organic neem oil spray – repels spores and boosts immunity', price: '₹220', rating: 4.3, reviews: 158, emoji: '🍃' },
  ],
  default: [
    { id: 'd1', name: 'Neem 5000 EC', brand: 'NaturaFarm', type: 'pesticide', description: 'Broad-spectrum neem-based bio-pesticide, safe and organic', price: '₹210', rating: 4.4, reviews: 256, badge: 'Top Rated', emoji: '🧪' },
    { id: 'd2', name: 'Chlorpyrifos 20 EC', brand: 'AgroStar', type: 'pesticide', description: 'General-purpose contact insecticide for crop protection', price: '₹245', rating: 4.2, reviews: 134, emoji: '⚗️' },
    { id: 'd3', name: 'NPK 19-19-19', brand: 'NutriGrow', type: 'fertilizer', description: 'Premium balanced fertilizer for overall plant health recovery', price: '₹480', rating: 4.7, reviews: 320, badge: 'Recommended', emoji: '🌿' },
    { id: 'd4', name: 'Humic Acid Gold', brand: 'GreenRoot', type: 'fertilizer', description: 'Soil conditioner that boosts nutrient uptake and root strength', price: '₹310', rating: 4.5, reviews: 175, emoji: '🍃' },
  ],
};

const getProducts = (disease: string | null): MarketProduct[] => {
  if (!disease) return MARKETPLACE_PRODUCTS['default'];
  const key = Object.keys(MARKETPLACE_PRODUCTS).find(k => disease.toLowerCase().includes(k.toLowerCase()));
  return MARKETPLACE_PRODUCTS[key || 'default'];
};

const DiseaseDetection = () => {
  const { isDemoMode, user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<DiseaseResult | null>(null);

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
      const res = await fetch(API.detectDisease, {
        method: 'POST',
        body: fd,
        headers: {
          'Authorization': `Bearer ${user?.access_token}`
        }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      // Backend DiseaseResponse: { disease, confidence_percent, treatment? }
      // treatment is a Gemini dict that may contain pesticides/fertilizers/description
      const treatment = data.treatment || {};
      const mapped: DiseaseResult = {
        disease: data.disease ?? null,
        confidence: Math.round(data.confidence_percent ?? 0),
        severity: treatment.severity ?? null,
        crop: treatment.crop ?? 'Unknown',
        description: treatment.description ?? (data.disease ? '' : 'No disease patterns detected.'),
        organic_treatment: treatment.organic_treatment ?? [],
        chemical_treatment: treatment.chemical_treatment ?? [],
        pesticides: treatment.pesticides ?? [],
        fertilizers: treatment.fertilizers ?? [],
      };
      setResult(mapped);
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
                    <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${result.severity ? severityColors[result.severity] ?? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
                      {result.severity ?? 'Unknown'}
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

                  {/* ─── Pesticides / Fertilizers Grid ─── */}
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

                  {/* ─── GreenShift Marketplace Suggestions ─── */}
                  <div className="mt-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                          <ShoppingBag className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-base font-black text-gray-900 leading-none">GreenShift Marketplace</p>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">Products matched to your diagnosis</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                        4 Products
                      </span>
                    </div>

                    {/* Pesticides row */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FlaskConical size={14} className="text-orange-500" />
                        <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest">Pesticides & Fungicides</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {getProducts(result.disease).filter(p => p.type === 'pesticide').map(product => (
                          <div key={product.id} className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden">
                            {product.badge && (
                              <span className="absolute top-3 right-3 text-[9px] font-black text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded-full uppercase tracking-wider">
                                {product.badge}
                              </span>
                            )}
                            <div className="flex items-start gap-3 mb-3">
                              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 flex items-center justify-center text-2xl flex-shrink-0">
                                {product.emoji}
                              </div>
                              <div>
                                <h5 className="text-sm font-black text-gray-900 leading-tight">{product.name}</h5>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{product.brand}</p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">{product.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                                  ))}
                                </div>
                                <span className="text-[10px] font-bold text-gray-500">{product.rating} ({product.reviews})</span>
                              </div>
                              <span className="text-sm font-black text-gray-900">{product.price}</span>
                            </div>
                            <button
                              onClick={() => toast.info('Redirecting to GreenShift Marketplace...')}
                              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-all hover:shadow-md hover:shadow-orange-500/30 group-hover:scale-[1.02]"
                            >
                              <ShoppingBag size={12} /> Buy on GreenShift <ExternalLink size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fertilizers row */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sprout size={14} className="text-emerald-500" />
                        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Fertilizers & Boosters</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {getProducts(result.disease).filter(p => p.type === 'fertilizer').map(product => (
                          <div key={product.id} className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden">
                            {product.badge && (
                              <span className="absolute top-3 right-3 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full uppercase tracking-wider">
                                {product.badge}
                              </span>
                            )}
                            <div className="flex items-start gap-3 mb-3">
                              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-2xl flex-shrink-0">
                                {product.emoji}
                              </div>
                              <div>
                                <h5 className="text-sm font-black text-gray-900 leading-tight">{product.name}</h5>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{product.brand}</p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">{product.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                                  ))}
                                </div>
                                <span className="text-[10px] font-bold text-gray-500">{product.rating} ({product.reviews})</span>
                              </div>
                              <span className="text-sm font-black text-gray-900">{product.price}</span>
                            </div>
                            <button
                              onClick={() => toast.info('Redirecting to GreenShift Marketplace...')}
                              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all hover:shadow-md hover:shadow-emerald-500/30 group-hover:scale-[1.02]"
                            >
                              <ShoppingBag size={12} /> Buy on GreenShift <ExternalLink size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer note */}
                    <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                      <Tag size={11} />
                      Products are matched to your diagnosis and sourced from verified GreenShift sellers.
                    </div>
                  </div>

                  <button onClick={() => toast.info('SMS alerts coming soon!')} className="w-full mt-10 rounded-full border-2 border-primary py-4 text-sm font-bold text-primary shadow-sm hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-3">
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

              <button onClick={reset} className="inline-flex items-center justify-center gap-2 w-full h-[56px] rounded-full border-2 border-primary text-primary font-bold shadow-sm hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 mt-6">
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