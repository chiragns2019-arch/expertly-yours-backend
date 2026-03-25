import { Link, useRouteError } from 'react-router';
import { AlertTriangle, Home } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';

export function ErrorBoundary() {
  const error = useRouteError() as { status?: number; statusText?: string; message?: string };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src={logo} alt="ExpertlyYours" className="h-12 mx-auto" />
          </Link>
        </div>

        {/* Error Card */}
        <div className="bg-white border-2 border-red-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1B1B1B] mb-2">
                {error?.status === 404 ? 'Page Not Found' : 'Oops! Something went wrong'}
              </h1>
              <p className="text-gray-700">
                {error?.status === 404 
                  ? "The page you're looking for doesn't exist or has been moved." 
                  : 'An unexpected error occurred. Please try again.'}
              </p>
            </div>
          </div>

          {/* Error Details */}
          {error && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Error:</strong> {error.statusText || error.message || 'Unknown error'}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
