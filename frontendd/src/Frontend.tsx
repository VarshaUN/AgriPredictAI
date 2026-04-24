import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/LanguageSwitcher';

const Frontend = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans bg-[#f8fafc] text-slate-900 min-h-screen overflow-x-hidden selection:bg-green-200">
      
      {/* Navbar */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full flex items-center justify-between px-6 py-3 w-[90%] max-w-5xl ${
        scrolled ? 'bg-white/80 backdrop-blur-xl shadow-md border border-white/20' : 'bg-transparent'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <span className="font-heading font-bold text-lg text-slate-800 tracking-tight">GreenShift <span className="text-green-600">· AgriPredict AI</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/success-stories" className="text-sm font-medium text-slate-600 hover:text-green-600 transition-colors uppercase tracking-widest text-[10px] font-bold">
            {t('common.farmer_success_stories')}
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900">{t('common.sign_in')}</Link>
          <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-5 rounded-full shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5">
            {t('common.get_started')} &rarr;
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center overflow-hidden">
        {/* Ambient Blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-200/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-200/30 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_10%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6 animate-[fadeInUp_0.8s_ease-out]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {t('landing.badge')}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-heading text-slate-900 tracking-tight leading-tight">
            {t('landing.hero_title_1')} <br className="hidden md:block"/>
            <span className="text-green-600">{t('landing.hero_title_highlight')}</span> {t('landing.hero_title_2')} <span className="text-orange-500">{t('landing.hero_title_highlight_alt')}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl px-4 leading-relaxed mt-4">
            {t('landing.hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full justify-center px-4">
            <Link to="/register" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl ring-4 ring-green-600/20 shadow-xl shadow-green-600/20 transition-all hover:-translate-y-1 inline-flex justify-center text-center">
              {t('landing.cta_start_ai')}
            </Link>
            <Link to="/market" className="w-full sm:w-auto bg-white hover:bg-orange-50 text-orange-600 font-semibold py-4 px-8 rounded-xl border border-orange-200 shadow-sm transition-all hover:-translate-y-1 text-center">
              {t('landing.cta_visit_market')}
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 px-4 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900">{t('landing.problem_title')}</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">{t('landing.problem_subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border rounded-[16px] p-8 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">The Pre-Harvest Guesswork</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">Ravi, a 3-acre farmer from Karnataka, applied too much fertilizer based on neighbor's advice and missed a blight infection by just 4 days.</p>
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3">
                <span className="text-lg">📉</span> Financial Impact: ₹7,200 lost on inputs
              </div>
            </div>

            <div className="bg-white border rounded-[16px] p-8 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">The Post-Harvest Squeeze</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">After bringing 40 quintals of crop to the local mandi, Ravi faced a buyer monopoly and was forced to sell at 15% below MSP.</p>
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3">
                <span className="text-lg">📉</span> Financial Impact: ₹7,000 lost on final sale
              </div>
            </div>
          </div>

          <div className="bg-green-600 text-white rounded-2xl p-6 text-center max-w-2xl mx-auto font-medium text-lg shadow-xl shadow-green-600/20">
            We built two intelligent tools to fix both sides of the equation.
          </div>
        </div>
      </section>

      {/* Tool 01: AgriPredict AI */}
      <section className="py-24 px-4 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4 flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-slate-300"></div>
            <span className="text-sm font-bold tracking-widest text-slate-500 uppercase">Tool 01</span>
            <div className="h-[1px] w-12 bg-slate-300"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 text-center mb-16">AgriPredict AI</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { 
              title: "Yield Forecasting", 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ), 
              desc: "Predictive harvesting projections based on seasonal data." 
            },
            { 
              title: "Pathogen Scanner", 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2m4-8H8m12 4v.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ), 
              desc: "Computer vision based diagnosis for rapid crop recovery." 
            },
            { 
              title: "Agronomy Cloud", 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              ), 
              desc: "Adaptive recommendations for specialized soil conditioning." 
            },
            { 
              title: "Digital Ledger", 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ), 
              desc: "Traceable records of soil performance and yield history." 
            }
          ].map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-[20px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                {f.icon}
              </div>
              <h4 className="font-bold text-lg mb-3 text-slate-900">{f.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-4xl font-bold mb-8 leading-tight text-slate-950">Precise intelligence <br/>for professional farming.</h3>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
              Transform your agricultural operation from estimation to calculation. Our platform integrates deep-learning models directly into your daily workflow.
            </p>
            <ul className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10">
              {['Real-time Weather Sync', 'Soil Nutrient Analysis', 'Automated Protocols', 'Market Arbitrage'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-800 font-bold text-sm">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-3 shadow-lg group">
              Get Analysis Access
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-2xl relative">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Plot Diagnostics</span>
              </div>
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-green-100">
                ACTIVE_SCAN
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registered Plot #042</p>
              <div className="text-2xl font-black text-slate-900 font-heading">Rice Field • Andhra Pradesh</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <p className="text-[10px] text-slate-500 font-black mb-1 uppercase tracking-widest leading-none">Net Yield Output</p>
                <p className="text-2xl font-black text-slate-900">4,850 <span className="text-sm text-slate-400 font-bold uppercase">kg</span></p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <p className="text-[10px] text-slate-500 font-black mb-1 uppercase tracking-widest leading-none">Market Valuation</p>
                <p className="text-2xl font-black text-slate-900">₹92,400</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-5 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/50">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-sm text-white">Visual Inspection</h5>
                  <p className="text-[10px] text-slate-500 uppercase font-black">Pathogen Scan: Negative</p>
                </div>
              </div>
              <button className="text-[10px] font-black text-green-500 uppercase tracking-widest hover:text-white transition-colors">Re-analyze</button>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Floating Action Buttons */}
      <a href="https://wa.me/917795931323" target="_blank" rel="noreferrer" className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white py-3 px-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 font-medium">
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.451-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413"/></svg>
        <span>Chat on WhatsApp</span>
      </a>

      {/* Footer CTA */}
      <section className="bg-slate-900 py-32 text-center px-4 relative overflow-hidden text-white rounded-t-[100px] md:rounded-t-[200px] -mt-20 z-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-8 tracking-tighter leading-tight uppercase">{t('landing.footer_cta_title')}</h2>
          <p className="text-slate-400 mb-12 text-lg font-medium leading-relaxed">{t('landing.footer_cta_subtitle')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-green-600 hover:bg-green-500 text-white font-black py-5 px-10 rounded-2xl ring-2 ring-green-600 ring-offset-4 ring-offset-slate-900 transition-all shadow-2xl shadow-green-600/40 uppercase tracking-widest text-xs">
              {t('common.get_started')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 text-center text-sm border-t border-slate-800">
        <p>&copy; 2026 AgriPredict AI (Powered by GreenShift). All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Frontend;
