import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, Leaf, Calendar, BarChart3, ArrowRight, Search, Bell as BellIcon, BookOpen, Sprout, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const yieldData = [
  { month: "Oct", yield: 1800 }, { month: "Nov", yield: 2100 },
  { month: "Dec", yield: 1950 }, { month: "Jan", yield: 2300 },
  { month: "Feb", yield: 2400 }, { month: "Mar", yield: 2200 },
];

const predictions = [
  { date: "12 Mar", crop: "Rice", yield: "2,400 kg/ac", profit: "₹38,500", status: "Completed" },
  { date: "01 Mar", crop: "Wheat", yield: "1,800 kg/ac", profit: "₹29,000", status: "Completed" },
  { date: "18 Feb", crop: "Tomato", yield: "3,200 kg/ac", profit: "₹48,000", status: "Completed" },
];

const weekWeather = [
  { day: "Mon", temp: "28°C", icon: "Sun", today: false },
  { day: "Tue", temp: "27°C", icon: "Cloud", today: false },
  { day: "Wed", temp: "29°C", icon: "Sun", today: false },
  { day: "Thu", temp: "26°C", icon: "CloudRain", today: true },
  { day: "Fri", temp: "25°C", icon: "CloudRain", today: false },
  { day: "Sat", temp: "28°C", icon: "Cloud", today: false },
  { day: "Sun", temp: "30°C", icon: "Sun", today: false },
];

const alerts = [
  { type: 'warning' as const, icon: 'warning', title: 'Irrigation Due', body: 'Rice field needs water in 2 days', borderColor: 'border-l-yellow-400', bg: 'bg-yellow-50' },
  { type: 'success' as const, icon: 'check', title: 'Sowing Window Open', body: 'Optimal period for Rabi crop started today', borderColor: 'border-l-green-400', bg: 'bg-green-50' },
  { type: 'info' as const, icon: 'info', title: 'Fertilizer Reminder', body: 'Apply Urea by this Friday', borderColor: 'border-l-blue-400', bg: 'bg-blue-50' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedReportId, setSelectedReportId] = useState<string>('default');
  const [data, setData] = useState({
    yieldData,
    predictions,
    weekWeather,
    alerts,
    stats: [
      { icon: Sun, iconBg: 'bg-amber-100', iconColor: 'text-amber-500', label: "Today's Weather", value: "28°C", sub: `Partly Cloudy · ${user?.location || 'Mysuru'}` },
      { icon: Leaf, iconBg: 'bg-green-100', iconColor: 'text-primary', label: "Active Crop", value: "Rice", sub: "Kharif Season · 2.5 acres" },
      { icon: Calendar, iconBg: 'bg-blue-100', iconColor: 'text-blue-500', label: "Days to Harvest", value: "42 days", sub: "Est. harvest: 15 May" },
      { icon: BarChart3, iconBg: 'bg-purple-100', iconColor: 'text-purple-500', label: "Last Prediction", value: "2,400 kg/ac", sub: "₹38,500 projected profit" },
    ]
  });

  const activeStats = useMemo(() => {
    if (selectedReportId === 'default') return data.stats;
    const report = user?.reports?.find(r => r.id === selectedReportId);
    if (!report) return data.stats;

    return [
      { icon: Sun, iconBg: 'bg-amber-100', iconColor: 'text-amber-500', label: "Weather", value: "28°C", sub: `${report.crop} optimal temp` },
      { icon: Leaf, iconBg: 'bg-green-100', iconColor: 'text-primary', label: "Report Selector", value: report.crop, sub: `${report.season} Season` },
      { icon: Calendar, iconBg: 'bg-blue-100', iconColor: 'text-blue-500', label: "Report Date", value: new Date(report.date).toLocaleDateString(), sub: "Saved Prediction" },
      { icon: BarChart3, iconBg: 'bg-purple-100', iconColor: 'text-purple-500', label: "Predicted Yield", value: `${report.yield.toLocaleString()} kg/ac`, sub: `₹${report.profit.toLocaleString()} profit` },
    ];
  }, [selectedReportId, data.stats, user?.reports]);

  const activePredictions = useMemo(() => {
    if (selectedReportId === 'default') return data.predictions;
    const report = user?.reports?.find(r => r.id === selectedReportId);
    if (!report) return data.predictions;
    
    return [
      { date: new Date(report.date).toLocaleDateString(), crop: report.crop, yield: `${report.yield.toLocaleString()} kg/ac`, profit: `₹${report.profit.toLocaleString()}`, status: "Saved" },
      ...data.predictions
    ];
  }, [selectedReportId, data.predictions, user?.reports]);

  // Dashboard data is displayed from local state (mock/user reports).
  // No /dashboard endpoint exists in the backend — AI features use
  // /yield-input, /detect-disease, /recommend-crop instead.

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const firstName = user?.name?.split(' ')[0] || 'Farmer';

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />

      {/* Greeting */}
      <div className="view-container px-4 md:px-6">
        <div className="mt-2 md:mt-6 bg-white rounded-2xl md:rounded-3xl shadow-sm p-5 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Link to="/profile" className="animate-fade-in-up group">
              <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900 group-hover:text-primary transition-colors">{greeting}, {firstName}</h1>
              <p className="text-xs md:text-base text-gray-500 font-medium">{dateStr}</p>
            </Link>
          </div>

          <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-2xl self-start md:self-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Sprout className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Your Location</p>
              <p className="text-xs md:text-sm font-bold text-gray-800 leading-none">{user?.location || 'Mysuru'}, {user?.state || 'Karnataka'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="view-container px-4 md:px-6 py-4 md:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
          {activeStats.map((stat, i) => {
            const isReportSelector = stat.label.includes('Report Selector') || stat.label.includes('Crop');
            const Icon = (stat as any).IconComponent || stat.icon;
            
            return (
              <div key={i} className={`card-premium p-4 md:p-8 hover:shadow-2xl animate-fade-in-up relative overflow-hidden ${isReportSelector ? 'ring-2 ring-primary/20 bg-emerald-50/10' : ''}`} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-8 w-8 md:h-12 md:w-12 rounded-lg md:rounded-2xl ${stat.iconBg || 'bg-green-100'} flex items-center justify-center shadow-sm`}>
                    {Icon && <Icon className={`h-4 w-4 md:h-6 md:w-6 ${stat.iconColor || 'text-primary'}`} />}
                  </div>
                  <span className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-wide">{stat.label}</span>
                </div>
                
                {isReportSelector ? (
                  <div className="relative mt-2 min-h-[48px] flex flex-col justify-center">
                    <div className="relative group flex items-center">
                      <select 
                        value={selectedReportId} 
                        onChange={(e) => setSelectedReportId(e.target.value)}
                        className="w-full appearance-none bg-transparent text-xl md:text-2xl font-bold tracking-tighter text-gray-900 outline-none cursor-pointer pr-10 focus:text-primary transition-colors truncate pb-1"
                      >
                        <option value="default">{selectedReportId === 'default' ? stat.value : 'Live Stats'}</option>
                        {user?.reports?.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                        {(!user?.reports || user.reports.length === 0) && (
                          <option disabled>No Saved Reports</option>
                        )}
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary group-hover:scale-110 transition-transform">
                        <ChevronDown size={20} />
                      </div>
                    </div>
                    <p className="text-[10px] md:text-xs font-bold text-primary mt-2 flex items-center gap-1 group opacity-80">
                      Tap to Change <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-xl md:text-4xl font-bold tracking-tighter text-gray-900">{stat.value}</p>
                    <p className="text-[10px] md:text-sm font-medium text-gray-400 mt-0.5">{stat.sub}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Soil Health Summary */}
        {user?.soilDetails && (
          <div className="card-premium p-6 md:p-8 mb-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-green-50 text-primary rounded-xl">
                  <Sprout size={20} />
                </div>
                Soil Health Profile
              </h2>
              <Link to="/soil-details" className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors">
                Update Data
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center md:text-left">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nitrogen (N)</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{user.soilDetails.nitrogen} <span className="text-xs font-semibold text-gray-400">mg/kg</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phosphorus (P)</p>
                <p className="text-xl md:text-2xl font-bold text-orange-500">{user.soilDetails.phosphorus} <span className="text-xs font-semibold text-gray-400">mg/kg</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Potassium (K)</p>
                <p className="text-xl md:text-2xl font-bold text-purple-600">{user.soilDetails.potassium} <span className="text-xs font-semibold text-gray-400">mg/kg</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Soil pH</p>
                <p className="text-xl md:text-2xl font-bold text-yellow-500">{user.soilDetails.ph}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="grid lg:grid-cols-[60%_40%] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Chart (Concise Mobile View) */}
            <div className="card-premium p-4 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-4 md:mb-8">
                <div>
                  <h2 className="text-base md:text-xl font-bold tracking-tight text-gray-900">Yield Forecast</h2>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest border border-gray-200">6mo</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data.yieldData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} hide />
                  <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 10 }} />
                  <Line type="monotone" dataKey="yield" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* History Cards (Concise Mobile) */}
            <div className="card-premium p-4 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-bold tracking-tight text-gray-900">Recent Predictions</h2>
                <button className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest">View All</button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x md:grid md:grid-cols-1 md:gap-0 md:pb-0 hide-scrollbar">
                {activePredictions.map((p, i) => (
                  <div key={i} className="min-w-[200px] md:min-w-0 flex-shrink-0 md:flex md:items-center md:justify-between p-3 md:p-4 rounded-xl md:rounded-none bg-gray-50/50 md:bg-transparent snap-start">
                    <div className="flex items-center justify-between md:justify-start gap-4 mb-2 md:mb-0">
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">{p.date}</p>
                        <p className="text-sm font-bold text-gray-900 leading-none">{p.crop}</p>
                      </div>
                      <span className="md:hidden rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold text-primary">{p.status}</span>
                    </div>
                    <div className="flex justify-between items-end md:items-center md:gap-8">
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">Impact</p>
                        <p className="text-xs font-bold text-gray-700 leading-none">{p.yield}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">Profit</p>
                        <p className="text-xs font-bold text-gray-700 leading-none">{p.profit}</p>
                      </div>
                      <span className="hidden md:block rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-primary">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Weather Forecast */}
            <div className="card-premium p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold tracking-tight mb-4 md:mb-6">Weather Forecast</h2>
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
                {data.weekWeather.map((w, i) => (
                  <div key={i} className={`flex flex-col items-center gap-1 px-2.5 py-3 rounded-2xl min-w-[50px] md:min-w-[56px] snap-start ${w.today ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-600'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{w.day}</span>
                    <Sun className="h-4 w-4 md:h-5 md:w-5 my-1" />
                    <span className="text-sm md:text-base font-bold">{w.temp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="card-premium p-6 md:p-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold tracking-tight">Active Alerts</h2>
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-[10px] text-white font-bold shadow-lg shadow-primary/30 animate-bounce">2</span>
              </div>
              <div className="space-y-2 md:space-y-3">
                {data.alerts.map((a: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 md:p-4 rounded-2xl bg-gray-50 group hover:bg-white hover:shadow-sm transition-all">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0 animate-ripple">
                      {a.IconComponent ? <a.IconComponent className="h-4 w-4 text-primary" /> : <Sprout className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-bold text-gray-900 leading-tight mb-0.5">{a.title}</p>
                      <p className="text-[10px] md:text-xs text-gray-500 font-medium">{a.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions (Concise Grid) */}
            <div className="card-premium p-5 md:p-8">
              <h2 className="text-base md:text-xl font-bold tracking-tight mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {[
                  { icon: BarChart3, label: "Predict",   to: "/predict" },
                  { icon: Search,    label: "Detection",  to: "/disease" },
                  { icon: Leaf,      label: "Recommend",  to: "/recommend" },
                  { icon: BookOpen,  label: "Guide",      to: null },
                ].map((action, i) => (
                  <Link key={i} to={action.to || "#"} onClick={() => !action.to && toast.info("Coming soon!")}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-white transition-all shadow-sm active:scale-95 group">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
