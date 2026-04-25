import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MARKET_PRODUCTS, type Product } from '../constants/marketData';

interface MarketSuggestionsProps {
  categories: ('Seeds' | 'Fertilizer' | 'Pesticide')[];
  title?: string;
}

export const MarketSuggestions: React.FC<MarketSuggestionsProps> = ({ categories, title = "Recommended for your Plot" }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getNextProducts = () => {
      let result: Product[] = [];
      
      categories.forEach(cat => {
        // Filter products by category
        const catProducts = MARKET_PRODUCTS.filter(p => p.category === cat);
        
        // Get last used index from session storage to ensure rotation
        const storageKey = `market_rotation_${cat}`;
        const lastIndex = parseInt(sessionStorage.getItem(storageKey) || '-1');
        
        // Rotate to next index
        const nextIndex = (lastIndex + 1) % catProducts.length;
        sessionStorage.setItem(storageKey, nextIndex.toString());
        
        // Pick one product from this category
        result.push(catProducts[nextIndex]);
      });

      setSelectedProducts(result);
    };

    getNextProducts();
  }, [categories.join(',')]); // Refresh if categories change

  if (selectedProducts.length === 0) return null;

  return (
    <div className="mt-12 animate-[fadeInUp_0.6s_ease-out]">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">{title}</h3>
        <div className="h-[1px] bg-slate-100 w-full"></div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {selectedProducts.map((product) => (
          <div 
            key={product.id} 
            className="group bg-white border border-slate-100 rounded-[28px] p-5 hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 cursor-pointer flex flex-col"
            onClick={() => navigate('/market')}
          >
            <div className="h-40 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
              {product.img}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <svg className="w-3 h-3 text-orange-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {product.rating}
                </div>
              </div>

              <h4 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{product.name}</h4>
              <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-4">{product.desc}</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
               <div>
                  <span className="text-lg font-black text-slate-900">{product.price}</span>
                  <span className="text-[10px] text-slate-400 font-medium ml-1">{product.unit}</span>
               </div>
               <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
               </div>
            </div>
          </div>
        ))}
        
        {/* Placeholder for visual balance if only 1-2 products */}
        <div 
          className="hidden lg:flex border-2 border-dashed border-slate-100 rounded-[28px] items-center justify-center p-8 text-center"
          onClick={() => navigate('/market')}
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Explore Market</p>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Discover 500+ premium agricultural inputs</p>
          </div>
        </div>
      </div>
    </div>
  );
};
