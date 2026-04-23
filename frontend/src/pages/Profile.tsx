import React from 'react';
import { useTranslation } from 'react-i18next';

export const Profile = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-[fadeIn_0.5s_ease-out]">
      <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-2xl relative">
        <div className="absolute inset-0 bg-green-500/20 rounded-2xl animate-pulse"></div>
        <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black font-heading text-slate-900 mb-4 tracking-tighter">
        {t('profile.title')}
      </h1>
      
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8 border border-slate-200">
        {t('profile.in_development')}
      </div>
      
      <p className="text-slate-500 max-w-lg text-sm font-medium leading-relaxed mb-12">
        {t('profile.subtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl opacity-30 select-none">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 bg-slate-50 rounded-lg mb-4 mx-auto"></div>
            <div className="h-3 w-24 bg-slate-100 rounded mb-2 mx-auto"></div>
            <div className="h-2 w-16 bg-slate-50 rounded mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
