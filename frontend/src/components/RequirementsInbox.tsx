import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Mail, CheckCircle, XCircle, Clock, Eye, FileText, MessageSquare, Calendar } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
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

export function RequirementsInbox() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInbox = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/requirements/inbox');
      const mapped = data.map((req: any) => ({
        ...req,
        submittedAt: new Date(req.submittedAt).toLocaleDateString(),
      }));
      setRequirements(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const bookingEnabled = false; // Mock - whether user has booking enabled

  const handleAccept = async (requirementId: string) => {
    try {
      await api.patch(`/requirements/${requirementId}/respond`, { status: 'accepted' });
      setRequirements(requirements.map(r => 
        r.id === requirementId ? { ...r, status: 'accepted' } : r
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setSelectedRequirement(null);
    }
  };

  const handleReject = async (requirementId: string) => {
    try {
      await api.patch(`/requirements/${requirementId}/respond`, { status: 'rejected', rejectionNote });
      setRequirements(requirements.map(r => 
        r.id === requirementId ? { ...r, status: 'rejected' } : r
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setRejectionNote('');
      setSelectedRequirement(null);
    }
  };

  const pendingRequirements = requirements.filter(r => r.status === 'pending');
  const reviewedRequirements = requirements.filter(r => r.status !== 'pending');

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Navigation */}
      <PostLoginNav />

      <div className="max-w-7xl mx-auto px-8 py-10 pt-24">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#2563eb] mb-4 transition-colors"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Requirements Inbox</h1>
          <p className="text-gray-600">Review and respond to incoming requirements</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingRequirements.length}</p>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Accepted</p>
            <p className="text-3xl font-bold text-green-600">
              {requirements.filter(r => r.status === 'accepted').length}
            </p>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Received</p>
            <p className="text-3xl font-bold text-gray-900">{requirements.length}</p>
          </div>
        </div>

        {/* Pending Requirements */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : pendingRequirements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Review</h2>
            <div className="space-y-4">
              {pendingRequirements.map((requirement) => (
                <div
                  key={requirement.id}
                  className="bg-white border-2 border-yellow-300 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{requirement.userName}</h3>
                        <span className="text-gray-600">·</span>
                        <span className="text-gray-700">{requirement.companyName}</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-sm">
                          {requirement.companyStage}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{requirement.submittedAt}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Problem</h4>
                      <p className="text-gray-900">{requirement.problemDescription}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Time Commitment</h4>
                        <p className="text-gray-900">{requirement.timeCommitment}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Offer Type</h4>
                        <p className="text-gray-900">{requirement.offerType}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Offer Details</h4>
                      <p className="text-gray-900">{requirement.offerDetails}</p>
                    </div>

                    {requirement.additionalContext && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Additional Context</h4>
                        <p className="text-gray-900">{requirement.additionalContext}</p>
                      </div>
                    )}
                  </div>

                  {selectedRequirement?.id === requirement.id ? (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Optional: Add a note (for rejection)
                      </h4>
                      <textarea
                        value={rejectionNote}
                        onChange={(e) => setRejectionNote(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-4"
                        placeholder="Brief explanation (optional)"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAccept(requirement.id)}
                          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(requirement.id)}
                          className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </button>
                        <button
                          onClick={() => setSelectedRequirement(null)}
                          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedRequirement(requirement)}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviewed Requirements */}
        {reviewedRequirements.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Previously Reviewed</h2>
            <div className="space-y-4">
              {reviewedRequirements.map((requirement) => (
                <div
                  key={requirement.id}
                  className="bg-white border border-gray-300 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{requirement.userName}</h3>
                        <span className="text-gray-600">·</span>
                        <span className="text-gray-700">{requirement.companyName}</span>
                        {requirement.status === 'accepted' && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            ✓ Accepted
                          </span>
                        )}
                        {requirement.status === 'rejected' && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            ✕ Declined
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{requirement.problemDescription}</p>
                      <p className="text-sm text-gray-500">{requirement.submittedAt}</p>
                    </div>
                  </div>
                  {requirement.status === 'accepted' && (
                    <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded">
                      {bookingEnabled ? (
                        <div className="flex items-start gap-2">
                          <Calendar className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-green-900">
                            <strong>Booking unlocked:</strong> User can now book time on your calendar.
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-green-900">
                          <strong>Requirement accepted:</strong> User has been notified. Coordinate next steps directly.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}