import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowLeft, Search, UserCheck, Star, DollarSign, ChevronLeft, ChevronRight, Eye, Mail, Ban, CheckCircle, Trash2 } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { api } from '../services/api';

interface Expert {
  id: string;
  name: string;
  expertise: string;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  pricing: string;
  usefulnessScore: number;
  approvedDate: string;
  requirementsReceived: number;
}

export function AdminExpertsList() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended' | 'rejected'>('all');
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const itemsPerPage = 20;

  // Read filter from URL on mount
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'active' || filterParam === 'pending' || filterParam === 'suspended' || filterParam === 'rejected') {
      setFilterStatus(filterParam);
    }
  }, [searchParams]);

  const [mockExperts, setMockExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExperts = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/admin/experts');
      const mapped = data.map((exp: any) => ({
        id: exp.id,
        name: exp.user?.name || 'Unknown',
        expertise: exp.expertise || 'Specified Expertise',
        status: exp.status,
        pricing: exp.hourlyRate ? `$${exp.hourlyRate}/hour` : 'N/A',
        usefulnessScore: exp.usefulnessScore || 0,
        approvedDate: exp.createdAt ? new Date(exp.createdAt).toISOString().split('T')[0] : 'N/A',
        requirementsReceived: 0,
      }));
      setMockExperts(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [searchParams]);

  // Filter experts
  const filteredExperts = mockExperts.filter((expert) => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || expert.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperts = filteredExperts.slice(startIndex, endIndex);

  // Get selected experts data
  const selectedExpertsData = mockExperts.filter(e => selectedExperts.includes(e.id));

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedExperts(currentExperts.map(e => e.id));
    } else {
      setSelectedExperts([]);
    }
  };

  // Handle individual selection
  const handleSelectExpert = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedExperts([...selectedExperts, id]);
    } else {
      setSelectedExperts(selectedExperts.filter(eid => eid !== id));
    }
  };

  // Clear selection when filter changes
  useEffect(() => {
    setSelectedExperts([]);
  }, [filterStatus, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-black text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="ExpertlyYours" className="h-10" />
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-lg">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-semibold">
                A
              </div>
              <span className="text-sm">Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Experts</h1>
          <p className="text-gray-600">View and manage all expert profiles</p>
        </div>

        {/* Stats Bar */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {mockExperts.filter(e => e.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {mockExperts.filter(e => e.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {mockExperts.filter(e => e.status === 'suspended').length}
                </p>
                <p className="text-sm text-gray-600">Suspended</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {mockExperts.filter(e => e.status === 'rejected').length}
                </p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or expertise..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setFilterStatus('active');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => {
                  setFilterStatus('pending');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => {
                  setFilterStatus('suspended');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'suspended'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Suspended
              </button>
              <button
                onClick={() => {
                  setFilterStatus('rejected');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'rejected'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedExperts.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {selectedExperts.length} selected
                </span>
              </div>

              <button
                onClick={() => setShowNotificationModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Mail className="w-4 h-4" />
                Send Notification
              </button>
              
              {selectedExpertsData.some(e => e.status === 'suspended') && (
                <button
                  onClick={async () => {
                    const toUpdate = selectedExpertsData.filter(e => e.status === 'suspended');
                    if (confirm(`Reactivate ${toUpdate.length} selected suspended expert${toUpdate.length > 1 ? 's' : ''}?`)) {
                      try {
                        await Promise.all(toUpdate.map(t => api.patch(`/admin/experts/${t.id}/status`, { status: 'active' })));
                        alert(`${toUpdate.length} expert${toUpdate.length > 1 ? 's have' : ' has'} been reactivated!`);
                        setSelectedExperts([]);
                        fetchExperts();
                      } catch (err) { console.error(err); alert('Error updating status'); }
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Reactivate Selected
                </button>
              )}
              
              {selectedExpertsData.some(e => e.status === 'rejected' || e.status === 'pending') && (
                <button
                  onClick={async () => {
                    const toUpdate = selectedExpertsData.filter(e => e.status === 'rejected' || e.status === 'pending');
                    if (confirm(`Approve ${toUpdate.length} selected application${toUpdate.length > 1 ? 's' : ''}?`)) {
                      try {
                        await Promise.all(toUpdate.map(t => api.patch(`/admin/experts/${t.id}/status`, { status: 'active' })));
                        alert(`${toUpdate.length} expert${toUpdate.length > 1 ? 's have' : ' has'} been approved!`);
                        setSelectedExperts([]);
                        fetchExperts();
                      } catch (err) { console.error(err); alert('Error updating status'); }
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Selected
                </button>
              )}
              
              {selectedExpertsData.some(e => e.status === 'active') && (
                <button
                  onClick={async () => {
                    const toUpdate = selectedExpertsData.filter(e => e.status === 'active');
                    if (confirm(`Suspend ${toUpdate.length} selected active expert${toUpdate.length > 1 ? 's' : ''}? This is a critical action.`)) {
                      try {
                        await Promise.all(toUpdate.map(t => api.patch(`/admin/experts/${t.id}/status`, { status: 'suspended' })));
                        alert(`${toUpdate.length} expert${toUpdate.length > 1 ? 's have' : ' has'} been suspended!`);
                        setSelectedExperts([]);
                        fetchExperts();
                      } catch (err) { console.error(err); alert('Error updating status'); }
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Ban className="w-4 h-4" />
                  Suspend Selected
                </button>
              )}

              <button
                onClick={() => {
                  if (confirm(`Delete ${selectedExperts.length} selected expert${selectedExperts.length > 1 ? 's' : ''}? This action cannot be undone.`)) {
                    alert(`${selectedExperts.length} expert${selectedExperts.length > 1 ? 's have' : ' has'} been deleted!`);
                    setSelectedExperts([]);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>

              <button
                onClick={() => setSelectedExperts([])}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Experts Table */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedExperts.length === currentExperts.length && currentExperts.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expertise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requirements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentExperts.map((expert) => (
                  <tr key={expert.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedExperts.includes(expert.id)}
                        onChange={(e) => handleSelectExpert(expert.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{expert.name}</div>
                      <div className="text-xs text-gray-500">{expert.approvedDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{expert.expertise}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(expert.status)}`}>
                        {expert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <DollarSign className="w-4 h-4" />
                        {expert.pricing}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-900">{expert.usefulnessScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {expert.requirementsReceived}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/experts/${expert.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredExperts.length)}</span> of{' '}
                <span className="font-medium">{filteredExperts.length}</span> results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Send Notification</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sending to: <span className="font-semibold">{selectedExperts.length > 0 ? `${selectedExperts.length} selected expert${selectedExperts.length > 1 ? 's' : ''}` : `${filteredExperts.length} ${filterStatus === 'all' ? 'experts' : `${filterStatus} experts`}`}</span>
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Message
              </label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={6}
                placeholder="Enter your notification message here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                This will be sent as a platform notification to {selectedExperts.length > 0 ? 'selected' : 'all filtered'} experts.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  setNotificationMessage('');
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (notificationMessage.trim()) {
                    const count = selectedExperts.length > 0 ? selectedExperts.length : filteredExperts.length;
                    alert(`Notification sent to ${count} expert${count > 1 ? 's' : ''}!`);
                    setShowNotificationModal(false);
                    setNotificationMessage('');
                    setSelectedExperts([]);
                  } else {
                    alert('Please enter a message');
                  }
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}