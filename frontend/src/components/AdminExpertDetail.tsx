import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, ExternalLink, Mail, Calendar, Briefcase, Award, Clock } from 'lucide-react';

type ExpertStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export function AdminExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [suspendReason, setSuspendReason] = useState('');

  // Mock expert data
  const expert = {
    id: 'exp-1',
    name: 'Dr. Rachel Kim',
    email: 'rachel.kim@example.com',
    expertise: 'B2B SaaS Growth Strategy & Product-Market Fit',
    experience: '12 years',
    status: 'pending' as ExpertStatus,
    submittedAt: '2024-01-28 14:30',
    bio: 'Strategic growth advisor with 12+ years helping B2B SaaS companies scale from $1M to $50M+ ARR. Former VP of Growth at three unicorn startups. Expertise in product-market fit validation, growth team structure, and data-driven experimentation.',
    pastEngagements: [
      'Led growth team at Acme SaaS (Series B to $50M ARR)',
      'Advisor to 8 Y Combinator startups',
      'Scaled user acquisition 10x at TechCorp in 18 months',
      'Built and managed 15-person growth team at StartupXYZ',
    ],
    scaleIndicators: [
      'Scaled 3+ companies to $10M+ ARR',
      'Built teams of 10+ people',
      'Raised Series B+ funding',
      'International market expansion',
    ],
    engagementTypes: [
      'Advisory (ongoing)',
      'One-time consultation',
      'Project-based work',
    ],
    pricing: '$400/hour',
    minimumCommitment: '3 sessions',
    linkedinUrl: 'https://linkedin.com/in/rachelkim',
    websiteUrl: 'https://rachelkim.com',
    showPricing: true,
    requirePitch: true,
    totalRequirements: 0,
    acceptanceRate: 0,
  };

  const handleApprove = () => {
    // TODO: API call to approve expert
    console.log('Approving expert:', id);
    setShowApproveModal(false);
    navigate('/admin/experts?filter=approved');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    // TODO: API call to reject expert
    console.log('Rejecting expert:', id, 'Reason:', rejectReason);
    setShowRejectModal(false);
    navigate('/admin/experts?filter=rejected');
  };

  const handleSuspend = () => {
    if (!suspendReason.trim()) {
      alert('Please provide a reason for suspension');
      return;
    }
    // TODO: API call to suspend expert
    console.log('Suspending expert:', id, 'Reason:', suspendReason);
    setShowSuspendModal(false);
    navigate('/admin/experts?filter=suspended');
  };

  const handleUnsuspend = () => {
    // TODO: API call to unsuspend expert
    console.log('Unsuspending expert:', id);
    navigate('/admin/experts?filter=approved');
  };

  const getStatusBadge = (status: ExpertStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Approval
          </span>
        );
      case 'approved':
        return (
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approved
          </span>
        );
      case 'suspended':
        return (
          <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Suspended
          </span>
        );
      case 'rejected':
        return (
          <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/experts" className="flex items-center gap-2 text-gray-300 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              Back to List
            </Link>
            <span className="text-gray-600">|</span>
            <span className="text-lg">Expert Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-semibold">
              A
            </div>
            <span className="text-sm">Admin</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Status and Actions */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Expert Profile Review</h1>
              {getStatusBadge(expert.status)}
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
            <Calendar className="w-4 h-4" />
            <span>Submitted: {expert.submittedAt}</span>
          </div>

          {/* Action Buttons */}
          {expert.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Profile
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                <XCircle className="w-5 h-5" />
                Reject Profile
              </button>
            </div>
          )}

          {expert.status === 'approved' && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowSuspendModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                <AlertTriangle className="w-5 h-5" />
                Suspend Profile
              </button>
              <Link
                to={`/profile/${expert.id}`}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                View Public Profile
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          )}

          {expert.status === 'suspended' && (
            <div className="flex gap-3">
              <button
                onClick={handleUnsuspend}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                Unsuspend Profile
              </button>
            </div>
          )}
        </div>

        {/* Expert Details */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{expert.name}</h2>
            <p className="text-xl text-gray-700 mb-3">{expert.expertise}</p>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${expert.email}`} className="hover:text-blue-600">
                  {expert.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{expert.experience} experience</span>
              </div>
            </div>
          </div>

          {/* External Links */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex gap-4">
              {expert.linkedinUrl && (
                <a
                  href={expert.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  LinkedIn Profile
                </a>
              )}
              {expert.websiteUrl && (
                <a
                  href={expert.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Personal Website
                </a>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Professional Background</h3>
            <p className="text-gray-700 leading-relaxed">{expert.bio}</p>
          </div>

          {/* Past Engagements */}
          {expert.pastEngagements && expert.pastEngagements.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Past Experience</h3>
              <ul className="space-y-2">
                {expert.pastEngagements.map((engagement, idx) => (
                  <li key={idx} className="text-gray-700 flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span>{engagement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Scale Indicators */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Scale Indicators</h3>
            <div className="flex flex-wrap gap-2">
              {expert.scaleIndicators.map((indicator) => (
                <span
                  key={indicator}
                  className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  ✓ {indicator}
                </span>
              ))}
            </div>
          </div>

          {/* Engagement Types */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Open to</h3>
            <div className="flex flex-wrap gap-2">
              {expert.engagementTypes.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing */}
          {expert.showPricing && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
              <p className="text-gray-900 font-semibold mb-1">{expert.pricing}</p>
              <p className="text-sm text-gray-600">Minimum: {expert.minimumCommitment}</p>
            </div>
          )}
        </div>

        {/* Admin Notes Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Admin Review Checklist</h3>
          <div className="space-y-2 text-sm text-blue-900">
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>Verified LinkedIn profile exists and matches provided information</span>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>Experience claims are credible and verifiable</span>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>Expertise area is specific and well-defined (not too generic)</span>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>Past engagements show genuine expertise and scale</span>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>No red flags in online presence or reputation</span>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>Pricing is reasonable for the expertise level</span>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Approve Expert Profile</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to approve <strong>{expert.name}</strong>? 
              Their profile will be published and visible to all users on the platform.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
              >
                Approve
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Reject Expert Profile</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Please provide a reason for rejecting <strong>{expert.name}</strong>'s application. 
              This will be sent to the applicant.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g., Expertise area too generic, insufficient verifiable experience, LinkedIn profile doesn't match claims..."
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-500 mb-4"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
              >
                Reject
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Suspend Expert Profile</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Suspending <strong>{expert.name}</strong> will immediately hide their profile from the platform 
              and prevent them from receiving new requirements. Please provide a detailed reason.
            </p>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="E.g., Multiple complaints about unprofessional behavior, missed sessions without notice, policy violations..."
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-500 mb-4"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSuspend}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
              >
                Suspend
              </button>
              <button
                onClick={() => setShowSuspendModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
