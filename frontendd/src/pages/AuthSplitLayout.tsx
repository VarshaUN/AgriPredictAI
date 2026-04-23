import React from 'react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export const AuthSplitLayout = ({ children, checkmarks = [] }: { children: React.ReactNode, checkmarks?: string[] }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left Panel (45%) */}
      <div className="hidden lg:flex flex-col flex-none w-[45%] bg-green-700 text-white relative overflow-hidden py-12 px-16 justify-center">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-900/40 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3"></div>
        
        {/* Floating leaf scatter */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-700">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight">AgriPredict AI</span>
          </div>

          <h1 className="text-4xl font-bold font-heading mb-6 tracking-tight leading-snug">
            Your trusted partner in precision agriculture.
          </h1>
          
          <p className="text-green-100 text-lg mb-12 leading-relaxed">
            Join a community of progressive farmers taking the guesswork out of planting, treating, and selling.
          </p>

          {checkmarks.length > 0 && (
            <ul className="space-y-4">
              {checkmarks.map((text, idx) => (
                <li key={idx} className="flex items-center gap-4 text-green-50 font-medium text-lg">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Panel (55%) */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative overflow-y-auto">
        <div className="absolute top-8 right-8 z-50">
          <LanguageSwitcher />
        </div>
        <div className="max-w-md w-full mx-auto relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
