import { useState } from 'react';
import { X, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { api } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Predefined credentials
const DEMO_EMAIL = 'demo@expertlyyours.com';
const DEMO_PASSWORD = 'expertdemo2026';

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await api.post('/auth/login', { email, password });
      toast.success('Successfully logged in!');
      localStorage.setItem('expertly_yours_user', JSON.stringify(data));
      // Optionally sync cleanly with expertly_authenticated
      localStorage.setItem('expertly_authenticated', 'true');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#A8FF36] bg-opacity-20 rounded-full mb-4">
            <Lock className="w-8 h-8 text-[#A8FF36]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1B1B1B] mb-2">Welcome to ExpertlyYours</h2>
          <p className="text-sm text-gray-600">Please login to access the platform</p>
        </div>

        {/* Demo Credentials Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-blue-900 mb-2">Pre-seeded Credentials:</p>
          <p className="text-xs text-blue-800 font-mono mb-1">Seeker: seeker@example.com / seeker123</p>
          <p className="text-xs text-blue-800 font-mono mb-1">Expert: jane@example.com / expert123</p>
          <p className="text-xs text-blue-800 font-mono mb-1">Admin: admin@expertlyyours.com / admin123</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Uses real API authentication with Postgres validation.
        </p>
      </div>
    </div>
  );
}
