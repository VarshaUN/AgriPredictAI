import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api';
import { AuthSplitLayout } from './AuthSplitLayout';

export const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPwd: '',
    state: '',
    location: '',
    land_area_acres: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength pseudo-logic
  const getPwdStrength = () => {
    const len = formData.password.length;
    if (len === 0) return { label: '', color: 'bg-slate-200', width: '0%' };
    if (len < 5) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (len < 8) return { label: 'Fair', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = getPwdStrength();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPwd) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.register({
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        state: formData.state,
        location: formData.location,
        land_area_acres: parseFloat(formData.land_area_acres) || 0
      });
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user_name', response.name);
      localStorage.setItem('farmer_id', response.farmer_id);
      
      // Redirect directly to dashboard (skipping soil onboarding as requested)
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout checkmarks={[
      t('yield.title'),
      t('disease.title'),
      t('common.greenshift_market')
    ]}>
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-[0.2em] mb-8 transition-colors group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t('common.return_to_home')}
      </Link>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 font-heading tracking-tight text-slate-950">{t('auth.register_title')}</h2>
        <p className="text-slate-500 font-medium">
          {t('auth.register_subtitle')} Already have an account? 
          <Link to="/login" className="ml-2 text-green-600 font-bold hover:underline font-heading">{t('auth.login_now')}</Link>
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-4">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
             <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
          </div>
          <p className="text-sm text-red-700 font-bold">{error}</p>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('auth.full_name')}</label>
          <input 
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-sans"
            placeholder="Ravi Kumar"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded text-sm">+91</span>
            <input 
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full pl-14 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-sans"
              placeholder="9876543210"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
            <select 
              required
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-700"
            >
              <option value="">Select State</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Punjab">Punjab</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">District / Location</label>
            <input 
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              placeholder="Mandya"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('fields.area')}</label>
          <input 
            type="number"
            step="0.1"
            required
            value={formData.land_area_acres}
            onChange={(e) => setFormData({...formData, land_area_acres: e.target.value})}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-sans"
            placeholder="3.5"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('auth.password')}</label>
          <input 
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-sans"
            placeholder="••••••••"
          />
          {/* Password strength meter */}
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }}></div>
            </div>
            <span className={`text-xs font-bold w-12 text-right ${strength.color.replace('bg-', 'text-')}`}>
              {strength.label}
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
          <input 
            type="password"
            required
            value={formData.confirmPwd}
            onChange={(e) => setFormData({...formData, confirmPwd: e.target.value})}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-sans"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl shadow-[0_4px_12px_rgba(22,163,74,0.2)] hover:shadow-[0_8px_24px_rgba(22,163,74,0.3)] transition-all flex justify-center items-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            t('common.get_started')
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-slate-100 pt-6">
        <p className="text-slate-500 text-sm">
          {t('auth.already_have_account')} <Link to="/login" className="font-semibold text-green-600 hover:text-green-700">{t('common.sign_in')}</Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
};
