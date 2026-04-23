export interface Product {
  id: string;
  name: string;
  category: 'Seeds' | 'Fertilizer' | 'Pesticide';
  price: string;
  unit: string;
  rating: number;
  img: string;
  desc: string;
}

export const MARKET_PRODUCTS: Product[] = [
  // SEEDS
  { id: 's1', name: "Hybrid Wheat Seeds (HD-2967)", category: 'Seeds', price: "₹1,200", unit: "per 20kg", rating: 4.9, img: "🌾", desc: "High-yield, disease-resistant variety suitable for irrigated conditions." },
  { id: 's2', name: "Basmati Rice Seeds (Pusa-1121)", category: 'Seeds', price: "₹2,500", unit: "per 10kg", rating: 4.8, img: "🍚", desc: "Premium aromatic rice seeds with superior grain length." },
  { id: 's3', name: "Bt Cotton Seeds (Bollgard II)", category: 'Seeds', price: "₹850", unit: "per packet", rating: 4.7, img: "☁️", desc: "Genetically modified for resistance against bollworms." },
  { id: 's4', name: "Hybrid Maize Seeds (Pioneer)", category: 'Seeds', price: "₹1,100", unit: "per 5kg", rating: 4.6, img: "🌽", desc: "Excellent drought resistance and uniform ear quality." },
  
  // FERTILIZERS
  { id: 'f1', name: "Premium Urea Fertilizer", category: 'Fertilizer', price: "₹450", unit: "per 50kg bag", rating: 4.8, img: "🧪", desc: "Essential nitrogen source for leafy growth and vigor." },
  { id: 'f2', name: "DAP (Diammonium Phosphate)", category: 'Fertilizer', price: "₹1,350", unit: "per 50kg", rating: 4.9, img: "🧱", desc: "Concentrated phosphate fertilizer for root development." },
  { id: 'f3', name: "NPK 19:19:19 Water Soluble", category: 'Fertilizer', price: "₹380", unit: "per 25kg", rating: 4.6, img: "⚗️", desc: "Balanced nutrient complex for all growth stages." },
  { id: 'f4', name: "Organic Vermicompost", category: 'Fertilizer', price: "₹200", unit: "per 10kg", rating: 4.7, img: "🪱", desc: "Rich in micronutrients and beneficial soil microbes." },

  // PESTICIDES
  { id: 'p1', name: "Organic Pesticide (Neem Based)", category: 'Pesticide', price: "₹850", unit: "per 5L", rating: 4.7, img: "🌿", desc: "Broad-spectrum biological control for sucking pests." },
  { id: 'p2', name: "Broad-Spectrum Fungicide", category: 'Pesticide', price: "₹600", unit: "per 500g", rating: 4.5, img: "🍄", desc: "Effective against blight, rust, and powdery mildew." },
  { id: 'p3', name: "Systemic Insecticide", category: 'Pesticide', price: "₹450", unit: "per 250ml", rating: 4.4, img: "🦟", desc: "Provides long-lasting protection against aphids and thrips." },
  { id: 'p4', name: "Herbicidal Control (Roundup)", category: 'Pesticide', price: "₹720", unit: "per 1L", rating: 4.3, img: "🍂", desc: "Effective management for broadleaf and grass weeds." }
];
