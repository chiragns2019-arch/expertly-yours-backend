import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, User, Mail, Lock, Bell, Trash2, AlertTriangle, Shield } from 'lucide-react';

export function AccountSettings() {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);

  // Mock data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    isExpert: true,
    expertProfilePublished: true,
  };

  const handleDeleteAccount = () => {
    if (deleteInput !== 'DELETE') return;

    setIsDeleting(true);
    // Simulate API call
    setTimeout(() => {
      alert('Account deleted successfully. You will be logged out.');
      navigate('/');
    }, 1500);
  };

  const handleUnpublishExpertProfile = () => {
    setIsUnpublishing(true);
    // Simulate API call
    setTimeout(() => {
      setIsUnpublishing(false);
      setShowUnpublishConfirm(false);
      alert('Expert profile unpublished. You can republish anytime from Profile Setup.');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

        {/* Account Information */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[rgb(37,95,186)] mb-1">Name</label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[rgb(37,95,186)] mb-1">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </h2>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-gray-700">Email notifications for new requirements</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-gray-700">Email notifications for accepted requirements</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-gray-700">Reminders for upcoming bookings</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-gray-700">Marketing emails and updates</span>
            </label>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </h2>
          
          <div className="space-y-3">
            <Link
              to="/change-password"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </Link>
            <Link
              to="/privacy-settings"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <Shield className="w-4 h-4" />
              Privacy Settings
            </Link>
          </div>
        </div>

        {/* Unpublish Expert Profile */}
        {user.isExpert && user.expertProfilePublished && (
          <div className="bg-white border border-yellow-300 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Unpublish Expert Profile
            </h2>
            
            <p className="text-gray-600 mb-4">
              Unpublishing your expert profile will hide it from search results and prevent new requirement submissions. 
              You can republish anytime from Profile Setup.
            </p>

            {!showUnpublishConfirm ? (
              <button
                onClick={() => setShowUnpublishConfirm(true)}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Unpublish Expert Profile
              </button>
            ) : (
              <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
                <p className="text-yellow-900 font-medium mb-3">
                  Are you sure you want to unpublish your expert profile?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleUnpublishExpertProfile}
                    disabled={isUnpublishing}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {isUnpublishing ? 'Unpublishing...' : 'Yes, Unpublish'}
                  </button>
                  <button
                    onClick={() => setShowUnpublishConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Account - Danger Zone */}
        <div className="bg-white border-2 border-red-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h2>
          
          <p className="text-gray-600 mb-4">
            Once you delete your account, there is no going back. This will permanently delete:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li>Your profile and expert profile (if any)</li>
            <li>All bookmarked experts</li>
            <li>All requirements sent and received</li>
            <li>All scheduled bookings</li>
            <li>All saved drafts and data</li>
          </ul>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          ) : (
            <div className="bg-red-50 border border-red-300 rounded p-4">
              <p className="text-red-900 font-medium mb-3">
                ⚠️ This action cannot be undone!
              </p>
              <p className="text-sm text-red-800 mb-3">
                Type <strong>DELETE</strong> to confirm account deletion:
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500 mb-3"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== 'DELETE' || isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteInput('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
