import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth, MOCK_USER } from '@/context/AuthContext';
import { API } from '@/config/api';
import { Eye, EyeOff, Loader2, Leaf } from 'lucide-react';
import { toast } from 'sonner';

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
];

const Register = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', state: '', location: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const getStrength = (p: string) => {
    if (p.length < 6) return { label: 'Weak', color: 'bg-destructive', width: '33%' };
    if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Fair', color: 'bg-yellow-400', width: '66%' };
    return { label: 'Strong', color: 'bg-primary', width: '100%' };
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number';
    if (!form.state) e.state = 'Select your state';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(API.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          state: form.state,
          location: form.location,
          password: form.password,
        }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      login({
        name: form.name,
        phone: form.phone,
        state: form.state,
        location: form.location,
        access_token: data.access_token,
        farmer_id: data.farmer_id,
      });
      toast.success(`Welcome to AgriPredict AI, ${form.name.split(' ')[0]}!`);
      navigate('/soil-details');
    } catch {
      // Demo mode fallback
      login({
        name: form.name,
        phone: form.phone,
        state: form.state,
        location: form.location,
        access_token: 'demo-token-123',
      });
      toast.success(`Welcome to AgriPredict AI, ${form.name.split(' ')[0]}!`);
      navigate('/soil-details');
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const strength = getStrength(form.password);

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
          <p className="text-lg text-primary-foreground/90 mb-8">Join 10,000+ farmers growing smarter with AI</p>
          <div className="text-left space-y-4">
            {["Free yield predictions for your crops", "Instant disease detection from your phone", "SMS alerts before problems happen"].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground text-sm flex-shrink-0">✓</span>
                <span className="text-primary-foreground/90 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-card">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:text-green-600">Sign in →</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1.5">Full Name</label>
              <input type="text" placeholder="e.g. Ravi Kumar" value={form.name} onChange={e => update('name', e.target.value)}
                className={`w-full rounded-button border ${errors.name ? 'border-destructive' : 'border-border'} bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow`} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1.5">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded text-xs font-medium">+91</span>
                <input type="tel" placeholder="9876543210" value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`w-full rounded-button border ${errors.phone ? 'border-destructive' : 'border-border'} bg-card pl-14 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow`} />
              </div>
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            {/* State & District */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1.5">State</label>
                <select value={form.state} onChange={e => update('state', e.target.value)}
                  className={`w-full rounded-button border ${errors.state ? 'border-destructive' : 'border-border'} bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1.5">District</label>
                <input type="text" placeholder="e.g. Mysuru" value={form.location} onChange={e => update('location', e.target.value)}
                  className="w-full rounded-button border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow" />
              </div>
            </div>


            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                  className={`w-full rounded-button border ${errors.password ? 'border-destructive' : 'border-border'} bg-card px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{strength.label}</span>
                </div>
              )}
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1.5">Confirm Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={e => update('confirm', e.target.value)}
                  className={`w-full rounded-button border ${errors.confirm ? 'border-destructive' : 'border-border'} bg-card px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirm && <p className="text-xs text-destructive mt-1">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full rounded-button bg-primary py-3 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
