import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api';

const SB_URL = 'https://xafdulvlkpjmwvefytlw.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZmR1bHZsa3BqbXd2ZWZ5dGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyODQ1MDMsImV4cCI6MjA5MDg2MDUwM30.DyabXrxndgrA-4R_19JO_1Hgty0QY17QQryAQ4nia1c';

export const DashboardOverview = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<any>(null);
  const [lastPrediction, setLastPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const farmerId = localStorage.getItem('farmer_id');
    try {
      // 1. Fetch Basic Identity from Supabase
      const profileRes = await fetch(`${SB_URL}/rest/v1/farmers?id=eq.${farmerId}&select=*`, {
        headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
      });
      const profileData = await profileRes.json();
      if (profileData?.[0]) setProfile(profileData[0]);

      // 2. Fetch Latest Prediction from Backend
      const predData = await apiClient.getYieldPrediction().catch(() => null);
      if (predData) setLastPrediction(predData);

    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 animate-pulse text-slate-400 font-bold">
      {t('dashboard.loading')}
    </div>
  );

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Welcome Section */}
      <section>
        <h1 className="text-3xl font-black text-slate-900 mb-2 font-heading">
          {t('dashboard.welcome', { name: profile?.name || 'Farmer' })}
        </h1>
        <p className="text-slate-500 font-medium">
          {t('dashboard.summary_desc')}
        </p>
      </section>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t('dashboard.farm_capacity')}</div>
          <div className="text-3xl font-black text-slate-900 font-heading">{profile?.land_area_acres || '0'} <span className="text-lg text-slate-400 font-bold">Acres</span></div>
        </div>

        <div className="bg-green-600 p-6 rounded-[24px] shadow-lg text-white relative overflow-hidden">
          <div className="text-green-100 text-[10px] font-black uppercase tracking-widest mb-4">{t('dashboard.net_revenue')}</div>
          <div className="text-3xl font-black font-heading">
            ₹{lastPrediction ? (lastPrediction.profit.estimated_profit_per_acre * lastPrediction.yield_input.area).toLocaleString() : '0'}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-[24px] shadow-lg text-white">
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t('dashboard.main_crop')}</div>
          <div className="text-3xl font-black font-heading">{lastPrediction?.yield_input.crop_name || 'Idle'}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Soil Health Summary */}
        <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            {t('recommend.soil_profile')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: t('fields.nitrogen'), val: profile?.nitrogen, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: t('fields.phosphorus'), val: profile?.phosphorus, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: t('fields.potassium'), val: profile?.potassium, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: t('fields.ph'), val: profile?.ph, color: 'text-emerald-600', bg: 'bg-emerald-50' }
            ].map((item) => (
              <div key={item.label} className={`${item.bg} p-4 rounded-2xl border border-white shadow-inner`}>
                <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">{item.label}</span>
                <span className={`text-xl font-black ${item.color}`}>{item.val || '0.0'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Detail */}
        <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-sm">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            {t('yield.performance_forecast')}
          </h3>
          {lastPrediction ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Seasonal Cycle</span>
                <span className="font-bold text-slate-900">{lastPrediction.yield_input.season}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Edaphic Category</span>
                <span className="font-bold text-slate-900 text-xs uppercase tracking-tighter">{lastPrediction.yield_input.soil_type}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Projected Yield</span>
                <span className="font-bold text-green-600">{lastPrediction.prediction.predicted_yield.toLocaleString()} {lastPrediction.prediction.unit}</span>
              </div>
              <div className="pt-4 flex items-center gap-4">
                <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fertilizer Load</div>
                  <div className="font-bold text-slate-900">{lastPrediction.yield_input.fertilizer} kg</div>
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pesticide Load</div>
                  <div className="font-bold text-slate-900">{lastPrediction.yield_input.pesticide} kg</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 italic">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm font-semibold">No harvest data available for this plot.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
