import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  User, Mail, Phone, MapPin, Calendar, Camera, Edit2, 
  Save, Sprout, ShieldCheck, ChevronRight, BarChart3, Clock, RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    state: user?.state || '',
    location: user?.location || '',
    farmSize: String(user?.land_area_acres || ''),
    nitrogen: user?.soilDetails?.nitrogen || 0,
    phosphorus: user?.soilDetails?.phosphorus || 0,
    potassium: user?.soilDetails?.potassium || 0,
    ph: user?.soilDetails?.ph || 0,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        state: user.state,
        location: user.location,
        farmSize: String(user.land_area_acres || ''),
        nitrogen: user.soilDetails?.nitrogen || 0,
        phosphorus: user.soilDetails?.phosphorus || 0,
        potassium: user.soilDetails?.potassium || 0,
        ph: user.soilDetails?.ph || 0,
      });
    }
  }, [user]);

  const handleSave = async () => {
    // Update local state immediately
    updateUser({
      name: formData.name,
      phone: formData.phone,
      state: formData.state,
      location: formData.location,
      land_area_acres: parseFloat(formData.farmSize) || undefined,
      soilDetails: {
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        ph: Number(formData.ph),
      }
    });

    // Also persist soil data to backend (PATCH /auth/profile/soil)
    if (user?.access_token && user.access_token !== 'demo-token-123') {
      try {
        await fetch(import.meta.env.VITE_API_URL + '/auth/profile/soil', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.access_token}`,
          },
          body: JSON.stringify({
            nitrogen: Number(formData.nitrogen),
            phosphorus: Number(formData.phosphorus),
            potassium: Number(formData.potassium),
            ph: Number(formData.ph),
          }),
        });
      } catch {
        // Non-critical: local state already updated
      }
    }

    setIsEditing(false);
    toast.success('Profile & Soil Data updated!');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24">
      <Navbar />
      
      <div className="view-container py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Card */}
          <div className="relative mb-8">
            <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 overflow-hidden relative shadow-lg">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
              </div>
            </div>
            
            <div className="absolute -bottom-16 left-8 md:left-12 flex items-end gap-6">
              <div className="relative group">
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl bg-white p-2 shadow-2xl">
                  <div className="h-full w-full rounded-2xl bg-emerald-100 flex items-center justify-center text-4xl md:text-5xl font-bold text-emerald-600">
                    {initials}
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 p-2.5 rounded-xl bg-white shadow-lg border border-gray-100 text-gray-500 hover:text-emerald-500 transition-all hover:scale-110">
                  <Camera size={20} />
                </button>
              </div>
              
              <div className="pb-4 hidden md:block">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  {user?.name} 
                  <ShieldCheck size={24} className="text-emerald-500" />
                </h1>
                <p className="text-gray-500 font-medium flex items-center gap-2">
                  <MapPin size={16} /> {user?.location}, {user?.state}
                </p>
              </div>
            </div>

            <div className="absolute -bottom-12 right-8 hidden md:block">
              {isEditing ? (
                <button onClick={handleSave} className="btn-primary px-8 flex items-center gap-2 shadow-xl shadow-emerald-500/20">
                  <Save size={18} /> Save Profile
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="rounded-2xl border-2 border-emerald-500 text-emerald-600 px-8 py-3.5 font-bold hover:bg-emerald-50 transition-all">
                  <Edit2 size={18} className="inline mr-2" /> Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_0.6fr] gap-8 mt-24">
            
            {/* Main Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  <div className="md:hidden">
                    {isEditing ? (
                      <button onClick={handleSave} className="text-emerald-600 font-bold text-sm">Save</button>
                    ) : (
                      <button onClick={() => setIsEditing(true)} className="text-emerald-600 font-bold text-sm">Edit</button>
                    )}
                  </div>
                </div>
                
                <div className="p-8 grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input 
                          disabled={!isEditing}
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-70"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input 
                          disabled={!isEditing}
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-70"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Location State</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input 
                          disabled={!isEditing}
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-70"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">District</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input 
                          disabled={!isEditing}
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-70"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Soil Health Section */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Sprout className="text-emerald-500" size={20} />
                    Soil Health Parameters
                  </h2>
                </div>
                
                <div className="p-8 grid md:grid-cols-2 lg:grid-cols-5 gap-5">
                  {[
                    { label: "Nitrogen (N)",   key: "nitrogen",        unit: "mg/kg" },
                    { label: "Phosphorus (P)", key: "phosphorus",      unit: "mg/kg" },
                    { label: "Potassium (K)",  key: "potassium",       unit: "mg/kg" },
                    { label: "Soil pH",        key: "ph",              unit: "" },
                    { label: "Farm Size",      key: "farmSize",        unit: "acres" },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5 px-1">{field.label}</label>
                      <div className="relative">
                        <input 
                          type="number" step="0.1"
                          disabled={!isEditing}
                          value={formData[field.key as keyof typeof formData]}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-70"
                        />
                        {field.unit && <span className="absolute right-4 top-3 text-[10px] font-bold text-gray-300 uppercase">{field.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Reports Section */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="text-emerald-500" size={20} />
                    Saved Harvest Reports
                  </h2>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-100">
                    {user?.reports?.length || 0} Reports
                  </span>
                </div>
                
                <div className="p-4 md:p-8">
                  {!user?.reports || user.reports.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                      <p className="text-gray-400 font-medium">No saved reports yet.</p>
                      <Link to="/predict" className="text-emerald-600 text-sm font-bold mt-2 inline-block hover:underline">Run your first prediction →</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.reports.map((report) => (
                        <div key={report.id} className="group p-5 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <Sprout className="text-emerald-500" size={22} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 leading-none mb-1.5">{report.name}</h3>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(report.date).toLocaleDateString()}</span>
                                <span className="h-1 w-1 rounded-full bg-gray-200" />
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{report.crop} • {report.season}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 md:gap-12 bg-white/50 px-6 py-3 rounded-2xl border border-gray-100/50">
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Yield</p>
                              <p className="text-sm font-black text-gray-900 leading-none">{report.yield.toLocaleString()} <span className="text-[10px] font-bold text-gray-400">kg/ac</span></p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Impact</p>
                              <p className="text-sm font-black text-emerald-600 leading-none">₹{report.profit.toLocaleString()}</p>
                            </div>
                            <button 
                              onClick={() => {
                                const remaining = user.reports?.filter(r => r.id !== report.id) || [];
                                updateUser({ reports: remaining });
                                toast.error("Report deleted");
                              }}
                              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <RotateCcw className="rotate-45" size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-emerald-900 mb-1">Farm Verification</h3>
                    <p className="text-emerald-600 font-medium">Your account is verified as an active producer.</p>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-lg border border-emerald-100">
                    <ShieldCheck size={32} className="text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Security</h3>
                <p className="text-sm text-gray-500 mb-6">Manage your account access and security settings.</p>
                <button className="w-full py-3.5 rounded-2xl border border-red-100 text-red-500 font-bold bg-red-50 hover:bg-red-100 transition-all">
                  Change Password
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
