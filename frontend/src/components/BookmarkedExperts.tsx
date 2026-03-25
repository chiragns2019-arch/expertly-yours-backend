import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Bookmark, ArrowLeft, Send, Trash2, User, CheckCircle, Briefcase, Folder, Tag, X } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { toast } from 'sonner';
import { PostLoginNav } from './PostLoginNav';
import { api } from '../services/api';

export function BookmarkedExperts() {
  // Updated data structure: { expertId: Expert, tags: string[] }
  const [bookmarkedData, setBookmarkedData] = useState<{
    [expertId: string]: { bookmarkId: string, expert: any, tags: string[] }
  }>({});
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setIsLoading(true);
        const data = await api.get('/bookmarks');
        const mappedData: any = {};
        data.forEach((item: any) => {
          mappedData[item.expertId] = {
            bookmarkId: item.id,
            expert: {
              id: item.expert.id,
              name: item.expert.user?.name || 'Unknown',
              expertise: item.expert.expertise || '',
              experience: '10+ years',
              profilePicture: item.expert.user?.avatar || 'https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMG1hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5ODY1OTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
              currentEngagement: item.expert.title || '',
              pastEngagements: [],
              scaleIndicators: [],
              engagementTypes: ['Paid consulting'],
              usefulnessScore: item.expert.usefulnessScore || 90,
              engagementCount: 0,
              bookmarkedDate: new Date(item.createdAt).toLocaleDateString(),
            },
            tags: item.tags?.map((t: any) => t.name) || [],
          };
        });
        setBookmarkedData(mappedData);
      } catch (err) {
        toast.error('Failed to load bookmarks');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      Object.values(bookmarkedData).flatMap(item => item.tags)
    )
  );

  // Get bookmarks filtered by selected tag
  const getFilteredBookmarks = () => {
    if (!selectedTagFilter) {
      return Object.entries(bookmarkedData).map(([id, data]) => ({
        ...data.expert,
        tags: data.tags
      }));
    }
    
    return Object.entries(bookmarkedData)
      .filter(([_, data]) => data.tags.includes(selectedTagFilter))
      .map(([id, data]) => ({
        ...data.expert,
        tags: data.tags
      }));
  };

  const filteredBookmarks = getFilteredBookmarks();

  const removeBookmark = async (id: string) => {
    const bookmark = bookmarkedData[id];
    if (!bookmark) return;
    
    try {
      await api.delete(`/bookmarks/${bookmark.bookmarkId}`);
      const expertName = bookmark.expert.name;
      const newData = { ...bookmarkedData };
      delete newData[id];
      setBookmarkedData(newData);
      setSelectedExperts(selectedExperts.filter(expertId => expertId !== id));
      toast.success(`Removed ${expertName} from all collections`);
    } catch (err) {
      toast.error('Failed to remove bookmark');
    }
  };

  const removeFromTag = (expertId: string, tagToRemove: string) => {
    const data = bookmarkedData[expertId];
    if (!data) return;

    const updatedTags = data.tags.filter(t => t !== tagToRemove);
    
    if (updatedTags.length === 0) {
      // If no tags left, remove the expert entirely
      removeBookmark(expertId);
    } else {
      setBookmarkedData({
        ...bookmarkedData,
        [expertId]: {
          ...data,
          tags: updatedTags
        }
      });
      toast.success(`Removed from "${tagToRemove}"`);
    }
  };

  const toggleSelection = (id: string) => {
    if (selectedExperts.includes(id)) {
      setSelectedExperts(selectedExperts.filter(expertId => expertId !== id));
    } else {
      setSelectedExperts([...selectedExperts, id]);
    }
  };

  const selectAll = () => {
    if (selectedExperts.length === filteredBookmarks.length) {
      setSelectedExperts([]);
    } else {
      setSelectedExperts(filteredBookmarks.map(b => b.id));
    }
  };

  const navigate = useNavigate();

  const sendToSelected = () => {
    // Navigate to requirement submission with selected expert IDs
    const selectedExpertData = filteredBookmarks.filter(expert => selectedExperts.includes(expert.id));
    navigate('/requirement/bulk', { state: { selectedExperts: selectedExpertData } });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Navigation */}
      <PostLoginNav />

      <div className="max-w-7xl mx-auto px-8 py-10 pt-24">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-[#1B1B1B]">Bookmarked Experts</h1>
          </div>
          <p className="text-gray-600 text-lg">Your private shortlist • Persistent across sessions</p>
        </div>

        {/* Tag Filter Pills */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-600">Collections:</span>
              <button
                onClick={() => setSelectedTagFilter(null)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedTagFilter === null
                    ? 'bg-[#A8FF36] text-[#1B1B1B]'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                All ({Object.keys(bookmarkedData).length})
              </button>
              {allTags.map((tag) => {
                const count = Object.values(bookmarkedData).filter(data => 
                  data.tags.includes(tag)
                ).length;
                
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTagFilter(tag)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedTagFilter === tag
                        ? 'bg-[#A8FF36] text-[#1B1B1B]'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Folder className="w-4 h-4" />
                    {tag} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A8FF36]"></div>
          </div>
        ) : filteredBookmarks.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm">
              <p className="text-gray-700 font-semibold">{filteredBookmarks.length} expert{filteredBookmarks.length !== 1 ? 's' : ''} bookmarked</p>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAll}
                  className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                >
                  {selectedExperts.length === filteredBookmarks.length ? 'Deselect All' : 'Select All'}
                </button>
                
                {selectedExperts.length > 0 && (
                  <button
                    onClick={sendToSelected}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold"
                  >
                    <Send className="w-4 h-4" />
                    Share Requirement with {selectedExperts.length} {selectedExperts.length === 1 ? 'Expert' : 'Experts'}
                  </button>
                )}
              </div>
            </div>

            {filteredBookmarks.map((expert) => (
              <div
                key={expert.id}
                className={`bg-white border-2 rounded-2xl p-6 hover:shadow-lg transition-all ${
                  selectedExperts.includes(expert.id) 
                    ? 'border-blue-400 ring-2 ring-blue-200' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-6">
                  <input
                    type="checkbox"
                    checked={selectedExperts.includes(expert.id)}
                    onChange={() => toggleSelection(expert.id)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  {/* Expert Profile Image */}
                  <div className="flex-shrink-0">
                    <img 
                      src={expert.profilePicture} 
                      alt={expert.name}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-lg"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-[#1B1B1B]">{expert.name}</h3>
                          <button
                            onClick={() => removeBookmark(expert.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Remove bookmark"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Bookmarked {expert.bookmarkedDate}</p>
                        <p className="text-lg text-gray-700 font-semibold mb-3">{expert.expertise}</p>
                        
                        {/* Tags for this expert */}
                        {expert.tags && expert.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {expert.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#A8FF36] bg-opacity-20 border border-[#A8FF36] rounded-full text-xs font-semibold text-[#1B1B1B]"
                              >
                                <Folder className="w-3 h-3" />
                                {tag}
                                <button
                                  onClick={() => removeFromTag(expert.id, tag)}
                                  className="ml-1 hover:bg-[#A8FF36] hover:bg-opacity-30 rounded-full p-0.5 transition-colors"
                                  title={`Remove from "${tag}"`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {expert.currentEngagement && (
                          <div className="flex items-center gap-2 mb-3">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Current:</span> {expert.currentEngagement}
                            </p>
                          </div>
                        )}

                        <div className="mb-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 font-bold">Total Years in This Area</p>
                          <p className="text-[#1B1B1B] font-bold text-lg">{expert.experience}</p>
                        </div>

                        {expert.pastEngagements && expert.pastEngagements.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-bold">Past Experience</p>
                            <ul className="space-y-1.5">
                              {expert.pastEngagements.slice(0, 3).map((engagement, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start">
                                  <span className="text-blue-500 mr-2 font-bold">•</span>
                                  <span>{engagement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="mb-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-bold">Scale Indicators</p>
                          <div className="flex flex-wrap gap-2">
                            {expert.scaleIndicators.map((indicator) => (
                              <span
                                key={indicator}
                                className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full border-2 border-green-200 font-semibold"
                              >
                                ✓ {indicator}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-bold">Open To</p>
                          <div className="flex flex-wrap gap-2">
                            {expert.engagementTypes.map((type) => (
                              <span
                                key={type}
                                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>

                        {expert.usefulnessScore && (
                          <div className="flex items-center gap-4 bg-green-50 border-2 border-green-200 rounded-xl p-3 inline-flex">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="font-bold text-green-700 text-lg">{expert.usefulnessScore}% useful</span>
                            </div>
                            <div className="w-px h-6 bg-green-300"></div>
                            <span className="font-bold text-green-700">{expert.engagementCount} engagement{expert.engagementCount !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 ml-6">
                        <Link
                          to={`/profile/${expert.id}`}
                          className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-center whitespace-nowrap font-semibold"
                        >
                          View Profile
                        </Link>
                        <Link
                          to={`/requirement/send/${expert.id}`}
                          className="px-5 py-2.5 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors text-center whitespace-nowrap font-bold"
                        >
                          Share Requirement
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#1B1B1B] mb-2">No bookmarks yet</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Bookmark experts while browsing to build your shortlist
            </p>
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold"
            >
              Discover Experts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}