import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Calendar, Clock, Video, CheckCircle2, Send } from 'lucide-react';
import { PostLoginNav } from './PostLoginNav';
import { api } from '../services/api';

export function DirectBooking() {
  const navigate = useNavigate();
  const { expertId } = useParams();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [meetingNote, setMeetingNote] = useState('');
  const [expert, setExpert] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock available slots
  const availableSlots = [
    { id: 'slot-1', date: 'Monday, Feb 24, 2026', time: '10:00 AM - 11:00 AM', timezone: 'PST' },
    { id: 'slot-2', date: 'Monday, Feb 24, 2026', time: '2:00 PM - 3:00 PM', timezone: 'PST' },
    { id: 'slot-3', date: 'Tuesday, Feb 25, 2026', time: '11:00 AM - 12:00 PM', timezone: 'PST' },
    { id: 'slot-4', date: 'Wednesday, Feb 26, 2026', time: '3:00 PM - 4:00 PM', timezone: 'PST' },
    { id: 'slot-5', date: 'Thursday, Feb 27, 2026', time: '9:00 AM - 10:00 AM', timezone: 'PST' },
    { id: 'slot-6', date: 'Friday, Feb 28, 2026', time: '1:00 PM - 2:00 PM', timezone: 'PST' },
  ];

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(`/experts/${expertId}`);
        setExpert({
          id: data.id,
          name: data.user?.name || 'Unknown Expert',
          title: data.title || 'Expert',
          avatar: data.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Expert',
          hourlyRate: data.hourlyRate ? `$${data.hourlyRate}/hour` : 'Variable',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (expertId) fetchExpert();
  }, [expertId]);

  const handleBooking = async () => {
    if (!selectedSlot || !expert) return;
    const slotDetails = availableSlots.find(s => s.id === selectedSlot);
    if (!slotDetails) return;
    
    try {
      setIsBooking(true);
      await api.post('/bookings/direct', {
        expertId: expert.id,
        meetingNote,
        date: slotDetails.date,
        time: slotDetails.time,
        timezone: slotDetails.timezone,
      });
      navigate('/booking-confirmed');
    } catch (err) {
      console.error(err);
      alert('Failed to complete booking');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-20">
      <PostLoginNav />
      
      <div className="max-w-4xl mx-auto px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : expert ? (
          <>
        {/* Back Button */}
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1B1B1B] transition-colors mb-8 group font-medium"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Discover
        </Link>

        {/* Expert Info Card */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={expert.avatar}
              alt={expert.name}
              className="w-20 h-20 rounded-2xl border-2 border-gray-200 object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-[#1B1B1B]">{expert.name}</h2>
              <p className="text-gray-600 mb-2">{expert.title}</p>
              <p className="text-blue-600 font-semibold">{expert.hourlyRate}</p>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">Direct Booking Available</p>
                <p className="text-sm text-blue-800">
                  Book a 1-hour consultation directly with {expert.name.split(' ')[0]}. 
                  Select an available time slot below and provide a brief description of what you'd like to discuss.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Note */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
          <label className="block text-sm font-bold text-[rgb(37,95,186)] mb-3 uppercase tracking-wide">
            What would you like to discuss? *
          </label>
          <textarea
            required
            value={meetingNote}
            onChange={(e) => setMeetingNote(e.target.value)}
            rows={4}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-[#1B1B1B] placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
            placeholder="Brief description of the topics or questions you'd like to cover in this session..."
          />
        </div>

        {/* Available Slots */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-[#1B1B1B] mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Select an Available Time Slot
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {availableSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`p-5 rounded-xl border-2 transition-all text-left ${
                  selectedSlot === slot.id
                    ? 'bg-[#A8FF36] border-[#A8FF36] shadow-lg scale-105'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-5 h-5 ${selectedSlot === slot.id ? 'text-[#1B1B1B]' : 'text-gray-600'}`} />
                    <span className={`font-bold ${selectedSlot === slot.id ? 'text-[#1B1B1B]' : 'text-gray-900'}`}>
                      {slot.date}
                    </span>
                  </div>
                  {selectedSlot === slot.id && (
                    <CheckCircle2 className="w-6 h-6 text-[#1B1B1B]" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className={`w-4 h-4 ${selectedSlot === slot.id ? 'text-[#1B1B1B]' : 'text-gray-600'}`} />
                  <span className={`font-semibold ${selectedSlot === slot.id ? 'text-[#1B1B1B]' : 'text-gray-700'}`}>
                    {slot.time} {slot.timezone}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Meeting Platform Info */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-purple-900 mb-1">Video Call Details</p>
                <p className="text-sm text-purple-800">
                  A Zoom meeting link will be sent to both parties once the booking is confirmed.
                  You'll receive calendar invites and email reminders 24 hours before the meeting.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
            <Link
              to="/discover"
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-bold text-lg"
            >
              Cancel
            </Link>
            
            <button
              onClick={handleBooking}
              disabled={!selectedSlot || !meetingNote.trim() || isBooking}
              className="flex items-center gap-3 px-8 py-4 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBooking ? (
                <>
                  <div className="w-5 h-5 border-3 border-[#1B1B1B] border-t-transparent rounded-full animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">Expert not found</div>
        )}
      </div>
    </div>
  );
}
