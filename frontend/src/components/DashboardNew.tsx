import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FileText, Bookmark, Settings, Clock, CheckCircle, XCircle, Send, Calendar, MessageSquare, Briefcase, Search, Bell, Paperclip, Video, Eye, Trash2, TrendingUp, Mail, Edit, Copy, Sparkles, ChevronRight, ChevronDown, User, Globe } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { PostLoginNav } from './PostLoginNav';
import { api } from '../services/api';

export function Dashboard() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const isExpertProfilePublished = !!userProfile?.expertProfile;
  const hasExpertProfile = !!userProfile?.expertProfile;
  const isExpert = userProfile?.role === 'EXPERT';

  const [activeMode, setActiveMode] = useState<'explorer' | 'expert'>(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('expertly_mode');
    return (saved === 'expert' || saved === 'explorer') ? saved : 'explorer';
  });
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [activeDiscoverTab, setActiveDiscoverTab] = useState<'requirements' | 'appointments' | 'drafts' | 'engagements'>('requirements');
  
  // Expert mode states
  const [expertActiveSection, setExpertActiveSection] = useState<'profile-views' | 'requirements' | 'engagements'>('requirements');
  const [requirementsSubTab, setRequirementsSubTab] = useState<'pending' | 'accepted'>('pending');

  // Save mode to localStorage whenever it changes
  const handleModeChange = (mode: 'explorer' | 'expert') => {
    setActiveMode(mode);
    localStorage.setItem('expertly_mode', mode);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('expertly_mode_change', { detail: { mode } }));
  };




  const [myRequirements, setMyRequirements] = useState<any[]>([]);
  const [savedRequirements, setSavedRequirements] = useState<any[]>([]);
  const [requirementsReceived, setRequirementsReceived] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequirements = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/requirements/public');
      const reqs = response?.data || response || [];
      
      if (Array.isArray(reqs)) {
        setMyRequirements(reqs.filter((r: any) => !r?.isDraft).map((r: any) => ({
          ...r,
          sentDate: r?.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A',
          hasAttachments: !!r?.attachments,
          postedToBoard: !!r?.isPublic,
          expertResponses: r?.recipients?.map((rec: any) => ({
            expertId: rec?.expert?.userId,
            expertName: rec?.expert?.user?.name || 'Expert',
            expertTitle: rec?.expert?.title || rec?.expert?.expertise || 'Expert',
            expertAvatar: rec?.expert?.user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            status: rec?.status || 'pending',
            statusDate: rec?.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'N/A',
            hasSlots: false,
          })) || [],
        })));
        
        setSavedRequirements(reqs.filter((r: any) => !!r?.isDraft).map((r: any) => ({
          ...r,
          createdAt: r?.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A',
        })));
      }
    } catch (err) {
      console.error('Failed to fetch requirements', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExpertInbox = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/requirements/inbox');
      // The backend returns an array of objects like { id, recipientId, userName, companyName, ... }
      // The dashboard expects: { id, userId, user, userAvatar, company, status, requirements: [...] }
      
      // Group by user/company to match UI structure
      const grouped = data.reduce((acc: any, item: any) => {
        const key = `${item.userName}-${item.companyName}`;
        if (!acc[key]) {
          acc[key] = {
            id: item.id,
            userId: item.userId || item.id,
            user: item.userName,
            userAvatar: item.userAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            company: item.companyName,
            status: item.status,
            requirements: []
          };
        }
        acc[key].requirements.push({
          id: item.id,
          title: item.companyName ? `${item.companyName} Requirement` : 'Requirement',
          description: item.problemDescription,
          date: new Date(item.submittedAt).toLocaleDateString(),
          isNew: item.status === 'pending'
        });
        return acc;
      }, {});

      setRequirementsReceived(Object.values(grouped));
    } catch (err) {
      console.error('Failed to fetch expert inbox', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        setUserProfile(response.data || response);
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeMode === 'explorer') {
      fetchRequirements();
    } else if (isExpert) {
      fetchExpertInbox();
    }
  }, [activeMode, isExpert]);

  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);
  const [ongoingEngagements, setOngoingEngagements] = useState<any[]>([]);

  const stats = [
    { label: 'Profile Views', value: '-', change: '-' },
    { label: 'Requirements Received', value: String(requirementsReceived.length || 0), change: '' },
    { label: 'Active Engagements', value: String(ongoingEngagements.length || 0), change: '' },
  ];

  const profileViews: any[] = [];

  // Fetch real upcoming meetings
  const fetchUpcomingMeetings = async () => {
    try {
      const data = await api.get('/meetings/upcoming');
      const mapped = (data || []).map((m: any) => ({
        id: m.id,
        expertId: m.expertId,
        expertName: m.expert?.user?.name || 'Expert',
        expertTitle: m.expert?.title || 'Expert',
        expertAvatar: m.expert?.user?.avatar || '',
        requirementTitle: m.requirement?.title || 'Meeting',
        meetingDate: m.date,
        meetingTime: `${m.startTime} - ${m.endTime}`,
        googleMeetLink: m.meetLink || '',
        status: m.status,
        sessionNumber: 1,
        notes: m.notes || '',
      }));
      setBookedAppointments(mapped);
    } catch (err) {
      console.error('Failed to fetch meetings', err);
    }
  };

  // Fetch real engagements (accepted requirements)
  const fetchEngagements = async () => {
    try {
      const data = await api.get('/meetings/engagements');
      const seekerEngagements = (data.asSeeker || []).map((req: any) => ({
        expertId: req.recipients?.[0]?.expertId || '',
        expertName: req.recipients?.[0]?.expert?.user?.name || 'Expert',
        expertTitle: req.recipients?.[0]?.expert?.title || 'Expert',
        expertAvatar: req.recipients?.[0]?.expert?.user?.avatar || '',
        requirements: [{
          id: req.id,
          title: req.title,
          startDate: new Date(req.createdAt).toLocaleDateString(),
          nextMeeting: null,
        }],
      }));
      const expertEngagements = (data.asExpert || []).map((req: any) => ({
        expertId: '',
        expertName: req.seekerName || 'Seeker',
        expertTitle: 'Seeker',
        expertAvatar: req.seekerAvatar || '',
        requirements: [{
          id: req.id,
          title: req.title,
          startDate: new Date(req.createdAt).toLocaleDateString(),
          nextMeeting: null,
        }],
      }));
      setOngoingEngagements([...seekerEngagements, ...expertEngagements]);
    } catch (err) {
      console.error('Failed to fetch engagements', err);
    }
  };

  useEffect(() => {
    fetchUpcomingMeetings();
    fetchEngagements();
  }, []);



  const handleCancelRequirement = (requirementId: string) => {
    alert(`Requirement cancelled. Both parties have been notified.`);
    setShowCancelModal(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3" />Accepted</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3" />Pending</span>;
      case 'declined':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1"><XCircle className="w-3 h-3" />Declined</span>;
      case 'booked':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1"><Calendar className="w-3 h-3" />Booked</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Navigation */}
      <PostLoginNav />

      <div className="max-w-7xl mx-auto px-8 py-10 pt-24">
        {/* Header with Mode Toggle */}
        <div className="flex items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1B1B1B] mb-2">Dashboard</h1>
            <p className="text-gray-600 text-lg">Manage your requirements and track engagements</p>
          </div>

          {isExpert && (
            <div className="flex gap-4">
              <button
                onClick={() => handleModeChange('explorer')}
                className={`border-2 rounded-2xl p-4 text-left transition-all w-56 ${
                  activeMode === 'explorer'
                    ? 'bg-blue-50 border-blue-400 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Search className={`w-4 h-4 ${activeMode === 'explorer' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <h2 className="text-sm font-bold text-[#1B1B1B]">Discover Mode</h2>
                </div>
                <span className={`text-xs font-semibold block mb-1 ${activeMode === 'explorer' ? 'text-blue-600' : 'text-gray-500'}`}>
                  {activeMode === 'explorer' ? '✓ Active View' : 'Click to view'}
                </span>
                <p className="text-gray-700 text-xs leading-relaxed">
                  Discover experts, bookmark specialists, and share requirements
                </p>
              </button>

              <button
                onClick={() => handleModeChange('expert')}
                disabled={!isExpertProfilePublished}
                className={`border-2 rounded-2xl p-4 text-left transition-all w-56 ${
                  activeMode === 'expert'
                    ? 'bg-green-50 border-green-400 shadow-lg'
                    : isExpertProfilePublished
                    ? 'bg-white border-gray-200 hover:border-green-300'
                    : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className={`w-4 h-4 ${activeMode === 'expert' ? 'text-green-600' : 'text-gray-600'}`} />
                  <h2 className="text-sm font-bold text-[#1B1B1B]">Expert Mode</h2>
                </div>
                <span className={`text-xs font-semibold block mb-1 ${
                  activeMode === 'expert'
                    ? 'text-green-600'
                    : isExpertProfilePublished
                    ? 'text-gray-500'
                    : 'text-gray-400'
                }`}>
                  {!isExpertProfilePublished && 'Not set up'}
                  {isExpertProfilePublished && activeMode === 'expert' && '✓ Active View'}
                  {isExpertProfilePublished && activeMode !== 'expert' && 'Click to view'}
                </span>
                {isExpertProfilePublished && hasExpertProfile ? (
                  <p className="text-gray-700 text-xs leading-relaxed">
                    Receive and manage requirements from people seeking your expertise
                  </p>
                ) : (
                  <p className="text-gray-700 text-xs leading-relaxed">
                    Share your expertise and receive requirements on your terms
                  </p>
                )}
              </button>
            </div>
          )}
        </div>

        {/* DISCOVER MODE WITH TABS */}
        {activeMode === 'explorer' && (
          <>
            {/* Tab Navigation */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-2 mb-6 shadow-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveDiscoverTab('requirements')}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all text-sm ${
                    activeDiscoverTab === 'requirements'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Global Requirements
                </button>
                <button
                  onClick={() => setActiveDiscoverTab('drafts')}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all text-sm ${
                    activeDiscoverTab === 'drafts'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Saved and Draft Requirements
                </button>
                <button
                  onClick={() => setActiveDiscoverTab('appointments')}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all text-sm ${
                    activeDiscoverTab === 'appointments'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Upcoming Appointments
                </button>
                <button
                  onClick={() => setActiveDiscoverTab('engagements')}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all text-sm ${
                    activeDiscoverTab === 'engagements'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Ongoing Engagements
                </button>
              </div>
            </div>

            {/* TAB: MY REQUIREMENTS */}
            {activeDiscoverTab === 'requirements' && (
              <div className="space-y-6">
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-[#1B1B1B]">Global Requirements</h2>
                      <p className="text-sm text-gray-600 mt-1">Track all your requirements and expert responses</p>
                    </div>
                    <Link
                      to="/requirement/new"
                      className="px-5 py-2.5 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors flex items-center gap-2 font-bold"
                    >
                      <Send className="w-4 h-4" />
                      New Requirement
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {myRequirements.map((requirement) => {
                      const isExpanded = selectedRequirement === requirement.id;
                      
                      return (
                        <div
                          key={requirement.id}
                          className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 transition-colors"
                        >
                          {/* Collapsed View */}
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                  <h3 className="text-lg font-bold text-[#1B1B1B]">{requirement.title}</h3>
                                  {requirement.hasAttachments && (
                                    <Paperclip className="w-4 h-4 text-gray-500" />
                                  )}
                                  {requirement.postedToBoard && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold flex items-center gap-1">
                                      <Globe className="w-3 h-3" />
                                      Posted on Board
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{requirement.problemDescription}</p>
                                <p className="text-xs text-gray-600">
                                  Sent {requirement.sentDate} · {requirement.expertResponses.length} expert{requirement.expertResponses.length > 1 ? 's' : ''} responded
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/requirement/${requirement.id}/edit`}
                                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all font-semibold text-sm whitespace-nowrap border-2 border-gray-300"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit Requirements
                                </Link>
                                <button
                                  onClick={() => setSelectedRequirement(isExpanded ? null : requirement.id)}
                                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all font-semibold text-sm whitespace-nowrap"
                                >
                                  View Responses ({requirement.expertResponses.length})
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Expanded View */}
                          {isExpanded && (
                            <div className="border-t-2 border-gray-200 p-5 bg-gray-50">
                              {/* Expert Responses */}
                              <div className="mb-5">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Expert Responses:</h4>
                                  
                                  {/* Message All Accepted Experts Button */}
                                  {requirement.expertResponses.filter(r => r.status === 'accepted' || r.status === 'booked').length > 1 && (
                                    <Link
                                      to="/messages"
                                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold whitespace-nowrap transition-colors"
                                    >
                                      <Mail className="w-4 h-4" />
                                      Message All Accepted ({requirement.expertResponses.filter(r => r.status === 'accepted' || r.status === 'booked').length})
                                    </Link>
                                  )}
                                </div>
                                <div className="space-y-3">
                                  {requirement.expertResponses.map((response) => (
                                    <div
                                      key={response.expertId}
                                      className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors"
                                    >
                                      <Link 
                                        to={`/profile/${response.expertId}`}
                                        className="flex items-center gap-3 flex-1 hover:bg-gray-50 -m-4 p-4 rounded-xl transition-colors"
                                      >
                                        <img
                                          src={response.expertAvatar}
                                          alt={response.expertName}
                                          className="w-12 h-12 rounded-xl border-2 border-white shadow-lg object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="font-bold text-[#1B1B1B] truncate">{response.expertName}</p>
                                          <p className="text-xs text-gray-600 truncate">{response.expertTitle}</p>
                                        </div>
                                      </Link>
                                      
                                      <div className="flex items-center gap-3 ml-3">
                                        {getStatusBadge(response.status)}
                                        
                                        {(response.status === 'accepted' || response.status === 'booked') && (
                                          <Link
                                            to="/messages"
                                            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 text-sm font-semibold whitespace-nowrap flex items-center gap-1 transition-all"
                                          >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            Message
                                          </Link>
                                        )}
                                        
                                        {response.status === 'accepted' && response.hasSlots && (
                                          <Link
                                            to={`/book-slot/${response.expertId}/${requirement.id}`}
                                            className="px-4 py-2 bg-[#A8FF36] text-[#1B1B1B] rounded-lg hover:bg-[#98EF26] text-sm font-bold whitespace-nowrap transition-colors"
                                          >
                                            Book Slot
                                          </Link>
                                        )}
                                        
                                        {response.status === 'booked' && response.bookingDate && (
                                          <div className="text-xs text-gray-700 font-semibold">
                                            <Video className="w-3.5 h-3.5 inline mr-1" />
                                            {response.bookingDate}
                                          </div>
                                        )}
                                        
                                        {response.status === 'pending' && (
                                          <button
                                            onClick={() => setShowCancelModal(`${requirement.id}-${response.expertId}`)}
                                            className="text-red-600 hover:text-red-700 text-xs font-semibold"
                                          >
                                            Cancel
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center flex-wrap gap-3 pt-4 border-t-2 border-gray-200">
                                <Link
                                  to={`/requirement/${requirement.id}/view`}
                                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Full Requirement
                                </Link>
                                <Link
                                  to={`/requirement/${requirement.id}/ai-matches`}
                                  className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
                                >
                                  <Sparkles className="w-4 h-4" />
                                  View AI Recommended Experts
                                </Link>
                                <Link
                                  to={`/requirement/${requirement.id}/reuse`}
                                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                                >
                                  <Send className="w-4 h-4" />
                                  Send to More Experts
                                </Link>
                                <button
                                  onClick={() => setShowCancelModal(requirement.id)}
                                  className="ml-auto text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Requirement
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {myRequirements.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-[#1B1B1B] mb-2">No Requirements Yet</h3>
                      <p className="text-gray-600 mb-4">Start by discovering experts and sending your first requirement</p>
                      <Link
                        to="/discover"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold"
                      >
                        <Search className="w-4 h-4" />
                        Discover Experts
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: BOOKED APPOINTMENTS */}
            {activeDiscoverTab === 'appointments' && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#1B1B1B]">Upcoming Appointments</h2>
                  <p className="text-sm text-gray-600 mt-1">View and manage your scheduled meetings</p>
                </div>

                <div className="space-y-4">
                  {bookedAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border-2 border-blue-200 bg-blue-50 rounded-2xl p-5"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={appointment.expertAvatar}
                          alt={appointment.expertName}
                          className="w-16 h-16 rounded-xl border-2 border-white shadow-lg object-cover"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-[#1B1B1B]">{appointment.expertName}</h3>
                              <p className="text-sm text-gray-600">{appointment.expertTitle}</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              Session #{appointment.sessionNumber}
                            </span>
                          </div>

                          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-3">
                            <p className="text-sm text-gray-600 mb-1">Regarding:</p>
                            <p className="font-semibold text-[#1B1B1B] mb-3">{appointment.requirementTitle}</p>
                            
                            <div className="grid md:grid-cols-2 gap-3 mb-3">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Date</p>
                                <p className="text-sm font-semibold text-[#1B1B1B]">{appointment.meetingDate}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Time</p>
                                <p className="text-sm font-semibold text-[#1B1B1B]">{appointment.meetingTime}</p>
                              </div>
                            </div>

                            {appointment.notes && (
                              <div className="mb-3">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Notes</p>
                                <p className="text-sm text-gray-700">{appointment.notes}</p>
                              </div>
                            )}

                            <div className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                              <Video className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-600 font-semibold mb-0.5">Google Meet Link</p>
                                <a
                                  href={appointment.googleMeetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-bold text-blue-600 hover:text-blue-700 break-all"
                                >
                                  {appointment.googleMeetLink}
                                </a>
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(appointment.googleMeetLink);
                                  alert('Meeting link copied!');
                                }}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors flex-shrink-0"
                                title="Copy link"
                              >
                                <Copy className="w-4 h-4 text-green-700" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <a
                              href={appointment.googleMeetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2.5 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors text-center font-bold"
                            >
                              Join Meeting
                            </a>
                            <Link
                              to="/messages"
                              className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                            >
                              Message Expert
                            </Link>
                            <button
                              onClick={() => setShowCancelModal(appointment.id)}
                              className="px-4 py-2.5 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all font-semibold"
                            >
                              Cancel Appointment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {bookedAppointments.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#1B1B1B] mb-2">No Booked Appointments</h3>
                    <p className="text-gray-600">Once experts accept your requirements and suggest slots, you can book appointments here</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SAVED & DRAFTS */}
            {activeDiscoverTab === 'drafts' && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1B1B1B]">Saved & Drafts</h2>
                    <p className="text-sm text-gray-600 mt-1">All your saved and draft requirements</p>
                  </div>
                  <Link
                    to="/requirement/new"
                    className="px-5 py-2.5 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors flex items-center gap-2 font-bold"
                  >
                    <Send className="w-4 h-4" />
                    New Requirement
                  </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedRequirements.map((req) => (
                    <Link
                      key={req.id}
                      to={`/requirement/${req.id}/reuse`}
                      className="block border-2 border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-base text-[#1B1B1B] truncate flex-1">{req.companyName}</h3>
                        {req.isDraft && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full flex-shrink-0 font-semibold">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {req.problemDescription}
                      </p>
                      <p className="text-xs text-gray-500">{req.createdAt}</p>
                    </Link>
                  ))}
                </div>

                {savedRequirements.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#1B1B1B] mb-2">No Saved Requirements</h3>
                    <p className="text-gray-600">Save requirements as drafts to reuse them later</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: ONGOING ENGAGEMENTS */}
            {activeDiscoverTab === 'engagements' && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#1B1B1B]">Ongoing Engagements</h2>
                  <p className="text-sm text-gray-600 mt-1">Active consulting relationships and session history</p>
                </div>

                <div className="space-y-6">
                  {ongoingEngagements.map((expert) => (
                    <div
                      key={expert.expertId}
                      className="border-2 border-green-200 bg-green-50 rounded-2xl overflow-hidden"
                    >
                      {/* Expert Header */}
                      <div className="p-6 border-b-2 border-green-200">
                        <div className="flex items-start gap-4">
                          <Link to={`/profile/${expert.expertId}`}>
                            <img
                              src={expert.expertAvatar}
                              alt={expert.expertName}
                              className="w-16 h-16 rounded-xl border-2 border-white shadow-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            />
                          </Link>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <Link to={`/profile/${expert.expertId}`}>
                                  <h3 className="text-xl font-bold text-[#1B1B1B] hover:text-blue-600 transition-colors cursor-pointer">{expert.expertName}</h3>
                                </Link>
                                <p className="text-sm text-gray-600 mb-2">{expert.expertTitle}</p>
                                <div className="flex items-center gap-1.5 text-sm text-[#2563eb]">
                                  <Briefcase className="w-4 h-4" />
                                  <span className="font-semibold">{expert.requirements.length} Active Requirement{expert.requirements.length !== 1 ? 's' : ''}</span>
                                </div>
                              </div>
                              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                                ACTIVE
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Requirements List */}
                      <div className="divide-y-2 divide-green-200">
                        {expert.requirements.map((requirement) => (
                          <div key={requirement.id} className="p-5 bg-white hover:bg-green-50 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold text-[#1B1B1B] mb-2">{requirement.title}</h4>
                                
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1.5 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>Started {requirement.startDate}</span>
                                  </div>
                                  {requirement.nextMeeting && (
                                    <div className="flex items-center gap-1.5 text-[#2563eb]">
                                      <Clock className="w-4 h-4" />
                                      <span>Next meeting: {requirement.nextMeeting}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <Link
                                to={`/engagements/${requirement.id}`}
                                className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
                              >
                                View Details
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {ongoingEngagements.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#1B1B1B] mb-2">No Ongoing Engagements</h3>
                    <p className="text-gray-600">Your active consulting relationships will appear here</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* EXPERT MODE VIEW */}
        {activeMode === 'expert' && isExpertProfilePublished && hasExpertProfile && (
          <>
            {/* Interactive Stat Cards as Tabs */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <button 
                onClick={() => setExpertActiveSection('requirements')}
                className={`bg-white border-2 rounded-2xl p-4 shadow-sm transition-all cursor-pointer text-left ${
                  expertActiveSection === 'requirements'
                    ? 'border-[#2563eb] shadow-lg ring-4 ring-blue-100'
                    : 'border-gray-200 hover:border-[#2563eb] hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Requirements Received</p>
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-4xl font-bold text-[#1B1B1B]">{requirementsReceived.length} <span className="text-sm text-green-600 font-semibold ml-2">{requirementsReceived.filter(r => r.status === 'pending').length > 0 ? `+${requirementsReceived.filter(r => r.status === 'pending').length}` : ''}</span></p>
              </button>

              <Link 
                to="/active-engagements"
                className={`bg-white border-2 rounded-2xl p-4 shadow-sm transition-all cursor-pointer hover:border-[#2563eb] hover:shadow-md ${
                  expertActiveSection === 'engagements'
                    ? 'border-[#2563eb] shadow-lg ring-4 ring-blue-100'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Active Engagements</p>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-4xl font-bold text-[#1B1B1B]">2 <span className="text-sm text-green-600 font-semibold ml-2">New</span></p>
              </Link>

              <button 
                onClick={() => setExpertActiveSection('profile-views')}
                className={`bg-white border-2 rounded-2xl p-4 shadow-sm transition-all cursor-pointer text-left ${
                  expertActiveSection === 'profile-views'
                    ? 'border-[#2563eb] shadow-lg ring-4 ring-blue-100'
                    : 'border-gray-200 hover:border-[#2563eb] hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Profile Views</p>
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-4xl font-bold text-[#1B1B1B]">127 <span className="text-sm text-green-600 font-semibold ml-2">+12%</span></p>
              </button>
            </div>

            {/* PROFILE VIEWS SECTION */}
            {expertActiveSection === 'profile-views' && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1B1B1B]">Profile Views</h2>
                    <p className="text-sm text-gray-600 mt-1">People who checked out your expert profile</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {profileViews.map((view) => (
                    <Link
                      key={view.id}
                      to={`/profile/${view.userId}`}
                      className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <img
                        src={view.avatar}
                        alt={view.user}
                        className="w-14 h-14 rounded-xl border-2 border-white shadow-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#1B1B1B] truncate">{view.user}</h3>
                        <p className="text-sm text-gray-600 truncate">{view.title}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-500">{view.viewedAt}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-sm text-gray-700">
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">Page 1 of 5</span>
                  <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] font-semibold text-sm">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* REQUIREMENTS RECEIVED SECTION */}
            {expertActiveSection === 'requirements' && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#1B1B1B]">Requirements Received</h2>
                </div>

                {/* Sub-tabs for Pending and Accepted */}
                <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setRequirementsSubTab('pending')}
                    className={`flex-1 px-6 py-2.5 rounded-lg font-semibold transition-all border-2 ${ requirementsSubTab === 'pending' ? 'bg-white text-[#1B1B1B] shadow-md border-[#2563eb]' : 'text-gray-600 hover:text-[#1B1B1B] border-transparent' } text-[16px] font-bold`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setRequirementsSubTab('accepted')}
                    className={`flex-1 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all border-2 ${
                      requirementsSubTab === 'accepted'
                        ? 'bg-white text-[#1B1B1B] shadow-md border-[#2563eb]'
                        : 'text-gray-600 hover:text-[#1B1B1B] border-transparent'
                    }`}
                  >
                    Accepted
                  </button>
                </div>

                {/* Filtered Requirements */}
                <div className="space-y-12">
                  {requirementsReceived
                    .filter(req => req.status === requirementsSubTab)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="rounded-2xl p-5 transition-colors relative"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          {/* Profile Photo */}
                          <Link to={`/profile/${req.userId}`}>
                            <img
                              src={req.userAvatar}
                              alt={req.user}
                              className="w-14 h-14 rounded-xl border-2 border-gray-200 shadow-lg object-cover hover:border-blue-400 transition-all cursor-pointer"
                            />
                          </Link>

                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <div className="flex items-center gap-3">
                                {/* Clickable Name */}
                                <Link 
                                  to={`/profile/${req.userId}`}
                                  className="font-bold text-[#1B1B1B] hover:text-blue-600 transition-colors"
                                >
                                  {req.user}
                                </Link>
                                <span className="text-sm text-gray-600">· {req.company}</span>
                                {req.status === 'accepted' && (
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    Accepted
                                  </span>
                                )}
                                {req.status === 'pending' && (
                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                    Pending
                                  </span>
                                )}
                              </div>
                              
                              {/* Message button - top right */}
                              <Link
                                to="/messages"
                                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 text-sm font-semibold flex items-center gap-2 transition-all"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Message
                              </Link>
                            </div>

                            {/* Show requirement count if multiple */}
                            {req.requirements.length > 1 && (
                              <div className="mb-3">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                                  <FileText className="w-4 h-4" />
                                  {req.requirements.length} Requirements from this person
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* All Requirements - Always Visible */}
                        <div className="mt-4 pt-4 border-t-2 border-gray-200">
                          <div className="space-y-3">
                            {req.requirements.map((subReq) => (
                              <div key={subReq.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
                                {/* NEW Badge on individual requirement */}
                                {subReq.isNew && (
                                  <div className="absolute -top-2 -right-2">
                                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold uppercase shadow-lg animate-pulse">
                                      NEW
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-[#1B1B1B] mb-1">{subReq.title}</h4>
                                    <p className="text-xs text-gray-600 mb-2">{subReq.description}</p>
                                    <p className="text-xs text-gray-500">{subReq.date}</p>
                                  </div>
                                  <Link
                                    to={`/requirements/${subReq.id}`}
                                    className="px-4 py-2 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] text-sm font-bold transition-colors whitespace-nowrap"
                                  >
                                    Review Requirement
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Empty State */}
                {requirementsReceived.filter(req => req.status === requirementsSubTab).length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#1B1B1B] mb-2">
                      No {requirementsSubTab === 'pending' ? 'Pending' : 'Accepted'} Requirements
                    </h3>
                    <p className="text-gray-600">
                      {requirementsSubTab === 'pending' 
                        ? 'New requirements waiting for your review will appear here'
                        : 'Requirements you\'ve accepted will appear here'}
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {requirementsReceived.filter(req => req.status === requirementsSubTab).length > 0 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-sm text-gray-700">
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600">Page 1 of 2</span>
                    <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] font-semibold text-sm">
                      Next
                    </button>
                  </div>
                )}

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-2xl text-sm text-[#1B1B1B]">
                  <strong>💡 Next Step:</strong> After accepting a requirement, suggest 3-5 time slots. The first session is free!
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                to="/requirements"
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:bg-gray-50 hover:border-green-300 transition-all shadow-sm"
              >
                <Mail className="w-8 h-8 text-gray-700 mb-3" />
                <h3 className="font-bold text-base mb-1 text-[#1B1B1B]">Requirements Inbox</h3>
                <p className="text-gray-600 text-sm">Review and respond to incoming requests</p>
              </Link>

              <Link
                to="/profile/setup"
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:bg-gray-50 hover:border-green-300 transition-all shadow-sm"
              >
                <Edit className="w-8 h-8 text-gray-700 mb-3" />
                <h3 className="font-bold text-base mb-1 text-[#1B1B1B]">Edit Profile</h3>
                <p className="text-gray-600 text-sm">Update your expertise and availability</p>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full border-2 border-gray-200 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#1B1B1B] mb-4">Cancel Requirement?</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel this requirement? Both you and the expert will be notified.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
              >
                Keep Requirement
              </button>
              <button
                onClick={() => handleCancelRequirement(showCancelModal)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}