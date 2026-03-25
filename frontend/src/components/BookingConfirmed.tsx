import { Link, useLocation, useNavigate } from 'react-router';
import { CheckCircle2, Calendar, Clock, Video, Mail, ArrowRight, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BookingConfirmed() {
  const location = useLocation();
  const navigate = useNavigate();
  const { expert, slot, requirement } = location.state || {};
  const [isCanceling, setIsCanceling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!expert || !slot) {
      navigate('/dashboard');
    }
  }, [expert, slot, navigate]);

  const handleCancelBooking = () => {
    setIsCanceling(true);
    // Simulate API call to cancel booking
    setTimeout(() => {
      setIsCanceling(false);
      alert(`Booking cancelled. Both you and ${expert.name} have been notified.`);
      navigate('/dashboard');
    }, 1500);
  };

  if (!expert || !slot) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-8 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-gray-600">
            Your first session with {expert.name} has been scheduled
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-6">
          {/* Expert Info */}
          <Link 
            to="/profile/jane-smith"
            className="flex items-center gap-4 pb-6 border-b border-gray-200 mb-6 group hover:bg-gray-50 -m-4 p-4 rounded-t-lg transition-colors"
          >
            <img
              src={expert.avatar}
              alt={expert.name}
              className="w-16 h-16 rounded-full border-2 border-gray-300"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{expert.name}</h2>
              <p className="text-gray-600">{expert.title}</p>
            </div>
          </Link>

          {/* Session Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-700 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Date & Time</p>
                <p className="text-gray-600">{slot.date}</p>
                <p className="text-gray-600">{slot.time} ({slot.timezone})</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-gray-700 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Meeting Platform</p>
                <p className="text-gray-600">Google Meet (link sent via email)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-700 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Duration</p>
                <p className="text-gray-600">60 minutes</p>
              </div>
            </div>
          </div>

          {/* Free Session Badge */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-900">
              <strong>✓ Free First Session</strong> - This session is complimentary. No payment required.
            </p>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">📧 What happens next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>You'll receive a <strong>Google Calendar invite</strong> with the Google Meet link</span>
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>The event is automatically added to your calendar</span>
            </li>
            <li className="flex items-start gap-2">
              <Video className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Join the meeting from your email or calendar at the scheduled time</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Both you and {expert.name.split(' ')[0]} will receive email confirmations</span>
            </li>
          </ul>
        </div>

        {/* Requirement Context */}
        {requirement && (
          <div className="bg-white border border-gray-300 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Discussion Topic</h3>
            <p className="text-gray-600">{requirement.company} - {requirement.title}</p>
          </div>
        )}

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
            to="/bookmarks"
            className="flex-1 px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 text-center"
          >
            Browse More Experts
          </Link>
        </div>

        {/* Cancel Booking Section */}
        <div className="mt-6 text-center">
          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-red-600 hover:underline text-sm flex items-center gap-2 mx-auto"
            >
              <XCircle className="w-4 h-4" />
              Cancel Booking
            </button>
          ) : (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 inline-block">
              <p className="text-sm text-red-900 mb-3">
                Are you sure you want to cancel this booking? Both you and {expert.name.split(' ')[0]} will be notified.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancelBooking}
                  disabled={isCanceling}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
                >
                  {isCanceling ? 'Canceling...' : 'Yes, Cancel'}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                >
                  Keep Booking
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          Need to reschedule? Contact {expert.name.split(' ')[0]} directly via the platform messaging
        </p>
      </div>
    </div>
  );
}