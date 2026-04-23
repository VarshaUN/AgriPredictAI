import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' }
  ];

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className={`relative group ${className}`}>
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/50 hover:bg-slate-100 border border-slate-200 transition-all font-bold text-xs uppercase tracking-widest text-slate-700">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span>{currentLanguage.code}</span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[70]">
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] transition-colors flex justify-between items-center ${
                i18n.language === lang.code 
                ? 'bg-green-600 text-white' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{lang.label}</span>
              <span className={i18n.language === lang.code ? 'text-white/60' : 'text-slate-400'}>{lang.native}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
