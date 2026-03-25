import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowLeft, Search, Filter, CheckCircle, XCircle, Clock, AlertTriangle, Eye, ThumbsUp, ThumbsDown, LogOut } from 'lucide-react';
import { api } from '../services/api';
import { useNavigate } from 'react-router';

type ExpertStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

interface Expert {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio: string;
  title: string;
  experience: string;
  company: string;
  skills: string[];
  hourlyRate: number;
  status: ExpertStatus;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export function AdminExpertReview() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const handleLogout = () => {
    localStorage.removeItem('expertly_yours_token');
    localStorage.removeItem('expertly_yours_user');
    navigate('/admin');
  };

  const filterParam = searchParams.get('filter') || 'all';
  
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>(filterParam);

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/expert-applications');
      setExperts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expert applications');
      setExperts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleApprove = async (expertId: string) => {
    try {
      await api.post('/admin/expert-approve', { expertId });
      await fetchExperts(); // Refresh data
    } catch (err: any) {
      alert(err.message || 'Failed to approve expert');
    }
  };

  const handleReject = async (expertId: string) => {
    if (!window.confirm('Are you sure you want to reject this expert?')) return;
    try {
      await api.post('/admin/expert-reject', { expertId });
      await fetchExperts(); // Refresh data
    } catch (err: any) {
      alert(err.message || 'Failed to reject expert');
    }
  };

  // Filter experts
  const filteredExperts = experts.filter((expert) => {
    const expertName = expert.user?.name || expert.name || '';
    const expertEmail = expert.user?.email || expert.email || '';
    const expertTitle = expert.title || '';
    
    const matchesSearch = 
      expertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expertTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expertEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      selectedFilter === 'all' || 
      (selectedFilter === 'pending' && expert.status === 'PENDING_APPROVAL') ||
      (selectedFilter === 'approved' && expert.status === 'APPROVED') ||
      (selectedFilter === 'rejected' && expert.status === 'REJECTED');
    
    return matchesSearch && matchesFilter;
  });

  // Stats
  const stats = {
    all: experts.length,
    pending: experts.filter(e => e.status === 'PENDING_APPROVAL').length,
    approved: experts.filter(e => e.status === 'APPROVED').length,
    rejected: experts.filter(e => e.status === 'REJECTED').length,
  };

  const getStatusBadge = (status: ExpertStatus) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Approval
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              Dashboard
            </Link>
            <span className="text-gray-600">|</span>
            <span className="text-lg font-semibold">Expert Review</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-semibold">
                A
              </div>
              <span className="text-sm">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors border border-gray-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expert Management</h1>
          <p className="text-gray-600">Review, approve, and manage expert profiles</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, expertise, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({stats.all})
              </button>
              <button
                onClick={() => setSelectedFilter('pending')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedFilter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setSelectedFilter('approved')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedFilter === 'approved'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setSelectedFilter('rejected')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedFilter === 'rejected'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredExperts.length} of {experts.length} experts
          </p>
        </div>

        {/* Experts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Loading experts...</p>
            </div>
          ) : filteredExperts.map((expert) => (
            <div
              key={expert.id}
              className={`bg-white border rounded-lg p-6 shadow-sm hover:border-gray-400 transition-colors ${
                expert.status === 'PENDING_APPROVAL' ? 'border-yellow-200 ring-1 ring-yellow-100' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{expert.user?.name || expert.name}</h3>
                    {getStatusBadge(expert.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{expert.user?.email || expert.email}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Role</p>
                      <p className="text-gray-900">{expert.title} at {expert.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Experience</p>
                      <p className="text-gray-900">{expert.experience}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {expert.skills?.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs border border-gray-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Bio</p>
                    <p className="text-gray-700 line-clamp-2">{expert.bio}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  {expert.status === 'PENDING_APPROVAL' && (
                    <>
                      <button
                        onClick={() => handleApprove(expert.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(expert.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  <Link
                    to={`/admin/experts/${expert.id}`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </Link>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <span>Submitted on {new Date(expert.createdAt).toLocaleDateString()}</span>
                <span>Rate: ${expert.hourlyRate}/hr</span>
              </div>
            </div>
          ))}

          {!loading && filteredExperts.length === 0 && (
            <div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No experts found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
