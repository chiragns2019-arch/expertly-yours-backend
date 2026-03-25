import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Calendar, Plus, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  timezone: string;
}

export function SuggestSlots() {
  const navigate = useNavigate();
  const { requirementId } = useParams();
  
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: '1', date: '', time: '', timezone: 'PST' },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [requirement, setRequirement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(`/requirements/${requirementId}`);
        setRequirement({
          user: data.seeker?.name || 'Unknown',
          company: data.companyName,
          subject: data.problemDescription?.substring(0, 30) + '...',
          description: data.problemDescription,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (requirementId) fetchRequirement();
  }, [requirementId]);

  const addSlot = () => {
    if (slots.length >= 5) return;
    setSlots([
      ...slots,
      { id: Date.now().toString(), date: '', time: '', timezone: 'PST' },
    ]);
  };

  const removeSlot = (id: string) => {
    if (slots.length === 1) return;
    setSlots(slots.filter(slot => slot.id !== id));
  };

  const updateSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setSlots(slots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const allFilled = slots.every((slot: any) => slot.date && slot.time);
    if (!allFilled) {
      alert('Please fill in all slot details');
      return;
    }

    try {
      setIsSaving(true);
      await api.post('/bookings/slots', {
        requirementId,
        slots: slots.map((s: any) => ({
          date: new Date(s.date).toISOString(),
          time: s.time,
          timezone: s.timezone
        }))
      });
      navigate('/slots-sent', { state: { requirement, slotsCount: slots.length } });
    } catch (err) {
      console.error(err);
      alert('Failed to send slots');
    } finally {
      setIsSaving(false);
    }
  };

  const filledSlots = slots.filter((s: any) => s.date && s.time).length;

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
            Back to Requirements
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : requirement ? (
          <>
        {/* Requirement Details */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Suggest Meeting Slots</h1>
          
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-gray-600">From</p>
                <p className="font-medium text-gray-900">{requirement.user} · {requirement.company}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Accepted
              </span>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-600">Requirement</p>
              <p className="font-medium text-gray-900">{requirement.subject}</p>
              <p className="text-sm text-gray-600 mt-1">{requirement.description}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-2">How it works:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Suggest 3-5 available time slots for {requirement.user} to choose from</li>
                <li>The <strong>first session is free</strong> - no payment is involved</li>
                <li>Once they book, a Google Meet link will be automatically generated</li>
                <li>Both of you will receive calendar invites via email</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Slot Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-gray-700" />
              <div>
                <h2 className="text-xl font-semibold">Your Available Slots</h2>
                <p className="text-sm text-gray-600">Suggest {filledSlots}/3-5 slots</p>
              </div>
            </div>
            <button
              type="button"
              onClick={addSlot}
              disabled={slots.length >= 5}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                slots.length >= 5
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Slot
            </button>
          </div>

          <div className="space-y-4">
            {slots.map((slot: any, index: number) => (
              <div key={slot.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[rgb(37,95,186)] mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={slot.date}
                        onChange={(e) => updateSlot(slot.id, 'date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[rgb(37,95,186)] mb-2">
                        Time (1 hour)
                      </label>
                      <input
                        type="time"
                        required
                        value={slot.time}
                        onChange={(e) => updateSlot(slot.id, 'time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={slot.timezone}
                        onChange={(e) => updateSlot(slot.id, 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      >
                        <option value="PST">PST</option>
                        <option value="EST">EST</option>
                        <option value="CST">CST</option>
                        <option value="MST">MST</option>
                        <option value="UTC">UTC</option>
                        <option value="IST">IST</option>
                      </select>
                    </div>
                  </div>
                  {slots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSlot(slot.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded mt-7"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {slots.length < 3 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-900">
              <strong>Tip:</strong> Suggest at least 3 slots to give {requirement.user} flexibility in scheduling
            </div>
          )}
        </form>

        {/* Google Calendar Integration Notice */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Automatic Google Calendar Integration</h3>
              <p className="text-sm text-gray-600 mb-3">
                Once {requirement.user} books a slot:
              </p>
              <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
                <li>A Google Meet link is automatically generated</li>
                <li>Calendar invites are sent to both parties</li>
                <li>The event is added to your Google Calendar</li>
                <li>Email confirmations are sent with meeting details</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={filledSlots < 3 || isSaving}
            className={`flex-1 py-3 px-6 rounded font-medium transition-colors ${
              filledSlots >= 3 && !isSaving
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? 'Sending Slots...' : `Send ${filledSlots} Slots to ${requirement.user}`}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        <p className="text-sm text-gray-600 text-center mt-4">
          {requirement.user} will be notified and can book one of your suggested slots
        </p>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">Failed to load requirement details</div>
        )}
      </div>
    </div>
  );
}
