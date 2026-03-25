import { Link, useNavigate } from 'react-router';
import { Search, CheckCircle, ArrowRight, UserPlus, Users, Zap, Clock, Target, Award, TrendingUp, Star, Briefcase, Sparkles, ChevronRight, Shield, MessageSquare, Filter } from 'lucide-react';
import logo from 'figma:asset/f07da7552ea0b98e853adc17584b77b2670f2927.png';
import { useState, useEffect } from 'react';
import { LoginModal } from './LoginModal';

export function LandingPage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem('expertly_authenticated');
    setIsAuthenticated(auth === 'true');
  }, []);

  const handleDiscoverClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/discover');
  };

  const stats = [
    { number: '500+', label: 'Vetted Specialists' },
    { number: '95%', label: 'Response Quality' },
    { number: '0', label: 'Spam Messages' },
    { number: '$50M+', label: 'Value Created' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Built on Mutual Respect',
      description: 'Requirement-first model protects everyone\'s time. No "just browsing" messages. No vague inquiries. Every connection starts with substance.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Zap,
      title: 'Network at Scale',
      description: 'Bookmark specialists. When you have a real challenge, share it with one or many experts at once. They self-select based on genuine fit.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Filter,
      title: 'Quality Over Volume',
      description: 'Unlike LinkedIn or Upwork, nobody gets spammed here. Every expert controls who reaches them. Every connection is intentional.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Award,
      title: 'Proven Track Records Only',
      description: '$10M+ revenue, 100K+ users, Series B+ exits. Everyone here has operated at scale. Network with peers who\'ve already won.',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const expertTypes = [
    { icon: TrendingUp, title: 'Growth & Marketing', count: '120+', image: 'https://images.unsplash.com/photo-1769636929266-8057f2c5ed52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjBidXNpbmVzcyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBzdHVkaW98ZW58MXx8fHwxNzY5ODY2NzQyfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { icon: Briefcase, title: 'Product & Strategy', count: '95+', image: 'https://images.unsplash.com/photo-1561515075-551b90143acb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzZnVsJTIwZW50cmVwcmVuZXVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5ODY2NzQzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { icon: Users, title: 'Tech & Engineering', count: '80+', image: 'https://images.unsplash.com/photo-1568658176307-bfbd2873abda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RhcnR1cCUyMGZvdW5kZXJzJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2OTg2Njc0NHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { icon: Sparkles, title: 'Sales & Revenue', count: '65+', image: 'https://images.unsplash.com/photo-1760543998147-117ae5649c5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVjdXRpdmUlMjB3b21hbiUyMGxlYWRlcnNoaXAlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njk4NjY3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  ];

  const testimonials = [
    {
      quote: "Finally, a platform where I'm not treated like a commodity. Connected with 3 specialists who actually understood our challenge.",
      author: "Sarah Chen",
      role: "Founder, TechFlow",
      avatar: 'https://images.unsplash.com/photo-1769636929266-8057f2c5ed52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjBidXNpbmVzcyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBzdHVkaW98ZW58MXx8fHwxNzY5ODY2NzQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      quote: "No tire-kickers. No 'can I pick your brain' messages. Just serious founders with real challenges. This is how expert networks should work.",
      author: "Michael Rodriguez",
      role: "Growth Advisor, 3x Exits",
      avatar: 'https://images.unsplash.com/photo-1561515075-551b90143acb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzZnVsJTIwZW50cmVwcmVuZXVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5ODY2NzQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      quote: "Built my entire advisory board through ExpertlyYours. Everyone here operates at scale. No amateurs, no noise.",
      author: "Emma Thompson",
      role: "CEO, CloudSync (Series B)",
      avatar: 'https://images.unsplash.com/photo-1760543998147-117ae5649c5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVjdXRpdmUlMjB3b21hbiUyMGxlYWRlcnNoaXAlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njk4NjY3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="min-h-screen bg-[#1B1B1B]">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1B1B1B] border-b border-gray-800 backdrop-blur-lg bg-opacity-95">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="ExpertlyYours" className="h-10" />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/discover" className="text-white hover:text-[#A8FF36] transition-colors font-medium">
                Discover Experts
              </Link>
              <Link to="/login" className="text-white hover:text-[#A8FF36] transition-colors font-medium">
                Log In
              </Link>
              <Link
                to="/profile/setup"
                className="px-6 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-full hover:bg-[#98EF26] transition-colors font-semibold"
              >
                Become an Expert
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#A8FF36] opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Differentiator Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#A8FF36] bg-opacity-10 border border-[#A8FF36] rounded-full">
                <Shield className="w-4 h-4 text-[#A8FF36]" />
                <span className="text-[#A8FF36] font-semibold text-sm">The Anti-Upwork: Expert-First Platform</span>
              </div>

              <h1 className="leading-tight">
                <span className="block text-2xl text-gray-300 mb-2">No clients. No freelancers.</span>
                <span className="block text-6xl font-bold text-[#A8FF36]">Expert talent for ambitious founders and builders.</span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                Connect with world-class specialists who've have seen it all and done it all. Browse by expertise, bookmark favorites, and share requirements in one shot.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/discover"
                  onClick={handleDiscoverClick}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#A8FF36] text-[#1B1B1B] rounded-full hover:bg-[#98EF26] transition-all font-bold text-lg shadow-2xl shadow-[#A8FF36]/20 hover:scale-105"
                >
                  <Search className="w-5 h-5" />
                  Discover Experts
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <p className="text-gray-500 text-sm pt-2">
                ✓ No credit card • ✓ Browse free • ✓ Pay only when you engage
              </p>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border-4 border-gray-800 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1758873268631-fa944fc5cad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwYnVzaW5lc3MlMjBwcm9mZXNzaW9uYWxzJTIwdGVhbXxlbnwxfHx8fDE3Njk4NjY3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Diverse business professionals"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1B] via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-8 -left-8 bg-[#1B1B1B] border-2 border-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[
                      'https://images.unsplash.com/photo-1769636929266-8057f2c5ed52?w=50&h=50&fit=crop',
                      'https://images.unsplash.com/photo-1561515075-551b90143acb?w=50&h=50&fit=crop',
                      'https://images.unsplash.com/photo-1760543998147-117ae5649c5c?w=50&h=50&fit=crop',
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-12 h-12 rounded-full border-2 border-[#1B1B1B] object-cover"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-sm text-gray-400">Vetted Specialists</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-[#252525] to-[#1B1B1B] border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-[#A8FF36] mb-2">{stat.number}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Why ExpertlyYours?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A curated network where experts network with experts—no clients, no freelancers, just mutual respect.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-gradient-to-br from-[#252525] to-[#1E1E1E] border border-gray-800 rounded-3xl p-8 hover:border-[#A8FF36] transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">One Community of Experts</h3>
              <p className="text-gray-400 leading-relaxed">We eliminate the buyer/seller dichotomy. Startup founders are experts at building. Specialists are experts at scaling. Network here as equals.</p>
            </div>

            <div className="group bg-gradient-to-br from-[#252525] to-[#1E1E1E] border border-gray-800 rounded-3xl p-8 hover:border-[#A8FF36] transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Filter className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Requirement-First Protects Everyone</h3>
              <p className="text-gray-400 leading-relaxed">No "just browsing." Every connection starts with a real requirement—budget, timeline, context. Mutual respect built into the model.</p>
            </div>

            <div className="group bg-gradient-to-br from-[#252525] to-[#1E1E1E] border border-gray-800 rounded-3xl p-8 hover:border-[#A8FF36] transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Proven Track Records Only</h3>
              <p className="text-gray-400 leading-relaxed">$10M+ revenue, 100K+ users, Series B+ exits. Everyone here has operated at scale. Network with peers who've already won.</p>
            </div>

            <div className="group bg-gradient-to-br from-[#252525] to-[#1E1E1E] border border-gray-800 rounded-3xl p-8 hover:border-[#A8FF36] transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">You Control Your Network</h3>
              <p className="text-gray-400 leading-relaxed">Bookmark specialists. Organize by project. Share requirements when ready. Experts respond only when they see genuine fit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Types Section */}
      <section className="py-24 bg-gradient-to-br from-[#252525] to-[#1B1B1B]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Browse by Expertise
            </h2>
            <p className="text-xl text-gray-400">
              Find specialists across every domain
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Link
                  key={index}
                  to="/discover"
                  className="group relative overflow-hidden rounded-2xl border border-gray-800 hover:border-[#A8FF36] transition-all duration-300"
                >
                  <div className="aspect-square relative">
                    <img
                      src={type.image}
                      alt={type.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1B] via-[#1B1B1B]/50 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#A8FF36] rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#1B1B1B]" />
                      </div>
                      <div className="text-2xl font-bold text-[#A8FF36]">{type.count}</div>
                    </div>
                    <h3 className="text-xl font-bold text-white">{type.title}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Experts Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border-4 border-gray-800 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjBidXNpbmVzcyUyMGV4ZWN1dGl2ZSUyMHBvcnRyYWl0fGVufDF8fHx8MTczODYyMDYzNHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Expert professional"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1B] via-transparent to-transparent"></div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -top-6 -right-6 bg-[#A8FF36] rounded-2xl p-6 shadow-2xl transform rotate-3">
                <div className="text-4xl font-bold text-[#1B1B1B]">0</div>
                <div className="text-sm font-semibold text-[#1B1B1B]">Spam Messages</div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#A8FF36] bg-opacity-10 border border-[#A8FF36] rounded-full">
                <Shield className="w-4 h-4 text-[#A8FF36]" />
                <span className="text-[#A8FF36] font-semibold text-sm">For Experts</span>
              </div>

              <h2 className="text-5xl font-bold text-white leading-tight">
                Tired of LinkedIn spam?
                <span className="block text-[#A8FF36]">Get respect here.</span>
              </h2>

              <p className="text-xl text-gray-300 leading-relaxed">
                Unlike Upwork, LinkedIn, or other platforms, ExpertlyYours <span className="text-white font-semibold">protects your time</span>. Every request comes with a detailed requirement—no more "Can I pick your brain?" messages.
              </p>

              {/* Why Experts Love It */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-gradient-to-br from-[#252525] to-[#1E1E1E] border border-gray-800 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-[#A8FF36] flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-[#1B1B1B]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">No Tire-Kickers</h4>
                    <p className="text-gray-400">You only see qualified requests with budget, timeline, and context. No browsing. No "just curious" messages.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-gradient-to-br from-[#252525] to-[#1E1E1E] border border-gray-800 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-[#A8FF36] flex items-center justify-center flex-shrink-0">
                    <Filter className="w-6 h-6 text-[#1B1B1B]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">You Control Access</h4>
                    <p className="text-gray-400">Review requirements and respond only when you see a great fit. No obligation. No spam. Your inbox stays clean.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-gradient-to-br from-[#252525] to-[#1E1E1E] border border-gray-800 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-[#A8FF36] flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-[#1B1B1B]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Get Paid What You're Worth</h4>
                    <p className="text-gray-400">Set your own rates. Advisory, equity, retainer, consulting—you choose. Serious clients only.</p>
                  </div>
                </div>
              </div>

              <Link
                to="/profile/setup"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#A8FF36] text-[#1B1B1B] rounded-full hover:bg-[#98EF26] transition-all font-bold text-lg shadow-2xl shadow-[#A8FF36]/20"
              >
                <Briefcase className="w-5 h-5" />
                Become an Expert
                <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="text-gray-500 text-sm">
                ✓ Free to join • ✓ No commitment • ✓ Respond only when interested
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-[#252525] to-[#1B1B1B]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Network with world-class specialists in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Browse & Bookmark',
                description: 'Explore curated profiles of proven specialists. Organize experts into collections by project, domain, or challenge. No commitment required.',
                icon: Search,
              },
              {
                step: '02',
                title: 'Share Your Challenge',
                description: 'When you\'re ready, send your requirement to one expert or many. Include context, budget, timeline. Broadcast to the entire collection at once.',
                icon: Zap,
              },
              {
                step: '03',
                title: 'Connect & Collaborate',
                description: 'Specialists review and respond when they see genuine fit. Schedule calls, agree on terms, solve problems together. No spam, just quality.',
                icon: CheckCircle,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-[#252525] to-[#1E1E1E] border border-gray-800 rounded-3xl p-8">
                    <div className="text-6xl font-bold text-[#A8FF36] opacity-20 mb-4">{step.step}</div>
                    <div className="w-14 h-14 bg-[#A8FF36] rounded-2xl flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-[#1B1B1B]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ChevronRight className="w-8 h-8 text-[#A8FF36]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              What the Network Says
            </h2>
            <p className="text-xl text-gray-400">
              Hear from experts across domains
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#1B1B1B] border border-gray-800 rounded-3xl p-8 hover:border-[#A8FF36] transition-all"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#A8FF36] fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                  />
                  <div>
                    <div className="font-bold text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#252525] to-[#1B1B1B]">
        <div className="max-w-5xl mx-auto px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#A8FF36] to-[#98EF26] rounded-3xl p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1B1B1B] opacity-10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-[#1B1B1B] mb-6">
                Ready to Join the Network?
              </h2>
              <p className="text-xl text-[#1B1B1B] text-opacity-80 mb-10 max-w-2xl mx-auto">
                Whether you're building a startup or scaling one, connect with 500+ proven specialists who respect your time and understand your challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/discover"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1B1B1B] text-white rounded-full hover:bg-[#2D2D2D] transition-all font-bold text-lg"
                >
                  <Search className="w-5 h-5" />
                  Explore the Network
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/profile/setup"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1B1B1B] rounded-full hover:bg-gray-100 transition-all font-bold text-lg"
                >
                  <UserPlus className="w-5 h-5" />
                  Join as an Expert
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B1B1B] border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="ExpertlyYours" className="h-10" />
            </Link>
            
            <div className="flex flex-wrap items-center gap-8 text-sm text-gray-400">
              <Link to="/discover" className="hover:text-[#A8FF36] transition-colors">Discover Experts</Link>
              <Link to="/profile/setup" className="hover:text-[#A8FF36] transition-colors">Become an Expert</Link>
              <Link to="/login" className="hover:text-[#A8FF36] transition-colors">Log In</Link>
              <Link to="/admin" className="hover:text-[#A8FF36] transition-colors">Admin</Link>
            </div>
            
            <div className="text-sm text-gray-500">
              © 2026 ExpertlyYours. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}