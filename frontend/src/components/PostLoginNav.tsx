import { Link, useLocation } from 'react-router';
import { MessageSquare, Bell, Settings, User, LogOut } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function PostLoginNav() {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const data = await api.get('/notifications/unread-count');
        setUnreadNotifications(data.unreadCount || 0);
      } catch (err) {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if user is in expert mode
    const mode = localStorage.getItem('expertly_mode');
    setIsExpertMode(mode === 'expert');

    // Listen for mode changes
    const handleModeChange = (event: CustomEvent) => {
      setIsExpertMode(event.detail.mode === 'expert');
    };

    window.addEventListener('expertly_mode_change', handleModeChange as EventListener);

    return () => {
      window.removeEventListener('expertly_mode_change', handleModeChange as EventListener);
    };
  }, [location]); // Re-check when location changes

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logging out...');
    // Redirect to login or homepage
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F9FA] border-b border-gray-200 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="ExpertlyYours" className="h-10" />
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/discover"
              className={`text-sm font-medium transition-colors ${
                isActive('/discover')
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Discover Experts
            </Link>
            <Link
              to="/requirements-board"
              className={`text-sm font-medium transition-colors ${
                isActive('/requirements-board')
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Requirements
            </Link>
            <Link
              to="/bookmarks"
              className={`text-sm font-medium transition-colors ${
                isActive('/bookmarks')
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Bookmarks
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {!isExpertMode && (
              <>
                <Link
                  to="/profile/setup"
                  className="px-6 py-2.5 bg-[#A8FF36] text-[#1B1B1B] rounded-full hover:bg-[#98EF26] transition-colors font-semibold text-sm"
                >
                  Become an Expert
                </Link>
                
                <div className="w-px h-6 bg-gray-300 mx-1" />
              </>
            )}
            
            <Link
              to="/messages"
              className={`p-2.5 rounded-lg transition-colors relative ${
                isActive('/messages')
                  ? 'bg-[#A8FF36] text-[#1B1B1B]'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
              aria-label="Messages"
            >
              <MessageSquare className="w-5 h-5" />
            </Link>
            <Link
              to="/notifications"
              className={`p-2.5 rounded-lg transition-colors relative ${
                isActive('/notifications')
                  ? 'bg-[#A8FF36] text-[#1B1B1B]'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`p-2.5 rounded-lg transition-colors ${
                  showProfileMenu
                    ? 'bg-[#A8FF36] text-[#1B1B1B]'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </button>
              
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                    <Link
                      to="/profile/view"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">My Profile</span>
                    </Link>
                    <Link
                      to="/account-settings"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="font-medium">Account Settings</span>
                    </Link>
                    <div className="border-t border-gray-200 my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-red-600 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}