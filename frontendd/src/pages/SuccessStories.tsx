import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const stories = [
  {
    name: "Ramesh Hegde",
    location: "Mandya, Karnataka",
    crop: "Sugarcane",
    stat: "22% Yield Increase",
    quote: "By using the Pathogen Scanner early in the season, I saved my entire crop from a red rot outbreak. The AI predicted the risk before I even saw the symptoms.",
    impact: "Saved ₹1.2 Lakhs in Potential Loss"
  },
  {
    name: "Gurminder Singh",
    location: "Ludhiana, Punjab",
    crop: "Wheat",
    stat: "₹45,000 Extra Profit",
    quote: "The Yield Predictor helped me optimize my nitrogen application. I used 15% less fertilizer but got a much better harvest than last year.",
    impact: "Reduced Input Costs by 18%"
  },
  {
    name: "Anita Deshmukh",
    location: "Nashik, Maharashtra",
    crop: "Grapes",
    stat: "Premium Quality Export",
    quote: "Crop Recommended matching my exact soil pH was a game changer. AgriPredict AI suggested a variety I hadn't considered, which fetch a higher price in the market.",
    impact: "Reached 94% Export Grade Quality"
  },
  {
    name: "Vikram Rathore",
    location: "Anand, Gujarat",
    crop: "Cotton",
    stat: "Informed Marketing",
    quote: "The forecasting tool gave me the confidence to wait for better prices. Knowing my projected yield helped me negotiate better with buyers on GreenShift.",
    impact: "Sold at 12% above local Mandi prices"
  }
];

export const SuccessStories = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-green-200">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <svg className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-black text-slate-900 uppercase tracking-widest text-xs">{t('common.return_to_platform')}</span>
          </Link>
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-100">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-20">
            <h1 className="text-5xl md:text-6xl font-black font-heading text-slate-950 tracking-tighter mb-6 leading-tight">
              {t('success.title_1')} <br/>{t('success.title_2')}
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              {t('success.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-950 tracking-tight">{story.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{story.location} • {story.crop}</p>
                    </div>
                  </div>

                  <blockquote className="text-lg font-medium text-slate-700 leading-relaxed mb-8 italic">
                    "{story.quote}"
                  </blockquote>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-8">
                    <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                      <p className="text-[10px] text-green-700 font-black mb-1 uppercase tracking-widest">Growth Metric</p>
                      <p className="text-xl font-black text-slate-950 font-heading">{story.stat}</p>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-4 shadow-xl">
                      <p className="text-[10px] text-slate-500 font-black mb-1 uppercase tracking-widest">Financial Impact</p>
                      <p className="text-xl font-black text-white font-heading">{story.impact}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 bg-slate-900 rounded-[40px] p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:40px_40px]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-6 uppercase tracking-widest">{t('success.cta_title')}</h2>
              <p className="max-w-xl mx-auto text-slate-400 mb-10 font-medium">
                {t('success.cta_subtitle')}
              </p>
              <Link to="/register" className="bg-green-600 hover:bg-green-500 text-white font-black py-4 px-10 rounded-xl transition-all shadow-xl shadow-green-600/20 uppercase tracking-widest text-xs">
                {t('success.cta_button')}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-white">
        © 2026 AgriPredict AI Precision Network
      </footer>
    </div>
  );
};
