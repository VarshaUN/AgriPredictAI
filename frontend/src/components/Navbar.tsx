import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Bell, Menu, X, ChevronDown, LogOut, LayoutDashboard, BarChart3, AlertTriangle, CheckCircle2, Info, Clock, User as UserIcon } from 'lucide-react';

const LeafIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/predict', label: 'Predict Yield' },
  { to: '/disease', label: 'Disease Detection' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/blogs', label: 'Farmer Success Stories' },
];

const Navbar = ({ transparent = false }: { transparent?: boolean }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Irrigation Due',
      description: 'Rice field needs water in 2 days',
      time: '2h ago',
      type: 'warning',
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-100'
    },
    {
      id: 2,
      title: 'Sowing Window',
      description: 'Optimal period for Rabi crop started',
      time: '5h ago',
      type: 'info',
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-100'
    },
    {
      id: 3,
      title: 'Detection Success',
      description: 'Your leaf scan completed successfully',
      time: '1d ago',
      type: 'success',
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-100'
    }
  ];

  useEffect(() => {
    if (!transparent) return;
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [transparent]);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  const isTransparent = transparent && !scrolled && !mobileOpen;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className={`fixed top-4 left-4 right-4 md:left-6 md:right-6 z-50 h-16 transition-all duration-300 rounded-full border shadow-lg ${isTransparent ? 'bg-transparent border-transparent shadow-none' : 'bg-white/80 backdrop-blur-xl border-white/20 shadow-md'}`}>
        <div className="container mx-auto px-6 flex h-full items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
              <LeafIcon className={`h-5 w-5 text-primary`} />
            </div>
            <span className={`text-lg font-bold tracking-tighter ${isTransparent ? 'text-gray-900' : 'text-foreground'}`}>AgriPredict <span className="text-primary">AI</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.filter(l => {
              if (l.label === 'Home') return false;
              if (!isAuthenticated && l.label !== 'Farmer Success Stories') return false;
              return true;
            }).map(link => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 text-sm font-medium transition-colors relative ${active ? 'text-primary' : 'text-gray-600 hover:text-green-600'}`}
                >
                  {link.label}
                  {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setDropdownOpen(false);
                    }}
                    className="relative p-2 rounded-full hover:bg-accent transition-colors"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                  </button>

                  {notificationsOpen && (
                    <>
                      <div className="fixed inset-0" onClick={() => setNotificationsOpen(false)} />
                      <div className="absolute right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 mt-2 w-80 rounded-card bg-card shadow-card-hover border border-border py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                          <h3 className="text-sm font-bold text-foreground">Notifications</h3>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">3 New</span>
                        </div>
                        <div className="max-h-[320px] overflow-y-auto">
                          {notifications.map((n) => (
                            <div key={n.id} className="px-4 py-3 hover:bg-accent transition-colors cursor-pointer border-b border-border last:border-0 group">
                              <div className="flex gap-3">
                                <div className={`h-8 w-8 rounded-lg ${n.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                  <n.icon className={`h-4 w-4 ${n.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <p className="text-xs font-bold text-gray-900 truncate">{n.title}</p>
                                    <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap flex items-center gap-0.5">
                                      <Clock className="h-2.5 w-2.5" /> {n.time}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{n.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-2 text-center border-t border-border mt-1">
                          <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-green-700 transition-colors">Mark all as read</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-full"
                  >
                    <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                      {initials}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                  </button>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 top-12 w-56 rounded-card bg-card shadow-card-hover border border-border py-2 z-50">
                        <div className="px-4 py-2">
                          <p className="text-sm font-semibold text-foreground">Hello, {user?.name?.split(' ')[0]}</p>
                        </div>
                        <div className="border-t border-border my-1" />
                        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-accent transition-colors">
                          <LayoutDashboard className="h-4 w-4" /> My Dashboard
                        </Link>
                        <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-accent transition-colors">
                          <UserIcon className="h-4 w-4" /> My Profile
                        </Link>
                        <Link to="/predict" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-accent transition-colors">
                          <BarChart3 className="h-4 w-4" /> Predict Yield
                        </Link>
                        <div className="border-t border-border my-1" />
                        <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-red-50 transition-colors">
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <button className="md:hidden p-2" onClick={() => setMobileOpen(true)}>
                  <Menu className="h-6 w-6 text-gray-600" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Sign In</Link>
                <Link to="/register" className="rounded-button bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/40 transition-all duration-300">
                  Get Started →
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-card">
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.location}, {user?.state}</p>
              </div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="p-2">
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <nav className="p-6 flex flex-col gap-1">
            {navLinks.filter(l => {
              if (l.label === 'Home') return false;
              if (!isAuthenticated && l.label !== 'Farmer Success Stories') return false;
              return true;
            }).map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center h-[52px] px-4 rounded-button text-base font-medium transition-colors ${location.pathname === link.to ? 'bg-accent text-primary' : 'text-gray-600 hover:bg-accent'}`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <div className="border-t border-border my-3" />
                <button onClick={handleLogout} className="flex items-center h-[52px] px-4 rounded-button text-base font-medium text-destructive hover:bg-red-50 transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-border my-3" />
                <Link to="/login" className="flex items-center h-[52px] px-4 rounded-button text-base font-medium text-gray-600 hover:bg-accent transition-colors">Sign In</Link>
                <Link to="/register" className="flex items-center h-[52px] px-4 rounded-button text-base font-medium text-primary hover:bg-accent transition-colors">Get Started</Link>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
