import { useState } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth, MOCK_USER } from '@/context/AuthContext';
import { API } from '@/config/api';
import { Eye, EyeOff, Loader2, Leaf } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const loginMessage = (location.state as { message?: string })?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Demo shortcut
    if (phone === '9999999999' && password === 'password123') {
      login(MOCK_USER);
      toast.success(`Welcome back, ${MOCK_USER.name.split(' ')[0]}!`);
      navigate('/dashboard');
      return;
    }

    try {
      const res = await fetch(API.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      // Backend TokenResponse: { access_token, token_type, farmer_id, name }
      login({
        name: data.name || 'User',
        phone,
        state: '',
        location: '',
        access_token: data.access_token,
        farmer_id: data.farmer_id,
      });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      setError('Incorrect phone number or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setPhone('9999999999');
    setPassword('password123');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {Array(12).fill(0).map((_, i) => (
            <Leaf key={i} className="absolute text-primary-foreground" style={{ top: `${(i * 23) % 100}%`, left: `${(i * 37) % 100}%`, opacity: 0.15, transform: `rotate(${i * 30}deg)` }} />
          ))}
        </div>
        <div className="relative z-10 text-center max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Leaf className="h-10 w-10 text-primary-foreground" />
            <span className="text-3xl font-bold text-primary-foreground">AgriPredict AI</span>
          </div>
          <p className="text-lg text-primary-foreground/90 mb-4">Smart Farming Starts Here</p>
          <p className="text-sm text-primary-foreground/70">AI-powered crop predictions for Indian farmers</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-card">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-8">
            New to AgriPredict AI? <Link to="/register" className="text-primary font-medium hover:text-green-600">Create account →</Link>
          </p>

          {loginMessage && (
            <div className="mb-6 rounded-button border-l-4 border-primary bg-green-50 p-4 text-sm text-green-700">
              {loginMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-button border-l-4 border-destructive bg-red-50 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1.5">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded text-xs font-medium">+91</span>
                <input type="tel" placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full rounded-button border border-border bg-card pl-14 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-600">Password</label>
                <button type="button" className="text-xs text-primary hover:text-green-600">Forgot Password?</button>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-button border border-border bg-card px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full rounded-button bg-primary py-3 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={fillDemo} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Demo: Use <span className="font-mono">9999999999</span> / <span className="font-mono">password123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
