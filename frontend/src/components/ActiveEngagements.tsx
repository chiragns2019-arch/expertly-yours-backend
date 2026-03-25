import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronRight, User, Briefcase, Clock, Calendar } from 'lucide-react';
import { PostLoginNav } from './PostLoginNav';
import { api } from '../services/api';

export function ActiveEngagements() {
  const [engagements, setEngagements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEngagements = async () => {
      try {
        setIsLoading(true);
        const data = await api.get('/bookings');
        
        if (!Array.isArray(data)) {
          console.error('Expected array from /bookings, got:', data);
          setEngagements([]);
          return;
        }

        // Group bookings by expert
        const grouped = data.reduce((acc: any, booking: any) => {
          const expId = booking.expertId;
          if (!acc[expId]) {
            acc[expId] = {
              expertId: expId,
              expertName: booking.expert?.user?.name || 'Expert',
              expertTitle: booking.expert?.title || 'Expert',
              expertAvatar: booking.expert?.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Expert',
              activeRequirements: 0,
              requirements: [],
            };
          }

          const req = booking.slot?.requirement;
          acc[expId].requirements.push({
            id: req?.id || booking.id, // Fallback to booking id if no requirement
            title: req?.problemDescription?.substring(0, 30) + (req?.problemDescription?.length > 30 ? '...' : '') || 'General Consultation',
            startDate: new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
            nextMeeting: booking.slot ? `${booking.slot.date} ${booking.slot.time} ${booking.slot.timezone}` : null,
          });
          acc[expId].activeRequirements++;
          
          return acc;
        }, {});
        
        setEngagements(Object.values(grouped));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEngagements();
  }, []);

  const totalEngagements = engagements.reduce((sum: number, expert: any) => sum + expert.activeRequirements, 0);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <PostLoginNav />
      
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/dashboard" className="hover:text-[#2563eb]">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1B1B1B]">Active Engagements</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[#1B1B1B] mb-2">Active Engagements</h1>
              <p className="text-gray-600">
                You have {totalEngagements} active engagement{totalEngagements !== 1 ? 's' : ''} with {engagements.length} expert{engagements.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Engagements List */}
        <div className="space-y-6">
          {engagements.map((expert: any) => (
            <div key={expert.expertId} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Expert Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-start gap-4">
                  <img 
                    src={expert.expertAvatar} 
                    alt={expert.expertName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-[#1B1B1B] mb-1">{expert.expertName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{expert.expertTitle}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-[#2563eb]">
                            <Briefcase className="w-4 h-4" />
                            <span className="font-semibold">{expert.activeRequirements} Active Requirement{expert.activeRequirements !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                      <Link 
                        to={`/profile/${expert.expertId}`}
                        className="text-sm text-[#2563eb] hover:underline flex items-center gap-1"
                      >
                        View Profile
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements List */}
              <div className="divide-y divide-gray-200">
                {expert.requirements.map((requirement: any) => (
                  <div 
                    key={requirement.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#1B1B1B] mb-2">{requirement.title}</h4>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Started {requirement.startDate}</span>
                          </div>
                          {requirement.nextMeeting && (
                            <div className="flex items-center gap-1.5 text-[#2563eb]">
                              <Clock className="w-4 h-4" />
                              <span>Next meeting: {requirement.nextMeeting}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Link
                        to={`/engagements/${requirement.id}`}
                        className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {engagements.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-[#1B1B1B] mb-2">No Active Engagements</h3>
            <p className="text-gray-600 mb-6">
              You don't have any active engagements yet. Start by submitting requirements to experts.
            </p>
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold"
            >
              Discover Experts
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}