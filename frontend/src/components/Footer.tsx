import { Link } from 'react-router-dom';

const LeafIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const Footer = () => (
  <footer className="bg-gray-900 pt-16 pb-8">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <LeafIcon className="h-6 w-6 text-green-400" />
            <span className="text-lg font-bold text-primary-foreground">AgriPredict AI</span>
          </div>
          <p className="text-sm text-gray-400">Built for Indian Farmers</p>
          <p className="text-sm text-gray-500 mt-1">Smart Farming Starts Here</p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">Product</h4>
          <nav className="flex flex-col gap-2">
            <Link to="/predict" className="text-sm text-gray-300 hover:text-primary-foreground transition-colors">Yield Prediction</Link>
            <Link to="/disease" className="text-sm text-gray-300 hover:text-primary-foreground transition-colors">Disease Detection</Link>
            <Link to="/dashboard" className="text-sm text-gray-300 hover:text-primary-foreground transition-colors">Dashboard</Link>
            <a href="#how-it-works" className="text-sm text-gray-300 hover:text-primary-foreground transition-colors">How It Works</a>
          </nav>
        </div>

        {/* Team */}
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">Team</h4>
          <p className="text-sm text-gray-300 font-medium">GreenShift — HACKOLYMPIC 2025</p>
          <p className="text-sm text-gray-400 mt-2">Jhanvi, Varsha, Shreyas, Harsha</p>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-xs text-gray-500">© 2025 AgriPredict AI</p>
        <p className="text-xs text-gray-500">Powered by LSTM · CNN · FastAPI · React</p>
      </div>
    </div>
  </footer>
);

export default Footer;
