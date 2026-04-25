import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api';

export const SoilDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiClient.updateSoilProfile({
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        ph: parseFloat(formData.ph)
      });
      // Redirect to Dashboard after saving soil profile
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sync soil profile. Please try again or skip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 selection:bg-green-200">
      <div className="max-w-xl w-full bg-white rounded-[24px] p-8 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Ambient Decor */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100/50 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-100/50 rounded-full blur-[40px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-2">{t('auth.step_2')}</p>
              <h2 className="text-3xl font-bold font-heading text-slate-900 tracking-tight">{t('recommend.soil_profile')}</h2>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-sm">
                {t('auth.soil_onboarding_desc')}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-50 flex flex-col items-center justify-center border border-orange-100 mb-6 text-2xl shadow-sm">
              <span className="-mb-1">🌱</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3 rounded-r">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="relative group">
                <label className="block text-sm font-semibold mb-1 text-slate-700 transition-colors group-focus-within:text-blue-600">{t('fields.nitrogen')}</label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">mg/kg</span>
                  <input 
                    type="number" step="0.1" required
                    value={formData.nitrogen}
                    onChange={(e) => setFormData({...formData, nitrogen: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans font-medium pr-14" 
                    placeholder="120"
                  />
                </div>
              </div>
              <div className="relative group">
                <label className="block text-sm font-semibold mb-1 text-slate-700 transition-colors group-focus-within:text-orange-600">{t('fields.phosphorus')}</label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">mg/kg</span>
                  <input 
                    type="number" step="0.1" required
                    value={formData.phosphorus}
                    onChange={(e) => setFormData({...formData, phosphorus: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-sans font-medium pr-14" 
                    placeholder="45"
                  />
                </div>
              </div>
              <div className="relative group">
                <label className="block text-sm font-semibold mb-1 text-slate-700 transition-colors group-focus-within:text-purple-600">{t('fields.potassium')}</label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">mg/kg</span>
                  <input 
                    type="number" step="0.1" required
                    value={formData.potassium}
                    onChange={(e) => setFormData({...formData, potassium: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-sans font-medium pr-14" 
                    placeholder="210"
                  />
                </div>
              </div>
            </div>

            <div className="relative group max-w-[200px]">
              <label className="block text-sm font-semibold mb-1 text-slate-700 transition-colors group-focus-within:text-yellow-600">Soil pH Level</label>
              <div className="relative">
                <input 
                  type="number" step="0.1" required
                  value={formData.ph}
                  onChange={(e) => setFormData({...formData, ph: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium" 
                  placeholder="6.5"
                />
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-[0_4px_12px_rgba(22,163,74,0.2)] hover:shadow-[0_8px_24px_rgba(22,163,74,0.3)] transition-all flex justify-center items-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  `${t('auth.sync_profile')} →`
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                {t('common.skip_for_now')}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <p className="text-sm font-semibold text-slate-400 mt-8">AgriPredict AI • Secure Profile Generation</p>
    </div>
  );
};
