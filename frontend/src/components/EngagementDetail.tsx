import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ChevronRight, Calendar, Clock, Phone, Video, MessageSquare, Users, Plus, Edit2, Trash2, MapPin, CheckCircle, X, Briefcase, Search, FileText, Code } from 'lucide-react';
import { PostLoginNav } from './PostLoginNav';

type CommunicationMedium = 'online-meeting' | 'calls' | 'messaging' | 'in-person' | 'none';
type WorkType = 'meeting' | 'research' | 'work-time' | 'documentation';

interface Interaction {
  id: string;
  workType: WorkType;
  communicationMedium?: CommunicationMedium;
  date: string;
  duration: number; // in minutes
  notes: string;
  addedBy: 'expert' | 'founder';
  billable: boolean;
  location?: string;
  deliverables?: string; // For work-time type
}

export function EngagementDetail() {
  const { engagementId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInteraction, setNewInteraction] = useState<Partial<Interaction>>({
    workType: 'meeting',
    communicationMedium: 'online-meeting',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    notes: '',
    billable: true,
  });

  // Simple role checking mechanism
  // In production, this would come from your auth system
  const currentUserRole: 'expert' | 'founder' = 'expert'; // Change to 'founder' to test founder view

  // Mock data - in production this would come from API
  const engagement = {
    id: engagementId,
    title: 'Go-to-market strategy for enterprise customers',
    description: 'Looking for expertise in positioning, pricing, and sales enablement for our B2B SaaS product targeting enterprise customers.',
    expertName: 'Dr. Jane Smith',
    expertTitle: 'B2B SaaS Growth Strategist',
    expertAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    expertId: 'expert-1',
    startDate: '2024-02-05',
    status: 'active',
    totalBillableHours: 12.5,
    hourlyRate: 250,
  };

  const [interactions, setInteractions] = useState<Interaction[]>([
    {
      id: 'int-001',
      workType: 'meeting',
      communicationMedium: 'online-meeting',
      date: '2024-02-05',
      duration: 60,
      notes: 'Initial consultation - discussed current GTM challenges, identified key pain points in enterprise sales process',
      addedBy: 'expert',
      billable: true,
    },
    {
      id: 'int-002',
      workType: 'research',
      date: '2024-02-06',
      duration: 120,
      notes: 'Market research and competitive analysis - analyzed 15 competitors, created positioning matrix and identified key differentiators',
      addedBy: 'expert',
      billable: true,
    },
    {
      id: 'int-003',
      workType: 'meeting',
      communicationMedium: 'online-meeting',
      date: '2024-02-08',
      duration: 90,
      notes: 'Deep dive into positioning strategy - reviewed competitive landscape and value proposition',
      addedBy: 'expert',
      billable: true,
    },
    {
      id: 'int-004',
      workType: 'work-time',
      date: '2024-02-09',
      duration: 240,
      notes: 'Created comprehensive GTM strategy document with positioning, messaging, and go-to-market plan',
      addedBy: 'expert',
      billable: true,
      deliverables: 'GTM Strategy Document (32 pages)',
    },
    {
      id: 'int-005',
      workType: 'meeting',
      communicationMedium: 'calls',
      date: '2024-02-10',
      duration: 30,
      notes: 'Urgent call regarding upcoming investor meeting - quick prep on key messaging',
      addedBy: 'expert',
      billable: true,
    },
    {
      id: 'int-006',
      workType: 'meeting',
      communicationMedium: 'in-person',
      date: '2024-02-12',
      duration: 120,
      notes: 'Workshop with sales team - hands-on training on new positioning and sales enablement materials',
      addedBy: 'expert',
      billable: true,
      location: 'Client Office, Downtown SF',
    },
    {
      id: 'int-007',
      workType: 'work-time',
      date: '2024-02-13',
      duration: 180,
      notes: 'Designed sales enablement materials including pitch deck template, one-pagers, and battlecards',
      addedBy: 'expert',
      billable: true,
      deliverables: 'Sales enablement kit (Pitch deck, 3 one-pagers, 5 battlecards)',
    },
    {
      id: 'int-008',
      workType: 'meeting',
      communicationMedium: 'messaging',
      date: '2024-02-14',
      duration: 20,
      notes: 'Quick check-in on implementation progress',
      addedBy: 'expert',
      billable: false,
    },
    {
      id: 'int-009',
      workType: 'documentation',
      date: '2024-02-16',
      duration: 90,
      notes: 'Created implementation guide and training materials for sales team onboarding',
      addedBy: 'expert',
      billable: true,
      deliverables: 'Implementation guide and training docs',
    },
    {
      id: 'int-010',
      workType: 'meeting',
      communicationMedium: 'online-meeting',
      date: '2024-02-17',
      duration: 75,
      notes: 'Review session - analyzed early results from new positioning, adjusted messaging for specific verticals',
      addedBy: 'expert',
      billable: true,
    },
    {
      id: 'int-011',
      workType: 'meeting',
      communicationMedium: 'online-meeting',
      date: '2024-02-19',
      duration: 45,
      notes: 'Final review and next steps planning',
      addedBy: 'expert',
      billable: true,
    },
  ]);

  const getWorkTypeIcon = (workType: WorkType) => {
    switch (workType) {
      case 'meeting':
        return <Users className="w-5 h-5" />;
      case 'research':
        return <Search className="w-5 h-5" />;
      case 'work-time':
        return <Code className="w-5 h-5" />;
      case 'documentation':
        return <FileText className="w-5 h-5" />;
    }
  };

  const getWorkTypeLabel = (workType: WorkType) => {
    const labels: Record<WorkType, string> = {
      'meeting': 'Meeting/Discussion',
      'research': 'Research',
      'work-time': 'Work Time',
      'documentation': 'Documentation',
    };
    return labels[workType];
  };

  const getInteractionIcon = (workType: WorkType, communicationMedium?: CommunicationMedium) => {
    // For meetings, show communication medium icon
    if (workType === 'meeting' && communicationMedium) {
      switch (communicationMedium) {
        case 'online-meeting':
          return <Video className="w-5 h-5" />;
        case 'calls':
          return <Phone className="w-5 h-5" />;
        case 'messaging':
          return <MessageSquare className="w-5 h-5" />;
        case 'in-person':
          return <Users className="w-5 h-5" />;
      }
    }
    // For other work types, show work type icon
    return getWorkTypeIcon(workType);
  };

  const getInteractionLabel = (communicationMedium?: CommunicationMedium) => {
    const labels: Record<CommunicationMedium, string> = {
      'online-meeting': 'Online Meeting',
      'calls': 'Call',
      'messaging': 'Message',
      'in-person': 'In-Person',
      'none': 'None',
    };
    return labels[communicationMedium || 'none'];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const totalBillableMinutes = interactions
    .filter(int => int.billable)
    .reduce((sum, int) => sum + int.duration, 0);

  const handleAddInteraction = () => {
    const interaction: Interaction = {
      id: `int-${Date.now()}`,
      workType: newInteraction.workType as WorkType,
      communicationMedium: newInteraction.communicationMedium,
      date: newInteraction.date || new Date().toISOString().split('T')[0],
      duration: newInteraction.duration || 60,
      notes: newInteraction.notes || '',
      addedBy: 'expert',
      billable: newInteraction.billable ?? true,
      location: newInteraction.location,
      deliverables: newInteraction.deliverables,
    };
    
    setInteractions([...interactions, interaction]);
    setShowAddModal(false);
    setNewInteraction({
      workType: 'meeting',
      communicationMedium: 'online-meeting',
      date: new Date().toISOString().split('T')[0],
      duration: 60,
      notes: '',
      billable: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <PostLoginNav />
      
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/dashboard" className="hover:text-[#2563eb]">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/active-engagements" className="hover:text-[#2563eb]">Active Engagements</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1B1B1B]">Engagement Details</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-6">
            <img 
              src={engagement.expertAvatar} 
              alt={engagement.expertName}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-[#1B1B1B] mb-2">{engagement.title}</h1>
              <p className="text-gray-600 mb-4">{engagement.description}</p>
              
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Expert</div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1B1B1B]">{engagement.expertName}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{engagement.expertTitle}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Start Date</div>
                  <div className="font-semibold text-[#1B1B1B]">{formatDate(engagement.startDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    Active
                  </span>
                </div>
              </div>
            </div>
            
            <Link 
              to={`/profile/${engagement.expertId}`}
              className="px-4 py-2 border-2 border-[#2563eb] text-[#2563eb] rounded-lg hover:bg-[#2563eb] hover:text-white transition-colors text-sm font-semibold"
            >
              View Profile
            </Link>
          </div>
        </div>

        {/* Billing Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#2563eb]" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Billable Time</div>
                <div className="text-2xl font-bold text-[#1B1B1B]">{formatDuration(totalBillableMinutes)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Hourly Rate</div>
                <div className="text-2xl font-bold text-[#1B1B1B]">${engagement.hourlyRate}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Billable</div>
                <div className="text-2xl font-bold text-[#1B1B1B]">
                  ${((totalBillableMinutes / 60) * engagement.hourlyRate).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction Log */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#1B1B1B] mb-1">Interaction Log</h2>
                <p className="text-sm text-gray-600">Complete history of all touchpoints and meetings</p>
              </div>
              {currentUserRole === 'expert' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Log Interaction
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Timeline */}
            <div className="space-y-6">
              {interactions.map((interaction, index) => (
                <div key={interaction.id} className="flex gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      interaction.billable ? 'bg-blue-100 text-[#2563eb]' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {getInteractionIcon(interaction.workType, interaction.communicationMedium)}
                    </div>
                    {index < interactions.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 my-2 flex-1 min-h-[40px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-[#1B1B1B]">
                            {getWorkTypeLabel(interaction.workType)}
                            {interaction.workType === 'meeting' && interaction.communicationMedium && (
                              <span className="text-gray-500"> • {getInteractionLabel(interaction.communicationMedium)}</span>
                            )}
                          </h4>
                          {interaction.billable && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">
                              Billable
                            </span>
                          )}
                        </div>
                        <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(interaction.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDuration(interaction.duration)}
                          </span>
                          {interaction.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {interaction.location}
                            </span>
                          )}
                        </div>
                        {interaction.deliverables && (
                          <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-xs text-blue-600 font-semibold mb-1">Deliverables:</div>
                            <div className="text-sm text-blue-900">{interaction.deliverables}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mt-2">{interaction.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Interaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-bold text-[#1B1B1B]">Log New Interaction</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Work Type */}
              <div>
                <label className="block text-sm font-semibold text-[#2563eb] mb-3">
                  Work Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'meeting', label: 'Meeting/Discussion', icon: Users, description: 'Calls, meetings, or discussions' },
                    { value: 'research', label: 'Research', icon: Search, description: 'Research and analysis work' },
                    { value: 'work-time', label: 'Work Time', icon: Code, description: 'Actual deliverables (design, code, etc.)' },
                    { value: 'documentation', label: 'Documentation', icon: FileText, description: 'Writing docs, reports, etc.' },
                  ].map(({ value, label, icon: Icon, description }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setNewInteraction({ ...newInteraction, workType: value as WorkType })}
                      className={`p-4 border-2 rounded-xl transition-all text-left ${
                        newInteraction.workType === value
                          ? 'border-[#A8FF36] bg-[#A8FF36]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-[#1B1B1B]" />
                        <span className="font-semibold text-[#1B1B1B]">{label}</span>
                      </div>
                      <p className="text-xs text-gray-600">{description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Communication Medium (only for Meeting type) */}
              {newInteraction.workType === 'meeting' && (
                <div>
                  <label className="block text-sm font-semibold text-[#2563eb] mb-3">
                    Communication Medium *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'online-meeting', label: 'Online Meeting', icon: Video, description: 'Google Meet, Zoom, etc.' },
                      { value: 'calls', label: 'Calls', icon: Phone, description: 'Phone or WhatsApp call' },
                      { value: 'messaging', label: 'Messaging', icon: MessageSquare, description: 'WhatsApp, Email, Slack' },
                      { value: 'in-person', label: 'In-Person', icon: Users, description: 'Face-to-face meeting' },
                    ].map(({ value, label, icon: Icon, description }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setNewInteraction({ ...newInteraction, communicationMedium: value as CommunicationMedium })}
                        className={`p-4 border-2 rounded-xl transition-all text-left ${
                          newInteraction.communicationMedium === value
                            ? 'border-[#A8FF36] bg-[#A8FF36]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <Icon className="w-5 h-5 text-[#1B1B1B]" />
                          <span className="font-semibold text-[#1B1B1B]">{label}</span>
                        </div>
                        <p className="text-xs text-gray-600">{description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverables (only for work-time type) */}
              {newInteraction.workType === 'work-time' && (
                <div>
                  <label className="block text-sm font-semibold text-[#2563eb] mb-2">
                    Deliverables *
                  </label>
                  <input
                    type="text"
                    value={newInteraction.deliverables || ''}
                    onChange={(e) => setNewInteraction({ ...newInteraction, deliverables: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent"
                    placeholder="e.g., Logo design, Landing page mockup, Strategy document"
                  />
                </div>
              )}

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-[#2563eb] mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={newInteraction.date}
                  onChange={(e) => setNewInteraction({ ...newInteraction, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-[#2563eb] mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={newInteraction.duration}
                  onChange={(e) => setNewInteraction({ ...newInteraction, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent"
                  placeholder="60"
                  min="1"
                />
              </div>

              {/* Location (for in-person) */}
              {newInteraction.communicationMedium === 'in-person' && (
                <div>
                  <label className="block text-sm font-semibold text-[#2563eb] mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newInteraction.location || ''}
                    onChange={(e) => setNewInteraction({ ...newInteraction, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent"
                    placeholder="Meeting location"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-[#2563eb] mb-2">
                  Notes *
                </label>
                <textarea
                  value={newInteraction.notes}
                  onChange={(e) => setNewInteraction({ ...newInteraction, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent resize-none"
                  rows={4}
                  placeholder="What was discussed during this interaction?"
                />
              </div>

              {/* Billable Toggle */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="billable"
                  checked={newInteraction.billable}
                  onChange={(e) => setNewInteraction({ ...newInteraction, billable: e.target.checked })}
                  className="w-5 h-5 accent-[#A8FF36]"
                />
                <label htmlFor="billable" className="text-sm text-gray-700">
                  This interaction is billable
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInteraction}
                disabled={!newInteraction.notes || !newInteraction.date}
                className="flex-1 px-4 py-3 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Interaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}