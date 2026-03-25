import { Link } from 'react-router';
import { CheckCircle, Clock, Eye } from 'lucide-react';

export function ProfileSubmitted() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Congratulations!
          </h1>
          
          <p className="text-lg text-gray-700 mb-8">
            Your expert profile has been submitted successfully. Our team will review your application shortly. Please sit back and relax while we process your request. You will be notified once your profile is approved. Thank you for joining Expertly Yours! 😊
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">What happens next?</h3>
                <ul className="text-sm text-blue-900 space-y-2">
                  <li>• Our admin team reviews your profile for quality and authenticity</li>
                  <li>• We verify your experience claims and expertise</li>
                  <li>• You'll receive an email once your profile is approved</li>
                  <li>• After approval, your profile goes live on the platform</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">What we review:</h3>
                <ul className="text-sm text-yellow-900 space-y-2">
                  <li>• LinkedIn profile verification</li>
                  <li>• Experience claims credibility</li>
                  <li>• Expertise specificity (not too generic)</li>
                  <li>• Scale indicators and past engagements</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/profile/setup"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Edit Profile
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Have questions? <Link to="/contact" className="text-blue-600 hover:underline">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
