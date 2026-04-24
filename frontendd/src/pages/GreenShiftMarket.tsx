import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const products = [
  { id: 1, name: "Premium Urea Fertilizer", category: "Fertilizer", price: "₹450", unit: "per 50kg bag", rating: 4.8, img: "🧪" },
  { id: 2, name: "Hybrid Wheat Seeds (HD-2967)", category: "Seeds", price: "₹1,200", unit: "per 20kg", rating: 4.9, img: "🌾" },
  { id: 3, name: "Organic Pesticide (Neem Based)", category: "Pesticide", price: "₹850", unit: "per 5L", rating: 4.7, img: "🌿" },
  { id: 4, name: "NPK 19:19:19 Water Soluble", category: "Fertilizer", price: "₹380", unit: "per 25kg", rating: 4.6, img: "⚗️" },
];

const harvestListings = [
  { id: 1, crop: "Basmati Rice", quantity: "200 Quintals", location: "Punjab", currentBid: "₹4,200", status: "High Demand" },
  { id: 2, crop: "Organic Cotton", quantity: "50 Quintals", location: "Gujarat", currentBid: "₹6,800", status: "Stable" },
  { id: 3, crop: "Sugarcane", quantity: "500 Tons", location: "Maharashtra", currentBid: "₹3,150", status: "Price Rising" },
];

export const GreenShiftMarket = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'input' | 'harvest'>('input');

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="group">
              <svg className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="font-black text-slate-950 uppercase tracking-tighter text-xl">GreenShift <span className="text-emerald-600">Market</span></span>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setTab('input')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${tab === 'input' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t('market.procure_inputs')}
              </button>
              <button 
                onClick={() => setTab('harvest')}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${tab === 'harvest' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t('market.sell_harvest')}
              </button>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-950 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-600 text-white text-[8px] font-black flex items-center justify-center rounded-full">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="bg-slate-950 text-white py-16 px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:32px_32px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter mb-4 uppercase">
              {tab === 'input' ? t('market.hero_input') : t('market.hero_harvest')}
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
              {tab === 'input' 
                ? t('market.input_desc')
                : t('market.harvest_desc')}
            </p>
            
            <div className="flex bg-white/10 p-2 rounded-2xl border border-white/10 backdrop-blur-md max-w-md">
              <input 
                type="text" 
                placeholder={tab === 'input' ? "Search fertilizers, seeds..." : "Filter by crop or region..."}
                className="bg-transparent border-none outline-none flex-1 px-4 text-sm font-medium text-white placeholder:text-slate-500"
              />
              <button className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Search</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {tab === 'input' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-slate-200 rounded-[24px] p-6 hover:shadow-2xl transition-all duration-500 group flex flex-col">
                <div className="w-full h-48 bg-slate-50 rounded-2xl mb-6 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                  {/* Image placeholder based on index for simplicity, in real app would use generate_image */}
                  <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">{product.category}</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <svg className="w-3 h-3 text-orange-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      {product.rating}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-950 mb-4">{product.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-black text-slate-900">{product.price}</span>
                    <span className="text-xs text-slate-400 font-medium">{product.unit}</span>
                  </div>
                </div>
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Add to Selection</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Biological Assets</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Available Qty</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Bid (₹/Q)</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Origin</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Protocol Status</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {harvestListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-900">{listing.crop}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-medium text-slate-600">{listing.quantity}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-lg font-black text-slate-900">{listing.currentBid}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-medium text-slate-500">{listing.location}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${listing.status === 'High Demand' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Submit Bid</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="py-12 bg-white border-t border-slate-100 text-center px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">GreenShift Global Commodities Disclosure</p>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl mx-auto">
            All input certificates and harvest quality indices are verified by the AgriPredict AI auditing engine. 
            Direct farmer-to-buyer logistics are managed by our verified third-party partners.
          </p>
        </div>
      </footer>
    </div>
  );
};
