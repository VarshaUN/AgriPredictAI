import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, BarChart3, Leaf, Sparkles, Bell, Play } from 'lucide-react';

const FarmIllustration = () => (
  <div className="relative w-full h-full min-h-[400px] flex items-center justify-center p-4">
    <div className="relative group overflow-hidden rounded-2xl shadow-2xl border border-border bg-card max-w-md w-full aspect-[4/3.5]">
      <img
        src="/images/smart-farming-hero.png"
        alt="Smart Farming Intelligence"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
    </div>
    
    {/* Floating leaves for extra depth */}
    <div className="absolute top-8 right-12 animate-float z-10">
      <Leaf className="h-6 w-6 text-green-400 opacity-60" />
    </div>
    <div className="absolute top-24 left-8 animate-float z-10" style={{ animationDelay: '1s' }}>
      <Leaf className="h-4 w-4 text-green-500 opacity-40" />
    </div>
    <div className="absolute bottom-32 right-4 animate-float z-10" style={{ animationDelay: '2s' }}>
      <Leaf className="h-5 w-5 text-green-400 opacity-50" />
    </div>
  </div>
);

const features = [
  { icon: BarChart3, title: "Yield Forecasting", body: "Enter location, crop, soil data → get yield in kg/acre and profit in ₹ based on live MSP rates.", link: "/predict" },
  { icon: Leaf, title: "Instant Disease Detection", body: "Upload a leaf photo. CNN model identifies disease in under 2 seconds + suggests organic & chemical treatments.", link: "/disease" },
  { icon: Sparkles, title: "Smart Crop Advisor", body: "Get personalized crop and fertilizer suggestions based on your soil type, season, and local weather data.", link: "/predict" },
  { icon: Bell, title: "Automated SMS Alerts", body: "Get alerts for irrigation schedules, sowing windows, pest risks — directly to your phone via SMS.", link: "/dashboard" },
];

const steps = [
  { num: "01", title: "Create Your Account", body: "Register with your phone number and tell us your state and district." },
  { num: "02", title: "Enter Farm Details", body: "Select your crop, soil type, and area. Or upload a leaf photo for disease check." },
  { num: "03", title: "Get AI Predictions", body: "Receive yield forecasts, disease diagnosis, and actionable recommendations in seconds." },
];

const crops = ["Rice", "Wheat", "Sugarcane", "Cotton", "Tomato", "Potato", "Maize", "Pulses"];

const testimonials = [
  { quote: "I used to lose 30% of my rice crop every season to blast disease. AgriPredict detected it before I could even see it.", name: "Ravi Kumar", location: "Mandya, Karnataka" },
  { quote: "The yield prediction was within 200kg of my actual harvest. I planned my selling price in advance for the first time.", name: "Sunita Patil", location: "Solapur, Maharashtra" },
  { quote: "SMS alerts told me to irrigate 2 days before my soil dried out. Simple but it saved my crop.", name: "Mohan Das", location: "Warangal, Telangana" },
];

const blogStories = [
  {
    image: "/images/farmer_success_rice.png",
    title: "How I Reduced Water Usage by 30% While Increasing Yield",
    category: "Sustainable Farming",
    author: "Ramesh Sharma",
    date: "March 28, 2026",
    excerpt: "Learn how the smart irrigation alerts from AgriPredict AI helped me manage my rice crop better during a dry season."
  },
  {
    image: "/images/farmer_success_tomato.png",
    title: "Saving My Tomato Harvest from Early Blight with AI Detection",
    category: "Pest Management",
    author: "Anjali Gokhale",
    date: "April 2, 2026",
    excerpt: "After using the disease detection tool, I was able to identify early blight and save my entire crop using organic treatments."
  },
  {
    image: "/images/farmer_success_wheat.png",
    title: "My Data-Driven Wheat Harvest Planning for Better Profits",
    category: "Yield Optimization",
    author: "Gurnam Singh",
    date: "April 3, 2026",
    excerpt: "By using the yield forecasting tool, I was able to plan my storage and selling strategy, leading to a 20% increase in profit."
  }
];

const Landing = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen">
      <Navbar transparent />
      
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center -mt-16 pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(142,71%,45% / 0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_hsl(142,71%,45% / 0.05)_0%,_transparent_40%)]" />
        <div className="view-container relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/50 border border-green-200/50 text-xs font-semibold text-primary mb-6">
                <Sparkles className="h-3 w-3" /> Built for Indian Farmers
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 lg:mb-8 tracking-tighter">
                Grow More.<br />
                <span className="text-primary bg-clip-text">Lose Less.</span><br />
                Know Before You Sow.
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-[520px] mx-auto lg:mx-0 mb-10 leading-relaxed">
                AgriPredict AI uses high-precision machine learning to give you yield forecasts, instant disease detection, and profit estimates — before you spend a rupee.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center lg:justify-start mb-12">
                <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn-primary w-full sm:w-auto text-lg px-8 py-4">
                  {isAuthenticated ? "Go to Dashboard" : "Start For Free"} <ArrowRight className="h-5 w-5" />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full border border-border bg-white px-8 py-4 text-lg font-medium text-gray-600 hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                  <Play className="h-5 w-5" /> Watch Demo
                </button>
              </div>
            </div>
            <div className="w-full animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="relative">
                <div className="absolute -inset-4 bg-green-500/10 blur-3xl rounded-full opacity-50 animate-pulse" />
                <FarmIllustration />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="py-12 border-y border-border bg-white">
        <div className="view-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[["8+", "Crops"], ["90%+", "Accuracy"], ["2 sec", "Detection"], ["15–25%", "More Yield"]].map(([value, label], i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">{value}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="view-container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">Everything a Smart Farmer Needs</h2>
            <p className="text-lg text-gray-600">Powerful AI tools integrated into a single, easy-to-use platform designed specifically for the Indian agricultural landscape.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 lg:gap-12">
            {features.map((f, i) => (
              <div key={i} className="card-premium group p-8 lg:p-10 flex flex-col items-start translate-y-0 opacity-100">
                <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <f.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">{f.body}</p>
                <Link to={f.link} className="mt-auto inline-flex items-center gap-2 font-semibold text-primary group-hover:gap-3 transition-all">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-green-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">Up and Running in 3 Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto relative">
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-green-300" />
            {steps.map((s, i) => (
              <div key={i} className="text-center relative animate-fade-in-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-primary font-bold mb-4 bg-card relative z-10 transition-transform hover:scale-110">
                  {s.num}
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Blog */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="view-container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Farmer Success Stories</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Voices of the Soil</h2>
            </div>
            <Link to="/blogs" className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest border border-border px-6 py-2.5 rounded-full hover:bg-gray-50 transition-all hover:border-primary/50 group">
              View All Stories <ArrowRight className="inline-block ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogStories.map((story, i) => (
              <div key={i} className="flex flex-col group animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl mb-6 shadow-md border border-white">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 border border-white/50">{story.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none border-r border-border pr-4">{story.date}</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">By {story.author}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors cursor-pointer">{story.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6">{story.excerpt}</p>
                <div className="mt-auto">
                  <button className="text-[11px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all underline decoration-primary/30 underline-offset-4 decoration-2">Read Story <ArrowRight className="h-3 w-3" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crops Marquee */}
      <section className="py-16 bg-card overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-8">Supported Crops</h2>
        <div className="relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...crops, ...crops].map((crop, i) => (
              <span key={i} className="inline-flex items-center mx-3 rounded-pill border border-green-200 bg-card px-5 py-2.5 text-sm font-medium text-green-700">
                {crop}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Farmers Are Seeing Results</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-card bg-card p-6 shadow-card animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex gap-0.5 mb-3">
                  {Array(5).fill(0).map((_, j) => <span key={j} className="text-green-400">★</span>)}
                </div>
                <p className="text-sm text-gray-600 mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Ready to Farm Smarter?</h2>
          <p className="text-green-100 mb-8 max-w-lg mx-auto">Join thousands of farmers already using AgriPredict AI. Free to start. No app download needed.</p>
          <Link to="/register" className="inline-flex items-center gap-2 rounded-button bg-card px-8 py-3.5 text-base font-semibold text-green-700 hover:bg-green-50 transition-colors">
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
