import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api';
import type { DiseaseResponse } from '../api';
import { MarketSuggestions } from '../components/MarketSuggestions';

export const DiseaseDetection = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null); // Clear previous runs
    }
  };

  const runScan = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await apiClient.detectDisease(file);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert('File upload or scanning failed. Please try again with a clearer photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Upload Zone */}
      <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm text-center">
        <h3 className="text-2xl font-bold font-heading mb-2">{t('disease.title')}</h3>
        <p className="text-slate-500 mb-8">{t('disease.subtitle')}</p>
        
        <input type="file" className="hidden" ref={inputRef} onChange={handleFileChange} accept="image/*" />
        
        {!preview ? (
          <div 
            onClick={() => inputRef.current?.click()}
            className="w-full h-80 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-semibold text-slate-700">{t('disease.placeholder')}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-widest">JPG, PNG up to 5MB</p>
          </div>
        ) : (
          <div className="relative w-full h-96 rounded-2xl overflow-hidden group border border-slate-200 shadow-inner">
            <img src={preview} alt="Leaf Preview" className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setFile(null); setPreview(''); setResult(null); }} className="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold shadow-xl hover:scale-105 transition-transform text-sm uppercase tracking-wider">
                Change Image
              </button>
            </div>
          </div>
        )}

        {preview && !result && (
          <button 
            onClick={runScan}
            disabled={loading}
            className="mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg px-12 py-4 rounded-xl shadow-xl transition-all flex items-center gap-3 mx-auto"
          >
            {loading ? <span className="animate-spin w-5 h-5 border-2 border-white/40 border-t-white rounded-full"></span> : t('disease.btn')}
          </button>
        )}
      </div>

      {/* Results UI */}
      {result && (
        <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-xl animate-[fadeInUp_0.5s_ease-out] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 font-bold px-3 py-1 rounded-full text-[10px] mb-3 uppercase tracking-widest border border-red-100">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                {result.treatment?.danger_level || 'Caution'} Pathotype Detected
              </div>
              <h4 className="text-3xl font-heading font-extrabold text-slate-900 capitalize">{result.disease}</h4>
            </div>
            
            <div className="bg-slate-50 px-6 py-3 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnostic Confidence</p>
              <p className="text-2xl font-black text-slate-900">{result.confidence_percent}%</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative">
                <h5 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] mb-3 text-green-700">Biological Treatment</h5>
                <p className="text-slate-700 leading-relaxed text-sm font-medium">{result.treatment?.organic_treatment || "Alternative data unavailable."}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative">
                <h5 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] mb-3 text-blue-700">Chemical Protocol</h5>
                <p className="text-slate-700 leading-relaxed text-sm font-medium">{result.treatment?.chemical_pesticide || "Consult local laboratory."}</p>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
              <h5 className="font-bold text-lg mb-3 flex items-center gap-2 text-white">Preventative Strategy</h5>
              <p className="text-slate-400 leading-relaxed font-medium text-sm mb-8">
                {result.treatment?.prevention_tip || "Integrated pest management strategy recommended."}
              </p>
              
              <button onClick={() => {
                const el = document.getElementById('market-suggestions');
                el?.scrollIntoView({ behavior: 'smooth' });
              }} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all text-xs uppercase tracking-widest">
                Procure Treatment Solutions
              </button>
            </div>
          </div>

          <div id="market-suggestions">
            <MarketSuggestions categories={['Pesticide', 'Fertilizer']} title="Combat Disease with Precision Inputs" />
          </div>
        </div>
      )}
    </div>
  );
};
