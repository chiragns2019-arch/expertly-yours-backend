import { Link, useLocation, useNavigate } from 'react-router';
import { CheckCircle2, Calendar, Mail, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export function SlotsSent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { requirement, slotsCount } = location.state || {};

  useEffect(() => {
    if (!requirement) {
      navigate('/dashboard');
    }
  }, [requirement, navigate]);

  if (!requirement) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-8 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Slots Sent Successfully! 🎉</h1>
          <p className="text-gray-600">
            {requirement.user} has been notified and can now book a slot
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-6">
          <div className="pb-6 border-b border-gray-200 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{requirement.user}</h2>
            <p className="text-gray-600">{requirement.company}</p>
            <p className="text-sm text-gray-600 mt-2">{requirement.subject}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-700 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Slots Suggested</p>
                <p className="text-gray-600">{slotsCount || 5} time slots sent to {requirement.user}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-700 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Notification Sent</p>
                <p className="text-gray-600">{requirement.user} will receive an email to book a slot</p>
              </div>
            </div>
          </div>

          {/* Free Session Badge */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-900">
              <strong>✓ First Session is Free</strong> - This is a complimentary introductory session
            </p>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">📧 What happens next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{requirement.user} will receive a notification to book one of your suggested slots</span>
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Once they book, you'll receive a <strong>Google Calendar invite</strong> with Google Meet link</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>The event will be automatically added to your calendar</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Both parties receive email confirmations with meeting details</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/requirements"
            className="flex-1 px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 text-center"
          >
            View All Requirements
          </Link>
        </div>
      </div>
    </div>
  );
}
