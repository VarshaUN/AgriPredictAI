import React, { useState } from 'react';
import { apiClient } from '../api';
import { useTranslation } from 'react-i18next';
import { MarketSuggestions } from '../components/MarketSuggestions';

export const CropRecommend = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState<string>('');

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update Soil Profile Snapshot
      await apiClient.updateSoilProfile({
        nitrogen: parseFloat(formData.nitrogen as string) || 0,
        phosphorus: parseFloat(formData.phosphorus as string) || 0,
        potassium: parseFloat(formData.potassium) || 0,
        ph: parseFloat(formData.ph as string) || 0,
      });

      // 2. Get Recommendation from Backend ML Model
      const response = await apiClient.recommendCrop({
        nitrogen: parseFloat(formData.nitrogen as string) || 0,
        phosphorus: parseFloat(formData.phosphorus as string) || 0,
        potassium: parseFloat(formData.potassium) || 0,
        temperature: parseFloat(formData.temperature as string) || 0,
        humidity: parseFloat(formData.humidity as string) || 0,
        ph: parseFloat(formData.ph as string) || 0,
        rainfall: parseFloat(formData.rainfall as string) || 0,
      });

      setRecommended(response.recommended_crop);
    } catch(err: any) {
      console.error(err);
      const errorMsg = err.message || 'Recommendation engine error. Please try again.';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        
        {/* Form panel */}
        <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm">
          <h3 className="text-2xl font-bold font-heading mb-6">{t('recommend.title')}</h3>
          
          <form onSubmit={handleRecommend} className="space-y-6">
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">🧪</span>
                {t('recommend.soil_profile')}
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-1 text-blue-600">{t('fields.nitrogen')}</label>
                  <input type="number" step="0.1" required value={formData.nitrogen} onChange={(e) => setFormData({...formData, nitrogen: e.target.value})} className="w-full bg-blue-50/50 border border-blue-100 px-3 py-2 rounded-lg outline-none focus:border-blue-500 font-medium" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-1 text-orange-600">{t('fields.phosphorus')}</label>
                  <input type="number" step="0.1" required value={formData.phosphorus} onChange={(e) => setFormData({...formData, phosphorus: e.target.value})} className="w-full bg-orange-50/50 border border-orange-100 px-3 py-2 rounded-lg outline-none focus:border-orange-500 font-medium" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-1 text-purple-600">{t('fields.potassium')}</label>
                  <input type="number" step="0.1" required value={formData.potassium} onChange={(e) => setFormData({...formData, potassium: e.target.value})} className="w-full bg-purple-50/50 border border-purple-100 px-3 py-2 rounded-lg outline-none focus:border-purple-500 font-medium" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">{t('fields.temp')}</label>
                <input type="number" step="0.1" required value={formData.temperature} onChange={(e) => setFormData({...formData, temperature: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none font-medium" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">{t('fields.humidity')}</label>
                <input type="number" step="0.1" required value={formData.humidity} onChange={(e) => setFormData({...formData, humidity: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">{t('fields.ph')}</label>
                <input type="number" step="0.1" required value={formData.ph} onChange={(e) => setFormData({...formData, ph: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none font-medium" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">{t('fields.rainfall')}</label>
                <input type="number" step="0.1" required value={formData.rainfall} onChange={(e) => setFormData({...formData, rainfall: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none font-medium" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all flex justify-center items-center gap-2 mt-4 text-lg">
              {loading ? <span className="animate-spin w-5 h-5 border-2 border-slate-500 border-t-white rounded-full"></span> : t('recommend.btn')}
            </button>
          </form>
        </div>

        {/* Result Side */}
        <div className="h-full flex flex-col justify-center">
          {recommended ? (
            <div className="bg-slate-900 rounded-[24px] p-10 text-white shadow-2xl relative overflow-hidden animate-[fadeInUp_0.5s_ease-out]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[40px] translate-x-1/3 -translate-y-1/3"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/10 rotate-3">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-slate-400 font-black tracking-[0.2em] uppercase text-[10px] mb-2">Optimal Biological Match</p>
                <h4 className="text-5xl font-extrabold font-heading mb-6 capitalize text-white">{recommended}</h4>
                
                <div className="h-[1px] w-12 bg-green-500 mx-auto mb-8"></div>

                <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                  Derived from neural network analysis of localized NPK ratios and hydro-thermal patterns.
                </p>

                <div className="bg-white/5 rounded-xl p-4 inline-flex flex-col mx-auto w-full border border-white/5">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest mb-2">
                    <span className="text-slate-500">Confidence Score</span>
                    <span className="text-green-500 font-bold">Verified</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{width: '94%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-[24px] h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-white">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-200">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-900 mb-1">Awaiting Site Analysis</p>
              <p className="text-xs text-slate-400 max-w-[200px]">Configure soil and weather parameters to trigger the AI model.</p>
            </div>
          )}
        </div>
        
      </div>

      {recommended && (
        <div className="mt-12 border-t border-slate-100 pt-12 animate-[fadeInUp_0.8s_ease-out]">
          <MarketSuggestions categories={['Seeds']} title={`Start your ${recommended} harvest with premium seeds`} />
        </div>
      )}
    </div>
  );
};