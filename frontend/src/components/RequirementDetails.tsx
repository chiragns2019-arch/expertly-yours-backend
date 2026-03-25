import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { CheckCircle, XCircle, MessageSquare, Calendar, Clock, Building2, DollarSign } from 'lucide-react';
import { PostLoginNav } from './PostLoginNav';
import { api } from '../services/api';

type RequirementStatus = 'pending' | 'accepted' | 'rejected';

interface Requirement {
  id: string;
  userName: string;
  companyName: string;
  companyStage: string;
  problemDescription: string;
  timeCommitment: string;
  offerType: string;
  offerDetails: string;
  additionalContext: string;
  submittedAt: string;
  status: RequirementStatus;
}

export function RequirementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineNote, setDeclineNote] = useState('');
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(`/requirements/${id}`);
        setRequirement({
          id: data.id,
          userName: data.seeker?.name || 'Unknown',
          companyName: data.companyName,
          companyStage: data.companyStage,
          problemDescription: data.problemDescription,
          timeCommitment: data.timeCommitment,
          offerType: data.offerType,
          offerDetails: data.offerDetails,
          additionalContext: data.additionalContext,
          submittedAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A',
          status: 'pending' // Default viewing status
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchRequirement();
  }, [id]);

  const handleAccept = async () => {
    try {
      await api.patch(`/requirements/${id}/respond`, { status: 'accepted' });
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('Failed to accept requirement');
    }
  };

  const handleScheduleMeeting = () => {
    navigate(`/schedule-meeting/${id}`);
  };

  const handleMessage = () => {
    navigate('/messages');
  };

  const handleDecline = async () => {
    try {
      await api.patch(`/requirements/${id}/respond`, { status: 'rejected', rejectionNote: declineNote });
      setShowDeclineModal(false);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('Failed to decline requirement');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <PostLoginNav />

      <div className="max-w-4xl mx-auto px-8 py-10 pt-24">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#2563eb] mb-6 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        {/* Main Content Card */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : requirement ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{requirement.userName}</h1>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                Pending Review
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{requirement.companyName}</span>
              <span className="text-gray-400">•</span>
              <span>{requirement.companyStage}</span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Submitted {requirement.submittedAt}
            </p>
          </div>

          {/* Problem Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Problem Statement</h2>
            <p className="text-gray-700 leading-relaxed">{requirement.problemDescription}</p>
          </div>

          {/* Engagement Details */}
          <div className="mb-8 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1.5">Time Commitment</h3>
              <p className="text-gray-900">{requirement.timeCommitment}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1.5">Compensation</h3>
              <p className="text-gray-900">{requirement.offerDetails}</p>
            </div>
          </div>

          {/* Additional Context */}
          {requirement.additionalContext && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Additional Context</h2>
              <p className="text-gray-700 leading-relaxed">{requirement.additionalContext}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAccept}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                Accept Requirement
              </button>

              <button
                onClick={handleScheduleMeeting}
                className="flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium"
              >
                <Calendar className="w-5 h-5" />
                Schedule Meeting
              </button>

              <button
                onClick={handleMessage}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                <MessageSquare className="w-5 h-5" />
                Send Message
              </button>

              <button
                onClick={() => setShowDeclineModal(true)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <XCircle className="w-5 h-5" />
                Decline
              </button>
            </div>
          </div>
        </div>
        ) : (
          <div className="text-center py-12 text-gray-500">Requirement not found</div>
        )}
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Decline Requirement</h3>
            <p className="text-gray-600 mb-4">
              Optionally add a brief note explaining why you're declining this requirement.
            </p>
            <textarea
              value={declineNote}
              onChange={(e) => setDeclineNote(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2563eb] mb-4"
              placeholder="Brief explanation (optional)"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDecline}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Confirm Decline
              </button>
              <button
                onClick={() => setShowDeclineModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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