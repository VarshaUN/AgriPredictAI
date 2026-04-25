import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

const Icons = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Predict: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Disease: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Recommend: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  Profile: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Success: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Market: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )
};

export const DashboardLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t('common.dashboard'), path: '/dashboard', icon: <Icons.Dashboard /> },
    { name: t('common.predict_yield'), path: '/predict', icon: <Icons.Predict /> },
    { name: t('common.disease_detect'), path: '/disease', icon: <Icons.Disease /> },
    { name: t('common.recommend_crop'), path: '/recommend', icon: <Icons.Recommend /> },
    { name: t('common.profile'), path: '/profile', icon: <Icons.Profile /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - Hidden on mobile */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm relative z-40 hidden md:flex">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-slate-900">AgriPredict</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => {
            const active = location.pathname.startsWith(link.path);
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group ${
                  active 
                    ? 'bg-green-600 text-white shadow-md shadow-green-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-green-600 transition-colors'}>
                  {link.icon}
                </span>
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link 
            to="/success-stories"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              location.pathname.startsWith('/success-stories') ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Icons.Success />
            {t('common.success_stories')}
          </Link>
          <Link 
            to="/market"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              location.pathname.startsWith('/market') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <Icons.Market />
            {t('common.greenshift_market')}
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-500 font-bold hover:bg-red-50 hover:text-red-600 rounded-xl transition-all w-full text-left group" onClick={() => {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
          }}>
            <span className="group-hover:rotate-12 transition-transform"><Icons.Logout /></span>
            {t('common.sign_out')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative h-screen">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center z-50">
          <h2 className="font-heading font-bold text-2xl tracking-tight text-slate-900">
            {navLinks.find(n => location.pathname.startsWith(n.path))?.name || (location.pathname.startsWith('/market') ? 'GreenShift Market' : (location.pathname.startsWith('/success-stories') ? 'Success Stories' : 'Overview'))}
          </h2>
          
          <div className="flex items-center gap-3">
            {/* Desktop Account Actions */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher />
              <button className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 shadow-sm hover:bg-slate-50 transition-all">
                <Icons.Bell />
              </button>
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shadow-lg border-2 border-white uppercase text-sm">
                {localStorage.getItem('user_name')?.[0] || 'U'}
              </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            <div className="md:hidden relative">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                </svg>
              </button>

              {mobileMenuOpen && (
                <div className="absolute top-14 right-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 animate-[fadeInUp_0.2s_ease-out] z-[60]">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Menu</p>
                  <nav className="space-y-1">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.path} 
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                          location.pathname.startsWith(link.path) ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {link.icon}
                        {link.name}
                      </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
                      <LanguageSwitcher className="mb-4" />
                      <Link 
                        to="/success-stories"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                          location.pathname.startsWith('/success-stories') ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'
                        }`}
                      >
                        <Icons.Success />
                        {t('common.success_stories')}
                      </Link>
                      <Link 
                        to="/market"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                          location.pathname.startsWith('/market') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-emerald-600 bg-emerald-50'
                        }`}
                      >
                        <Icons.Market />
                        {t('common.greenshift_market')}
                      </Link>
                      <button 
                         className="flex items-center gap-3 px-4 py-3 text-red-600 font-bold text-sm w-full text-left"
                         onClick={() => {
                           localStorage.removeItem("access_token");
                           window.location.href = "/login";
                         }}
                      >
                        <Icons.Logout />
                        {t('common.sign_out')}
                      </button>
                    </div>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
