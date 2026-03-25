import { Link } from 'react-router';
import { CheckCircle, ArrowRight, Mail, Repeat, FileText } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';

export function RequirementSent() {
  // Mock data - in real app, this would come from the submission
  const sentRequirement = {
    id: 'req-123',
    title: 'B2B SaaS Growth Strategy',
    sentTo: 8,
    sentAt: new Date().toLocaleString(),
  };

  const savedRequirements = [
    {
      id: 'req-123',
      title: 'B2B SaaS Growth Strategy',
      sentCount: 8,
      createdAt: 'Just now',
      hasAttachments: true,
    },
    {
      id: 'req-122',
      title: 'AI/ML Implementation for Fintech',
      sentCount: 5,
      createdAt: '2 days ago',
      hasAttachments: true,
    },
    {
      id: 'req-121',
      title: 'Product Roadmap Review',
      sentCount: 3,
      createdAt: '1 week ago',
      hasAttachments: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link
            to="/discover"
            className="flex items-center gap-2 text-gray-700 hover:text-[#1B1B1B] transition-colors font-medium"
          >
            Back to Discovery
          </Link>
          <Link to="/" className="flex items-center">
            <img src={logo} alt="ExpertlyYours" className="h-10" />
          </Link>
          <Link to="/dashboard" className="text-gray-700 hover:text-[#1B1B1B] transition-colors font-medium">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Success Message */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#1B1B1B] mb-3">
            Requirement Sent Successfully!
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Your requirement has been shared with <strong>{sentRequirement.sentTo} experts</strong>
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
            <p className="text-sm text-[#1B1B1B]">
              <strong>What happens next:</strong> Experts will review your requirement and respond if they see a good fit. 
              You'll be notified when they respond. This typically takes 1-3 business days.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold"
            >
              <Mail className="w-5 h-5" />
              Discover More Experts
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
            >
              View My Requirements
            </Link>
          </div>
        </div>

        {/* Saved Requirements - Reuse Section */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B1B1B] mb-2">Your Saved Requirements</h2>
            <p className="text-gray-700">
              Reuse any saved requirement to send to additional experts—all details and attachments are preserved.
            </p>
          </div>

          <div className="space-y-3">
            {savedRequirements.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between border-2 border-gray-200 rounded-2xl p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1B1B1B] truncate">{req.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span>Sent to {req.sentCount} experts</span>
                      <span>•</span>
                      <span>{req.createdAt}</span>
                      {req.hasAttachments && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Has attachments
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 ml-4">
                  <Link
                    to={`/requirement/${req.id}/view`}
                    className="px-4 py-2 text-sm border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                  >
                    View
                  </Link>
                  <Link
                    to={`/requirement/${req.id}/reuse`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold"
                  >
                    <Repeat className="w-4 h-4" />
                    Send to More Experts
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4">
            <p className="text-sm text-[#1B1B1B]">
              <strong>💡 Tip:</strong> You can reuse any requirement anytime. Simply go to your bookmarked experts, 
              select the ones you want to send to, and choose an existing requirement. All your text and attachments 
              will be ready to go!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}