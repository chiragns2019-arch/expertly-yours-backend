import { Link } from 'react-router';
import { ArrowLeft, CheckCircle, XCircle, UserPlus, MessageCircle, AlertCircle, Calendar, Mail, Eye } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';

type NotificationType = 'pitch_received' | 'pitch_accepted' | 'pitch_rejected' | 'profile_published' | 'booking_enabled';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await api.get('/notifications');
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async () => {
    try {
      await api.patch('/notifications/read', {});
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true } as any)));
    } catch (err) {
      console.error(err);
    }
  };
  // Native array initialized via state above

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'pitch_received':
        return <Mail className="w-5 h-5 text-blue-600" />;
      case 'pitch_accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pitch_rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'profile_published':
        return <Eye className="w-5 h-5 text-purple-600" />;
      case 'booking_enabled':
        return <Calendar className="w-5 h-5 text-orange-600" />;
      default:
        return <Mail className="w-5 h-5 text-gray-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !(n as any).isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/" className="flex items-center">
            <img src={logo} alt="ExpertlyYours" className="h-10" />
          </Link>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">US-7.1: Email & in-app notifications</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAsRead} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors cursor-pointer text-sm">
              Mark {unreadCount} as read
            </button>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Notification Triggers</h3>
          <ul className="text-sm text-blue-900 space-y-1">
            <li>• Pitch received</li>
            <li>• Pitch accepted/rejected</li>
            <li>• Booking enabled</li>
            <li>• Profile published</li>
          </ul>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
              <div
              key={notification.id}
              className={`bg-white border rounded-lg p-6 ${
                !(notification as any).isRead ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {notification.title || notification.type}
                      {!(notification as any).isRead && (
                        <span className="ml-2 text-xs text-blue-600">• NEW</span>
                      )}
                    </h3>
                    <span className="text-sm text-gray-500">{new Date((notification as any).createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{notification.message}</p>
                  {notification.actionUrl && (
                    <Link
                      to={notification.actionUrl}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View details →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}