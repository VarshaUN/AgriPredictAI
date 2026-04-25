import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api';
import { AuthSplitLayout } from './AuthSplitLayout';
import { useState } from 'react';

// ...rest of your component code...
export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.login({ phone, password });
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user_name', response.name);
      localStorage.setItem('farmer_id', response.farmer_id);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-[0.2em] mb-8 transition-colors group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t('common.return_to_home')}
      </Link>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 font-heading tracking-tight text-slate-950">{t('auth.login_title')}</h2>
        <p className="text-slate-500 font-medium">{t('auth.login_subtitle')}</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-4">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
             <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
          </div>
          <p className="text-sm text-red-700 font-bold">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 border border-green-100 p-4 rounded-xl flex items-start gap-4">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
             <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
          </div>
          <p className="text-sm text-green-700 font-bold">{success}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">+91</span>
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-16 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-sans"
              placeholder="98765 43210"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-slate-700">{t('auth.password')}</label>
            <a href="#" className="text-sm font-medium text-green-600 hover:text-green-700">Forgot password?</a>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-sans"
              placeholder="••••••••"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-medium"
            >
               {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl shadow-[0_4px_12px_rgba(22,163,74,0.2)] hover:shadow-[0_8px_24px_rgba(22,163,74,0.3)] transition-all flex justify-center items-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            t('common.sign_in')
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-slate-100 pt-6">
        <p className="text-slate-500 text-sm">
          {t('auth.dont_have_account')} <Link to="/register" className="font-semibold text-green-600 hover:text-green-700">Register</Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
};
