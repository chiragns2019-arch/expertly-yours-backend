import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, FileText, User, Calendar, DollarSign, Sparkles, Star, Mail, MessageSquare, Send, CheckCircle, Loader, X } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { toast } from 'sonner@2.0.3';

interface MatchedExpert {
  id: number;
  name: string;
  expertise: string;
  usefulnessScore: number;
  pricing: string;
  matchScore: number;
  matchReason: string;
  pastEngagements: string[];
}

export function AdminRequirementDetail() {
  const { id } = useParams();
  const [selectedExperts, setSelectedExperts] = useState<number[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [messageBody, setMessageBody] = useState('');

  // Mock requirement data
  const requirement = {
    id: parseInt(id || '1'),
    title: 'UI/UX Design for Mobile App',
    submittedBy: 'Sarah Johnson',
    submittedByEmail: 'sarah.johnson@techcorp.com',
    submittedDate: '2026-01-15',
    category: 'UI/UX Design',
    budget: '$15,000',
    timeline: '6-8 weeks',
    status: 'new',
    description: `We're looking for an experienced UI/UX designer to redesign our mobile app. 
    The app is a fitness tracking application with over 100,000 users. We need someone who can:
    
    - Conduct user research and usability testing
    - Create wireframes and high-fidelity mockups
    - Design a cohesive design system
    - Work with our development team for implementation
    
    We're looking for someone with experience in health/fitness apps and a strong portfolio.`,
    requirements: [
      'Minimum 5 years of UI/UX design experience',
      'Portfolio with mobile app projects',
      'Experience with Figma and Adobe Creative Suite',
      'Understanding of iOS and Android design guidelines',
    ],
  };

  // Mock AI-matched experts (sorted by match score)
  const aiMatchedExperts: MatchedExpert[] = [
    {
      id: 1,
      name: 'Dr. Emily Chen',
      expertise: 'UI/UX Design & Product Strategy',
      usefulnessScore: 94,
      pricing: '$200/hour',
      matchScore: 98,
      matchReason: 'Perfect match: 8 years specializing in health & fitness app design. Led redesign of 3 major fitness apps with 1M+ users. Expert in user research and design systems.',
      pastEngagements: [
        'Redesigned FitTrack Pro (500K+ users) - 40% increase in engagement',
        'Led UX for HealthHub Mobile - Featured by Apple',
        'Created design system for Wellness360 app suite',
      ],
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      expertise: 'Mobile UI/UX & User Research',
      usefulnessScore: 91,
      pricing: '$180/hour',
      matchScore: 95,
      matchReason: 'Excellent match: Specialized in mobile app redesigns with focus on user research. 6 years experience, strong portfolio in health tech.',
      pastEngagements: [
        'UX research for MedTrack app - improved retention by 35%',
        'Redesigned nutrition tracking interface for NutriPlan',
        'Conducted usability studies for 5+ health apps',
      ],
    },
    {
      id: 3,
      name: 'Jennifer Park',
      expertise: 'UI/UX Design & Design Systems',
      usefulnessScore: 89,
      pricing: '$175/hour',
      matchScore: 92,
      matchReason: 'Strong match: Expert in creating scalable design systems. 7 years experience with mobile apps, certified in both iOS and Android design.',
      pastEngagements: [
        'Built design system for SportsPro app family',
        'Led mobile redesign for ActiveLife (200K users)',
        'Designed onboarding flows that improved conversion by 45%',
      ],
    },
    {
      id: 4,
      name: 'David Thompson',
      expertise: 'Product Design & Mobile UX',
      usefulnessScore: 87,
      pricing: '$165/hour',
      matchScore: 88,
      matchReason: 'Good match: Strong mobile design background. 5 years experience, portfolio includes 2 fitness apps.',
      pastEngagements: [
        'Designed RunMate fitness tracking app',
        'UX consultation for YogaFlow mobile',
        'Created wireframes for wellness platform',
      ],
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      expertise: 'UI Design & Visual Design',
      usefulnessScore: 85,
      pricing: '$150/hour',
      matchScore: 84,
      matchReason: 'Moderate match: Strong visual design skills. Less experience in user research but excellent portfolio in mobile UI.',
      pastEngagements: [
        'Visual design for productivity apps',
        'Created UI mockups for 10+ mobile projects',
        'Designed app icons and branding',
      ],
    },
  ];

  const handleToggleExpert = (expertId: number) => {
    setSelectedExperts(prev => 
      prev.includes(expertId) 
        ? prev.filter(id => id !== expertId)
        : [...prev, expertId]
    );
  };

  const handleOpenModal = () => {
    // Auto-generate content when opening modal
    const defaultSubject = `Expert Recommendations for "${requirement.title}"`;
    const defaultEmail = generateDefaultEmailBody();
    const defaultMessage = generateDefaultMessage();
    
    setEmailSubject(defaultSubject);
    setEmailBody(defaultEmail);
    setMessageBody(defaultMessage);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSendRecommendations = async () => {
    if (selectedExperts.length === 0) {
      toast.error('Please select at least one expert to recommend');
      return;
    }

    if (!emailSubject || !emailBody || !messageBody) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSending(true);
    
    // Simulate API call - sends BOTH email and in-app message
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`✅ Email sent to ${requirement.submittedByEmail}`);
    toast.success(`✅ In-app message sent to ${requirement.submittedBy}`);
    
    setIsSending(false);
    setIsModalOpen(false);
    setEmailSubject('');
    setEmailBody('');
    setMessageBody('');
    setSelectedExperts([]);
  };

  const generateDefaultEmailBody = () => {
    const experts = aiMatchedExperts.filter(e => selectedExperts.includes(e.id));
    return `Hi ${requirement.submittedBy},\n\nBased on your requirement "${requirement.title}", our AI has identified ${experts.length} highly qualified expert${experts.length > 1 ? 's' : ''} who would be perfect for your project:\n\n${experts.map((e, i) => 
      `${i + 1}. ${e.name} - ${e.expertise}\n   Match Score: ${e.matchScore}%\n   ${e.matchReason}\n   View profile: https://expertlyyours.com/profile/${e.id}`
    ).join('\n\n')}\n\nWe recommend reaching out to these experts through the platform.\n\nBest regards,\nExpertlyYours Admin Team`;
  };

  const generateDefaultMessage = () => {
    const experts = aiMatchedExperts.filter(e => selectedExperts.includes(e.id));
    return `Hi ${requirement.submittedBy}! 👋\n\nGreat news! Our AI has found ${experts.length} perfect match${experts.length > 1 ? 'es' : ''} for your "${requirement.title}" requirement.\n\n${experts.map((e, i) => 
      `${i + 1}. ${e.name} (${e.matchScore}% match)\n   ${e.expertise}`
    ).join('\n\n')}\n\nCheck them out on your dashboard and send your requirements!`;
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
              to="/admin/requirements-list"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Requirements
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

      {/* Sticky "Send Message" Button */}
      {selectedExperts.length > 0 && (
        <div className="sticky top-0 z-40 bg-white border-b-2 border-blue-500 shadow-lg">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-bold text-gray-900">
                    {selectedExperts.length} Expert{selectedExperts.length > 1 ? 's' : ''} Selected
                  </p>
                  <p className="text-sm text-gray-600">
                    Ready to send to {requirement.submittedBy}
                  </p>
                </div>
              </div>
              <button
                onClick={handleOpenModal}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Send className="w-5 h-5" />
                Send Message to {requirement.submittedBy}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin/requirements-list" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Requirements List
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Requirement Details & AI Matching</h1>
          <p className="text-gray-600">Select experts and send recommendations to {requirement.submittedBy}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Requirement Details */}
          <div className="md:col-span-1 space-y-6">
            {/* Requirement Info */}
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Requirement
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Title</p>
                  <p className="font-medium text-gray-900">{requirement.title}</p>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Submitted By (Needs Experts)</p>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">{requirement.submittedBy}</span>
                  </div>
                  <p className="text-xs text-gray-700">{requirement.submittedByEmail}</p>
                </div>
                <div className="h-px bg-gray-200" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Category</p>
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {requirement.category}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Budget</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900">{requirement.budget}</span>
                  </div>
                </div>
                <div className="h-px bg-gray-200" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Timeline</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">{requirement.timeline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{requirement.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
              <ul className="space-y-2">
                {requirement.requirements.map((req, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - AI Matches */}
          <div className="md:col-span-2 space-y-6">
            {/* AI Matching Header */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">AI-Matched Experts</h2>
              </div>
              <p className="text-sm text-gray-700">
                Select experts to recommend to {requirement.submittedBy}. Our AI has ranked them by compatibility.
              </p>
            </div>

            {/* Matched Experts List */}
            <div className="space-y-4">
              {aiMatchedExperts.map((expert) => (
                <div
                  key={expert.id}
                  className={`bg-white border-2 rounded-lg p-6 transition-all cursor-pointer ${
                    selectedExperts.includes(expert.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                  onClick={() => handleToggleExpert(expert.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{expert.name}</h3>
                        <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 rounded-full">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-bold text-purple-900">{expert.matchScore}% Match</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{expert.expertise}</p>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-gray-900">{expert.usefulnessScore}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-gray-900">{expert.pricing}</span>
                        </div>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold text-purple-900">AI Analysis: </span>
                          {expert.matchReason}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Relevant Experience</p>
                        {expert.pastEngagements.map((engagement, idx) => (
                          <p key={idx} className="text-sm text-gray-700 flex items-start gap-2 mb-1">
                            <span className="text-blue-600">•</span>
                            {engagement}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        checked={selectedExperts.includes(expert.id)}
                        onChange={() => handleToggleExpert(expert.id)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Send Expert Recommendations</h2>
                <p className="text-sm text-gray-600 mt-1">
                  To: {requirement.submittedBy} ({requirement.submittedByEmail})
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Selected Experts Summary */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {selectedExperts.length} Expert{selectedExperts.length > 1 ? 's' : ''} Selected
                </h3>
                <div className="flex flex-wrap gap-2">
                  {aiMatchedExperts
                    .filter(e => selectedExperts.includes(e.id))
                    .map(expert => (
                      <span key={expert.id} className="px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-sm font-medium">
                        {expert.name} ({expert.matchScore}%)
                      </span>
                    ))}
                </div>
              </div>

              {/* Email Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Email Content</h3>
                </div>
                <input
                  type="text"
                  placeholder="Email subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Email body"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              <div className="h-px bg-gray-200" />

              {/* In-App Message Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">In-App Message Content</h3>
                </div>
                <textarea
                  placeholder="Message body"
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Clicking "Send" will send BOTH the email to {requirement.submittedByEmail} and the in-app message to {requirement.submittedBy}'s inbox.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                disabled={isSending}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const defaultSubject = `Expert Recommendations for "${requirement.title}"`;
                  const defaultEmail = generateDefaultEmailBody();
                  const defaultMessage = generateDefaultMessage();
                  setEmailSubject(defaultSubject);
                  setEmailBody(defaultEmail);
                  setMessageBody(defaultMessage);
                }}
                disabled={isSending}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Regenerate Content
              </button>
              <button
                onClick={handleSendRecommendations}
                disabled={isSending || !emailSubject || !emailBody || !messageBody}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Both Email & Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
