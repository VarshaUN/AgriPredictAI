import React, { useState } from 'react';
import { apiClient } from '../api';
import { useTranslation } from 'react-i18next';
import { MarketSuggestions } from '../components/MarketSuggestions';

export const PredictYield = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    crop_name: '',
    season: '',
    area: '',
    fertilizer: '',
    pesticide: '',
    soil_type: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update Soil Profile Snapshot (Transferred from signup/profile)
      await apiClient.updateSoilProfile({
        nitrogen: parseFloat(formData.nitrogen) || 0,
        phosphorus: parseFloat(formData.phosphorus) || 0,
        potassium: parseFloat(formData.potassium) || 0,
        ph: parseFloat(formData.ph) || 0,
      });

      // 2. Save harvesting inputs
      await apiClient.saveYieldInput({
        crop_name: formData.crop_name,
        season: formData.season,
        area: parseFloat(formData.area) || 0,
        fertilizer: parseFloat(formData.fertilizer) || 0,
        pesticide: parseFloat(formData.pesticide) || 0,
        soil_type: formData.soil_type
      });

      // 3. Fetch ML prediction mapped to the saved input
      const data = await apiClient.getYieldPrediction();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      // Detailed error reporting to help debug backend mismatches
      const errorMsg = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
      alert(`Error: ${errorMsg}\n\n(If it's a 500 error, ensure your crop/season names match the ML model labels exactly)`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8">
        <h3 className="text-xl font-bold font-heading mb-6 border-b pb-4">{t('yield.title')}</h3>
        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">{t('fields.crop')}</label>
              <select value={formData.crop_name} required onChange={(e)=>setFormData({...formData, crop_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-green-500 transition-all font-medium">
                <option value="" disabled>Select Crop</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Cotton(lint)">Cotton</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Growth Season</label>
              <select value={formData.season} required onChange={(e)=>setFormData({...formData, season: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-green-500 transition-all font-medium">
                <option value="" disabled>Select Season</option>
                <option value="Kharif     ">Kharif</option>
                <option value="Rabi       ">Rabi</option>
                <option value="Summer     ">Summer</option>
                <option value="Winter     ">Winter</option>
                <option value="Whole Year ">Whole Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">{t('fields.area')}</label>
              <input type="number" step="0.1" required value={formData.area} onChange={(e)=>setFormData({...formData, area: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-green-500 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Soil Type</label>
              <select value={formData.soil_type} required onChange={(e)=>setFormData({...formData, soil_type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-green-500 transition-all font-medium">
                <option value="" disabled>Select Soil Type</option>
                <option value="Loamy">Loamy</option>
                <option value="Clay">Clay</option>
                <option value="Sandy">Sandy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Fertilizer (kg/acre)</label>
              <input type="number" required value={formData.fertilizer} onChange={(e)=>setFormData({...formData, fertilizer: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-green-500 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Pesticide (kg/acre)</label>
              <input type="number" required value={formData.pesticide} onChange={(e)=>setFormData({...formData, pesticide: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-green-500 transition-all font-medium" />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-3">
              <div className="w-4 h-[1px] bg-slate-200"></div>
              {t('recommend.soil_profile')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t('fields.nitrogen')}</label>
                <input type="number" step="0.1" required value={formData.nitrogen} onChange={(e)=>setFormData({...formData, nitrogen: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-green-600 text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t('fields.phosphorus')}</label>
                <input type="number" step="0.1" required value={formData.phosphorus} onChange={(e)=>setFormData({...formData, phosphorus: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-green-600 text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t('fields.potassium')}</label>
                <input type="number" step="0.1" required value={formData.potassium} onChange={(e)=>setFormData({...formData, potassium: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-green-600 text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t('fields.ph')}</label>
                <input type="number" step="0.1" required value={formData.ph} onChange={(e)=>setFormData({...formData, ph: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-green-600 text-sm font-medium" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all flex justify-center items-center gap-2 text-lg shadow-xl shadow-slate-200">
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white/40 border-t-white rounded-full"></span>
            ) : t('yield.btn')}
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-8 space-y-8 animate-[fadeInUp_0.5s_ease-out]">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Calculated Total Yield</p>
              <div className="text-4xl font-extrabold text-slate-900 mb-1 font-heading">{result.prediction.predicted_yield.toLocaleString()}</div>
              <p className="text-emerald-700 font-semibold text-sm">Kilograms (Projected)</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Projected Gross Profit</p>
              <div className="text-4xl font-extrabold text-slate-900 mb-1 font-heading">₹{(result.profit.estimated_profit_per_acre * parseFloat(formData.area)).toLocaleString()}</div>
              <p className="text-blue-700 font-semibold text-sm">Estimated for {formData.area} acres</p>
            </div>
          </div>

          <MarketSuggestions categories={['Fertilizer', 'Pesticide']} title={t('market.recommended_inputs')} />
        </div>
      )}
    </div>
  );
}
