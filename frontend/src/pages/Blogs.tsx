import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, Search, Calendar, User, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const blogStories = [
  {
    id: 1,
    image: "/images/farmer_success_rice.png",
    title: "How I Reduced Water Usage by 30% While Increasing Yield",
    category: "Sustainable Farming",
    author: "Ramesh Sharma",
    date: "March 28, 2026",
    excerpt: "Learn how the smart irrigation alerts from AgriPredict AI helped me manage my rice crop better during a dry season."
  },
  {
    id: 2,
    image: "/images/farmer_success_tomato.png",
    title: "Saving My Tomato Harvest from Early Blight with AI Detection",
    category: "Pest Management",
    author: "Anjali Gokhale",
    date: "April 2, 2026",
    excerpt: "After using the disease detection tool, I was able to identify early blight and save my entire crop using organic treatments."
  },
  {
    id: 3,
    image: "/images/farmer_success_wheat.png",
    title: "My Data-Driven Wheat Harvest Planning for Better Profits",
    category: "Yield Optimization",
    author: "Gurnam Singh",
    date: "April 3, 2026",
    excerpt: "By using the yield forecasting tool, I was able to plan my storage and selling strategy, leading to a 20% increase in profit."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
    title: "The Future of Organic Farming in India: A Community Story",
    category: "Organic Farming",
    author: "Suresh Meena",
    date: "March 15, 2026",
    excerpt: "Exploring how small-scale farmers are banding together to adopt organic practices and direct-to-consumer sales."
  },
    {
    id: 5,
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
    title: "Understanding Soil Health: My Journey with Precision Testing",
    category: "Soil Health",
    author: "Meera Reddy",
    date: "March 10, 2026",
    excerpt: "I never realized how much was missing from my soil until I used the nutrient-based yield prediction tool. The results were eye-opening."
  }
];

const Blogs = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      {/* Header */}
      <section className="bg-white border-b border-border py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(142,71%,45% / 0.03)_0%,_transparent_50%)]" />
        <div className="view-container relative z-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-widest mb-8 hover:gap-3 transition-all">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">Voices of the Soil</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Real stories from real farmers across India using AgriPredict AI to transform their lives and livelihoods.
          </p>
          
          {/* Search bar */}
          <div className="max-w-xl mx-auto mt-12 relative group">
            <input 
              type="text" 
              placeholder="Search stories, crops, or regions..." 
              className="w-full h-14 pl-14 pr-6 rounded-2xl bg-gray-50 border border-border focus:border-primary/50 focus:bg-white outline-none transition-all shadow-sm group-hover:shadow-md"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="view-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogStories.map((story, i) => (
              <div key={story.id} className="flex flex-col group animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl mb-6 shadow-sm border border-white">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-gray-900 border border-white/50 tracking-widest uppercase">{story.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none border-r border-border pr-4">
                    <Calendar className="h-3 w-3" /> {story.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest leading-none">
                    <User className="h-3 w-3" /> By {story.author}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors cursor-pointer">{story.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6">{story.excerpt}</p>
                <div className="mt-auto">
                  <button className="text-[11px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all underline decoration-primary/30 underline-offset-4 decoration-2">
                    Read Story <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-20 flex justify-center items-center gap-4">
            <button className="h-10 w-10 rounded-xl border border-border flex items-center justify-center text-gray-400 hover:bg-white hover:text-primary transition-all disabled:opacity-30" disabled>
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/20">1</span>
              <button className="h-10 w-10 rounded-xl border border-border flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-white transition-all">2</button>
              <button className="h-10 w-10 rounded-xl border border-border flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-white transition-all">3</button>
            </div>
            <button className="h-10 w-10 rounded-xl border border-border flex items-center justify-center text-gray-600 hover:bg-white hover:text-primary transition-all">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 border-t border-border bg-white">
        <div className="view-container">
          <div className="bg-primary rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/20 blur-[100px] rounded-full" />
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <Tag className="h-10 w-10 text-white/50 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight italic select-none">
                "Small seeds, big dreams, AI precision."
              </h2>
              <p className="text-green-50 mb-10 text-lg opacity-80">
                Get the latest success stories and farming tips delivered to your inbox every week.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-white/50 outline-none text-sm"
                />
                <button className="bg-white text-primary px-8 py-3 rounded-xl text-sm font-bold hover:bg-green-50 transition-colors shadow-lg">Subscribe Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;
