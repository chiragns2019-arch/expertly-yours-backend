import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Clock, CheckCircle, XCircle, Users, FileText, LayoutDashboard, LogOut, Activity, TrendingUp } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { api } from '../services/api';

export function AdminDashboard() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('expertly_yours_token');
    localStorage.removeItem('expertly_yours_user');
    navigate('/admin');
  };

  const [stats, setStats] = useState({
    pendingExperts: 0,
    approvedExperts: 0,
    rejectedExperts: 0,
    totalUsers: 0,
    totalRequirements: 0,
    recentRequirements: [],
    recentUsers: [],
    activityFeed: [],
    dailyJoins: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data || response);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const menuItems = [
    {
      title: 'Pending Experts',
      icon: <Clock className="w-8 h-8 text-yellow-600" />,
      value: stats.pendingExperts,
      description: 'Review new expert applications',
      color: 'bg-yellow-50 border-yellow-200',
      status: 'pending'
    },
    {
      title: 'Approved Experts',
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      value: stats.approvedExperts,
      description: 'Manage active experts on platform',
      color: 'bg-green-50 border-green-200',
      status: 'approved'
    },
    {
      title: 'Rejected Experts',
      icon: <XCircle className="w-8 h-8 text-gray-600" />,
      value: stats.rejectedExperts,
      description: 'View rejected expert applications',
      color: 'bg-gray-50 border-gray-200',
      status: 'rejected'
    }
  ];

  const overallStats = [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users className="w-5 h-5" /> },
    { label: 'Total Requirements', value: stats.totalRequirements, icon: <FileText className="w-5 h-5" /> },
    { label: 'Daily New Users', value: stats.dailyJoins, icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-black pb-12">
      <div className="bg-black text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="ExpertlyYours" className="h-10" />
            </Link>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-blue-400" />
              <span className="text-lg font-semibold text-white">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-semibold">
                A
              </div>
              <span className="text-sm font-medium">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors border border-gray-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">System Overview</h1>
            <p className="text-gray-600">Real-time statistics and management</p>
          </div>
          <div className="flex gap-6">
            {overallStats.map((stat) => (
              <div key={stat.label} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-md text-gray-600">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold">{loading ? '...' : stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {menuItems.map((item) => (
            <button
              key={item.status}
              onClick={() => navigate(`/admin/experts?filter=${item.status}`)}
              className={`flex flex-col items-center p-10 border rounded-xl shadow-sm hover:shadow-md transition-all text-center group ${item.color}`}
            >
              <div className="mb-6 transform group-hover:scale-110 transition-transform relative">
                {item.icon}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                  {loading ? '...' : item.value}
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Recent Requirements
              </h2>
              <div className="space-y-4">
                {stats.recentRequirements?.map((req: any) => (
                  <div key={req.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <p className="font-semibold text-gray-900">{req.title}</p>
                    <div className="text-sm text-gray-500 flex justify-between mt-1">
                      <span>Posted by {req.seeker?.name || 'Unknown User'}</span>
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {!loading && stats.recentRequirements?.length === 0 && (
                  <p className="text-gray-500 text-sm">No recent requirements.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Recent Users Joined
              </h2>
              <div className="space-y-4">
                {stats.recentUsers?.map((user: any) => (
                  <div key={user.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase font-bold tracking-wider border border-gray-200">
                      {user.role}
                    </span>
                  </div>
                ))}
                {!loading && stats.recentUsers?.length === 0 && (
                  <p className="text-gray-500 text-sm">No recent users.</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Activity Feed
              </h2>
              <div className="space-y-6 mt-6">
                {stats.activityFeed?.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 z-10 relative"></div>
                      {i !== stats.activityFeed.length - 1 && (
                        <div className="absolute top-3 inset-x-0 mx-auto w-px h-full bg-gray-200 -z-0"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(item.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {!loading && stats.activityFeed?.length === 0 && (
                  <p className="text-gray-500 text-sm">No recent activity.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}