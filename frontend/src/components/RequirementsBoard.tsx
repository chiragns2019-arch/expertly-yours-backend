import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { PostLoginNav } from './PostLoginNav';
import { Briefcase, DollarSign, Clock, Building, Calendar, MessageSquare, Send, Filter, Search } from 'lucide-react';
import { api } from '../services/api';

export function RequirementsBoard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [publicRequirements, setPublicRequirements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const userStr = localStorage.getItem('expertly_yours_user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentUserId = currentUser?.id || '';

  const handleStartChat = async (ownerId: string) => {
    try {
      if (!ownerId) return;
      const conv = await api.post('/conversation/start', { ownerId });
      if (conv && conv.id) {
        navigate(`/messages/${conv.id}`);
      }
    } catch (err) {
      console.error('Failed to start chat', err);
    }
  };

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setIsLoading(true);
        const data = await api.get('/requirements/public');
        const mapped = data.map((req: any) => ({
          id: req.id,
          title: req.problemDescription.substring(0, 50) + (req.problemDescription.length > 50 ? '...' : ''),
          description: req.problemDescription,
          category: 'General',
          budget: req.offerDetails || req.offerType || 'Variable',
          timeline: req.timeCommitment || 'Flexible',
          companyStage: req.companyStage || 'N/A',
          companyName: req.companyName || 'Confidential',
          postedBy: {
            id: req.seekerId,
            name: req.seeker?.name || 'Unknown',
            title: 'Founder / Executive',
            profilePicture: req.seeker?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
          },
          postedDate: new Date(req.createdAt).toLocaleDateString(),
          responseCount: 0,
        }));
        setPublicRequirements(mapped);
      } catch (err) {
        console.error('Failed to load requirements');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequirements();
  }, []);

  const categories = ['all', 'Marketing', 'Engineering', 'Product', 'Sales', 'Design', 'Operations'];

  const filteredRequirements = publicRequirements.filter((req: any) => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <PostLoginNav />
      
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-[#1B1B1B] mb-3">Requirements Board</h1>
              <p className="text-lg text-gray-600">
                Browse public requirements and respond with your expertise
              </p>
            </div>
            <Link
              to="/requirement/new"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold flex items-center gap-2 whitespace-nowrap"
            >
              <Briefcase className="w-5 h-5" />
              Post a New Requirement
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-600" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600 font-medium">
            {filteredRequirements.length} requirement{filteredRequirements.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Requirements List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequirements.map((requirement: any) => (
              <div
                key={requirement.id}
                className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-300 transition-all"
              >
                {/* Header with poster info */}
                <div className="flex items-start gap-4 mb-4">
                  <Link to={`/profile/${requirement.id}-poster`}>
                    <img
                      src={requirement.postedBy.profilePicture}
                      alt={requirement.postedBy.name}
                      className="w-14 h-14 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-[#1B1B1B] mb-1">
                          {requirement.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Link 
                            to={`/profile/${requirement.id}-poster`}
                            className="font-medium hover:text-blue-600 transition-colors"
                          >
                            {requirement.postedBy.name}
                          </Link>
                          <span>•</span>
                          <span>{requirement.postedBy.title}</span>
                          <span>•</span>
                          <span>{requirement.postedDate}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {requirement.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {requirement.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{requirement.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{requirement.timeline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{requirement.companyStage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{requirement.responseCount} responses</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-4 h-4" />
                    <span className="font-medium">{requirement.companyName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStartChat(requirement.postedBy.id)}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat with {requirement.postedBy.name.split(' ')[0]}
                    </button>
                    <Link
                      to={`/requirements/${requirement.id}`}
                      className="px-6 py-2.5 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Respond to Requirement
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredRequirements.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1B1B1B] mb-2">No requirements found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No public requirements have been posted yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}