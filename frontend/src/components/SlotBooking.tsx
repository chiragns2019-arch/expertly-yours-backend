import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Calendar, Clock, Video, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export function SlotBooking() {
  const navigate = useNavigate();
  const { expertId, requirementId } = useParams();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const [expert, setExpert] = useState<any>(null);
  const [requirement, setRequirement] = useState<any>(null);
  const [suggestedSlots, setSuggestedSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!expertId || !requirementId) return;
      try {
        setIsLoading(true);
        const [expertRes, reqRes, slotsRes] = await Promise.all([
          api.get(`/experts/${expertId}`),
          api.get(`/requirements/${requirementId}`),
          api.get(`/bookings/slots/${requirementId}/${expertId}`)
        ]);

        setExpert({
          name: expertRes.user?.name || 'Unknown Expert',
          title: expertRes.title || 'Expert',
          avatar: expertRes.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Expert',
        });

        setRequirement({
          title: reqRes.problemDescription?.substring(0, 30) + '...',
          company: reqRes.companyName || 'Confidential',
        });

        const mappedSlots = slotsRes.map((s: any) => ({
          id: s.id,
          date: new Date(s.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
          time: s.time,
          timezone: s.timezone,
          available: !s.isBooked,
        }));
        setSuggestedSlots(mappedSlots);

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [expertId, requirementId]);

  const handleBookSlot = async () => {
    if (!selectedSlot) return;

    try {
      setIsBooking(true);
      await api.post('/bookings', { slotId: selectedSlot });
      navigate('/booking-confirmed', { 
        state: { 
          expert, 
          slot: suggestedSlots.find((s: any) => s.id === selectedSlot),
          requirement 
        } 
      });
    } catch (err) {
      console.error(err);
      alert('Failed to complete booking');
    } finally {
      setIsBooking(false);
    }
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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : expert && requirement ? (
          <>
        {/* Expert & Requirement Info */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <Link 
            to={`/profile/${expertId}`} 
            className="flex items-start gap-4 mb-4 group hover:bg-gray-50 -m-2 p-2 rounded transition-colors"
          >
            <img
              src={expert.avatar}
              alt={expert.name}
              className="w-16 h-16 rounded-full border-2 border-gray-300"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{expert.name}</h1>
              <p className="text-gray-600">{expert.title}</p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Accepted your requirement
              </div>
            </div>
          </Link>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-1">Your Requirement</p>
            <p className="font-medium text-gray-900">{requirement.company} - {requirement.title}</p>
          </div>
        </div>

        {/* Free First Session Notice */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">🎉 First Session is FREE</h3>
              <p className="text-sm text-blue-800">
                {expert.name.split(' ')[0]} has accepted your requirement and is offering the first session at no cost. 
                This is a great opportunity to discuss your needs and see if there's a good fit!
              </p>
            </div>
          </div>
        </div>

        {/* Slot Selection */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-gray-700" />
            <div>
              <h2 className="text-xl font-semibold">Select a Time Slot</h2>
              <p className="text-sm text-gray-600">Choose from the available slots suggested by {expert.name.split(' ')[0]}</p>
            </div>
          </div>

          <div className="space-y-3">
            {suggestedSlots.map((slot: any) => (
              <button
                key={slot.id}
                onClick={() => slot.available && setSelectedSlot(slot.id)}
                disabled={!slot.available}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  slot.id === selectedSlot
                    ? 'border-blue-500 bg-blue-50'
                    : slot.available
                    ? 'border-gray-300 hover:border-blue-300 bg-white'
                    : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      slot.id === selectedSlot
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {slot.id === selectedSlot && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{slot.date}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4" />
                        {slot.time} ({slot.timezone})
                      </div>
                    </div>
                  </div>
                  {!slot.available && (
                    <span className="text-sm text-red-600 font-medium">Unavailable</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {suggestedSlots.filter((s: any) => s.available).length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-900">
              All slots are currently unavailable. The expert will be notified to suggest additional slots.
            </div>
          )}
        </div>

        {/* Google Meet Info */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <Video className="w-5 h-5 text-gray-700 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Meeting Platform</h3>
              <p className="text-sm text-gray-600 mb-3">
                Upon booking confirmation, a <strong>Google Meet</strong> link will be automatically generated 
                and added to both calendars. You'll receive a calendar invite with all the details.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Calendar invite sent via email</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBookSlot}
            disabled={!selectedSlot || isBooking}
            className={`flex-1 py-3 px-6 rounded font-medium transition-colors ${
              selectedSlot && !isBooking
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isBooking ? 'Booking...' : 'Confirm Booking'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

          </>
        ) : (
          <div className="text-center py-12 text-gray-500">Failed to load booking details</div>
        )}
      </div>
    </div>
  );
}