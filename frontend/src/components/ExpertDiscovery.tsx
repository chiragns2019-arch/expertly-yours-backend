import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Bookmark, ChevronDown, MapPin, DollarSign, Briefcase, ArrowRight, Filter, Users, TrendingUp, Award, Zap, Star, X, ChevronUp, ChevronLeft, ChevronRight, Linkedin, Globe, Calendar, MessageSquare, Send } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { BookmarkTagDialog } from './BookmarkTagDialog';
import { toast } from 'sonner';
import { PostLoginNav } from './PostLoginNav';
import { ENGAGEMENT_TYPES } from '../constants/engagementTypes';
import { motion, AnimatePresence } from 'motion/react';
import { expertSocialLinks } from '../data/expertsData';
import { api } from '../services/api';

export function ExpertDiscovery() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEngagement, setSelectedEngagement] = useState('all');
  const [bookmarked, setBookmarked] = useState<{[expertId: string]: string[]}>({ '2': ['Product & Strategy'] }); // expertId -> array of tags
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
  const [expertToBookmark, setExpertToBookmark] = useState<{id: string | number, name: string} | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const expertsPerPage = 10; // Show 10 experts per page for better pagination UX
  const [selectedExperts, setSelectedExperts] = useState<(string | number)[]>([]); // For multi-select
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null); // For image popup
  
  const [experts, setExperts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get all unique tags from bookmarks
  const allTags = Array.from(new Set(Object.values(bookmarked).flat()));

  const toggleBookmark = (expert: {id: string | number, name: string}) => {
    const isBookmarked = bookmarked[expert.id] && bookmarked[expert.id].length > 0;
    
    if (isBookmarked) {
      // Remove all bookmarks for this expert
      const newBookmarked = { ...bookmarked };
      delete newBookmarked[expert.id];
      setBookmarked(newBookmarked);
      toast.success(`Removed ${expert.name} from all collections`);
    } else {
      // Show tag selection dialog
      setExpertToBookmark(expert);
      setBookmarkDialogOpen(true);
    }
  };

  const handleSelectTag = (tagName: string) => {
    if (expertToBookmark) {
      const expertId = expertToBookmark.id;
      const currentTags = bookmarked[expertId] || [];
      
      if (!currentTags.includes(tagName)) {
        setBookmarked({
          ...bookmarked,
          [expertId]: [...currentTags, tagName]
        });
        toast.success(`Added to "${tagName}"`);
      } else {
        toast.info(`Already in "${tagName}"`);
      }
      
      setExpertToBookmark(null);
    }
  };

  const isExpertBookmarked = (expertId: string | number) => {
    return bookmarked[expertId] && bookmarked[expertId].length > 0;
  };

  const getBookmarkCount = () => {
    return Object.keys(bookmarked).length;
  };

  const toggleExpertSelection = (expertId: string | number) => {
    if (selectedExperts.includes(expertId)) {
      setSelectedExperts(selectedExperts.filter(id => id !== expertId));
    } else {
      setSelectedExperts([...selectedExperts, expertId]);
    }
  };

  const sendToSelected = () => {
    const selectedExpertData = currentExperts.filter(expert => selectedExperts.includes(expert.id));
    navigate('/requirement/bulk', { state: { selectedExperts: selectedExpertData } });
  };

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setIsLoading(true);
        const data = await api.get('/experts/discover');
        
        const getCategory = (expertise: string) => {
          const exp = expertise?.toLowerCase() || '';
          if (exp.includes('growth') || exp.includes('marketing') || exp.includes('seo')) return 'growth';
          if (exp.includes('product') || exp.includes('strategy')) return 'product';
          if (exp.includes('tech') || exp.includes('engineering') || exp.includes('devops') || exp.includes('cloud')) return 'tech';
          if (exp.includes('sales') || exp.includes('revenue')) return 'sales';
          return 'growth'; // Default case
        };

        const mappedExperts = data.map((exp: any) => ({
          id: exp.id,
          name: exp.user?.name || 'Unknown',
          profilePicture: exp.user?.avatar || 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTc5MDA3OXww&ixlib=rb-4.1.0&q=80&w=1080',
          expertise: exp.expertise || 'Expertise Not Specified',
          category: getCategory(exp.expertise + ' ' + exp.title),
          currentEngagement: exp.title || 'Expert',
          pastEngagements: [],
          experience: '10+ years',
          scaleIndicators: [],
          engagementTypes: ['Paid consulting', 'Advisory'],
          usefulnessScore: exp.usefulnessScore || 90,
          engagementCount: 0,
          isPublished: exp.status === 'active',
          pricing: exp.hourlyRate ? `$${exp.hourlyRate}/hour` : 'Negotiable',
          highlight: '',
          bio: exp.bio || 'Specialized expert ready to help you solve your most critical challenges.'
        }));
        setExperts(mappedExperts);
      } catch (error) {
        toast.error('Failed to load experts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperts();
  }, []);

  // Calculate real category counts from experts data
  const growthCount = experts.filter(e => e.category === 'growth').length;
  const productCount = experts.filter(e => e.category === 'product').length;
  const techCount = experts.filter(e => e.category === 'tech').length;
  const salesCount = experts.filter(e => e.category === 'sales').length;
  const totalCount = experts.length;

  const categories = [
    { id: 'all', name: 'Container', count: totalCount, icon: Users, color: 'bg-gradient-to-br from-blue-200 to-blue-300' },
    { id: 'growth', name: 'Growth & Marketing', count: growthCount, icon: TrendingUp, color: 'bg-gradient-to-br from-purple-200 to-purple-300' },
    { id: 'product', name: 'Product & Strategy', count: productCount, icon: Zap, color: 'bg-gradient-to-br from-green-200 to-green-300' },
    { id: 'tech', name: 'Tech & Engineering', count: techCount, icon: Award, color: 'bg-gradient-to-br from-orange-200 to-orange-300' },
    { id: 'sales', name: 'Sales & Revenue', count: salesCount, icon: DollarSign, color: 'bg-gradient-to-br from-pink-200 to-pink-300' },
  ];

  const filteredExperts = experts.filter(expert => {
    const matchesCategory = selectedCategory === 'all' || expert.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      expert.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEngagement = selectedEngagement === 'all' || 
      expert.engagementTypes.some(type => type.toLowerCase().includes(selectedEngagement.toLowerCase()));
    
    return matchesCategory && matchesSearch && matchesEngagement;
  });

  const totalPages = Math.ceil(filteredExperts.length / expertsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const indexOfLastExpert = currentPage * expertsPerPage;
  const indexOfFirstExpert = indexOfLastExpert - expertsPerPage;
  const currentExperts = filteredExperts.slice(indexOfFirstExpert, indexOfLastExpert);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Navigation */}
      <PostLoginNav />

      {/* Floating Action Button for Selected Experts */}
      {selectedExperts.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={sendToSelected}
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl border-4 border-white"
          >
            <Send className="w-5 h-5" />
            Share Requirement with {selectedExperts.length} {selectedExperts.length === 1 ? 'Expert' : 'Experts'}
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-10 pt-24">
        {/* Hero Section - Simplified */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1B1B1B] mb-3">
              Find the Perfect Expert
            </h1>
            <p className="text-base text-gray-600">
              Choose an expert, Book a session, Or send them your requirement
            </p>
          </div>
          <button
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="text-[#2563eb] hover:underline font-medium flex items-center gap-1 mt-2"
          >
            How it works?
            {showHowItWorks ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Expandable How It Works Section */}
        <AnimatePresence>
          {showHowItWorks && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-lg mb-4">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1B1B1B] mb-2">
                    How ExpertlyYours Works
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Our unique requirement-first process protects experts from tire-kickers and ensures quality engagements
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  {/* Step 1 */}
                  <div className="bg-white rounded-xl p-6 border-2 border-blue-100 relative">
                    <div className="absolute -top-4 left-6">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        1
                      </div>
                    </div>
                    <h4 className="font-bold text-[#1B1B1B] mt-2 mb-2 text-lg">
                      Browse & Bookmark
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Explore expert profiles and bookmark the ones that match your needs. Save as many as you want.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white rounded-xl p-6 border-2 border-blue-100 relative">
                    <div className="absolute -top-4 left-6">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        2
                      </div>
                    </div>
                    <h4 className="font-bold text-[#1B1B1B] mt-2 mb-2 text-lg">
                      Share Requirements
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Submit your detailed requirements to all bookmarked experts at once. No need to repeat yourself.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white rounded-xl p-6 border-2 border-blue-100 relative">
                    <div className="absolute -top-4 left-6">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        3
                      </div>
                    </div>
                    <h4 className="font-bold text-[#1B1B1B] mt-2 mb-2 text-lg">
                      Experts Respond
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Experts review your opportunity and respond only if they see a good fit. Quality over quantity.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <Link 
                    to="/bookmarks" 
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg hover:shadow-xl text-lg"
                  >
                    View Your Bookmarks
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search Experts"
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all text-[#1B1B1B] bg-white"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-3 min-w-max">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              // Special styling for "Container" (All Experts)
              const isContainer = category.id === 'all';
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all flex-shrink-0 ${
                    isSelected
                      ? 'border-gray-400 bg-gray-100'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 text-gray-700" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{category.count}</span>
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Hires Filter */}
          <button
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 transition-all flex-shrink-0 sticky right-0 bg-white shadow-sm"
          >
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter</span>
          </button>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1B1B1B]">
            {filteredExperts.length} Expert{filteredExperts.length !== 1 ? 's' : ''} Found
            {selectedCategory !== 'all' && (
              <span className="text-gray-500 font-normal ml-2">
                in {categories.find(c => c.id === selectedCategory)?.name}
              </span>
            )}
          </h2>
        </div>

        {/* Expert Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A8FF36]"></div>
          </div>
        ) : (
        <div className="space-y-6 mb-12">
          {currentExperts.length === 0 && (
            <div className="text-center py-12 text-gray-500">No experts found matching your criteria.</div>
          )}
          {currentExperts.map((expert) => (
            <div
              key={expert.id}
              className={`group bg-white border-2 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 ${
                selectedExperts.includes(expert.id) 
                  ? 'border-blue-400 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-[#A8FF36]'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Checkbox for selection */}
                  <input
                    type="checkbox"
                    checked={selectedExperts.includes(expert.id)}
                    onChange={() => toggleExpertSelection(expert.id)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <img
                        src={expert.profilePicture}
                        alt={expert.name}
                        className="w-40 h-40 rounded-2xl object-cover border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setEnlargedImage(expert.profilePicture)}
                        title="Click to enlarge"
                      />
                      {expert.usefulnessScore >= 90 && (
                        <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#A8FF36] rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                          <Star className="w-4 h-4 text-[#1B1B1B] fill-current" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/profile/${expert.id}`)}
                      className="w-40 px-4 py-3 bg-gradient-to-br from-orange-200 to-orange-300 text-gray-800 rounded-xl hover:from-orange-300 hover:to-orange-400 transition-colors font-semibold"
                    >
                      View Profile
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-[#1B1B1B]">{expert.name}</h3>
                      {expertSocialLinks[expert.id] && (
                        <div className="flex items-center gap-2">
                          {expertSocialLinks[expert.id].linkedinUrl && (
                            <a
                              href={expertSocialLinks[expert.id].linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                              title="View LinkedIn Profile"
                            >
                              <Linkedin className="w-4 h-4" />
                              <span className="font-semibold">LinkedIn</span>
                            </a>
                          )}
                          {expertSocialLinks[expert.id].behanceUrl && (
                            <a
                              href={expertSocialLinks[expert.id].behanceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                              title="View Behance Portfolio"
                            >
                              <Globe className="w-4 h-4" />
                              <span className="font-semibold">Behance</span>
                            </a>
                          )}
                          {expertSocialLinks[expert.id].websiteUrl && (
                            <a
                              href={expertSocialLinks[expert.id].websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                              title="Visit Website"
                            >
                              <Globe className="w-4 h-4" />
                              <span className="font-semibold">Website</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Expertise Offered: {expert.expertise}</p>
                    <p className="text-sm text-gray-600 mb-2">{expert.currentEngagement}</p>
                    {expertSocialLinks[expert.id] && (
                      <div className="text-sm mt-2 mb-3">
                        <span className="font-bold text-[#1B1B1B]">
                          {expert.engagementTypes.some(type => type.toLowerCase().includes('paid') || type.toLowerCase().includes('consulting'))
                            ? `${expert.engagementTypes.join(' • ')} at ${expert.pricing}`
                            : `${expert.engagementTypes.join(' • ')} • ${expert.pricing}`
                          }
                        </span>
                      </div>
                    )}
                    {expert.bio && (
                      <p className="text-sm text-gray-600 leading-relaxed mt-2">
                        {expert.bio}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[#A8FF36]">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold text-[#1B1B1B]">{expert.usefulnessScore}%</span>
                      <span className="text-xs text-gray-500">match</span>
                    </div>
                    <button
                      onClick={() => navigate('/messages')}
                      className="flex-shrink-0 p-2 rounded-lg transition-all bg-gray-100 text-gray-600 hover:bg-gray-200 relative"
                      title="Message Expert"
                    >
                      <MessageSquare className="w-5 h-5" />
                      {/* Unread message badge for certain experts */}
                      {([1, 3, 7].includes(expert.id)) && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                          {expert.id === 1 ? '3' : expert.id === 3 ? '1' : '2'}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => toggleBookmark(expert)}
                      className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                        isExpertBookmarked(expert.id)
                          ? 'bg-[#A8FF36] text-[#1B1B1B]'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Bookmark Expert"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${isExpertBookmarked(expert.id) ? 'fill-current' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end ml-[192px]">
                  {expertSocialLinks[expert.id]?.allowsDirectBooking ? (
                    <>
                      <button
                        onClick={() => navigate(`/booking/${expert.id}`)}
                        className="px-4 py-3 bg-gradient-to-br from-purple-200 to-purple-300 text-gray-800 rounded-xl hover:from-purple-300 hover:to-purple-400 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Book Now
                      </button>
                      <button
                        onClick={() => navigate(`/requirement/send/${expert.id}`)}
                        className="px-4 py-3 bg-gradient-to-br from-green-200 to-green-300 text-gray-800 rounded-xl hover:from-green-300 hover:to-green-400 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        Share Requirement
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => navigate(`/requirement/send/${expert.id}`)}
                      className="px-4 py-3 bg-gradient-to-br from-green-200 to-green-300 text-gray-800 rounded-xl hover:from-green-300 hover:to-green-400 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      Share Requirement
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {getPageNumbers().map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum as number)}
                  className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                    currentPage === pageNum
                      ? 'bg-[#2563eb] border-[#2563eb] text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              )
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-br from-[#1B1B1B] to-[#2D2D2D] rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Are You an Expert?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join ExpertlyYours and connect with founders and companies who need your expertise.
          </p>
          <Link
            to="/profile/setup"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold text-lg"
          >
            <Briefcase className="w-5 h-5" />
            Become an Expert
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Bookmark Tag Dialog */}
      <BookmarkTagDialog
        isOpen={bookmarkDialogOpen}
        onClose={() => setBookmarkDialogOpen(false)}
        existingTags={allTags}
        onSelectTag={handleSelectTag}
        expertName={expertToBookmark?.name || ''}
      />

      {/* Image Enlargement Modal */}
      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-8"
            onClick={() => setEnlargedImage(null)}
          >
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={enlargedImage}
              alt="Enlarged profile"
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}