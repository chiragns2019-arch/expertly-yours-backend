import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Calendar, Clock, Video, FileText, User, ArrowLeft, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { PostLoginNav } from './PostLoginNav';
import { api } from '../services/api';

export function ScheduleMeeting() {
  const { requirementId } = useParams();
  const navigate = useNavigate();

  const [context, setContext] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedExpertId, setSelectedExpertId] = useState('');

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [meetType, setMeetType] = useState<'auto' | 'custom'>('auto');

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const data = await api.get(`/meetings/context/${requirementId}`);
        setContext(data);
        // Auto-select first expert recipient
        if (data.recipients?.length > 0) {
          setSelectedExpertId(data.recipients[0].expertId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (requirementId) fetchContext();
  }, [requirementId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!date || !startTime || !endTime || !selectedExpertId) {
      alert('Please fill in date, time and select an expert.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/meetings', {
        requirementId,
        expertId: selectedExpertId,
        date,
        startTime,
        endTime,
        meetLink: meetType === 'custom' ? meetLink : '',
        notes,
      });
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to schedule meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <PostLoginNav />

      <div className="max-w-3xl mx-auto px-8 py-10 pt-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Schedule Meeting</h1>
              <p className="text-gray-600">Set up a meeting for this requirement</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : !context ? (
            <p className="text-gray-500 text-center py-8">Requirement not found.</p>
          ) : (
            <>
              {/* Requirement Info */}
              <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Requirement</h3>
                <p className="text-lg font-bold text-gray-900">{context.title}</p>
                <p className="text-sm text-gray-600 mt-1">{context.problemDescription?.substring(0, 150)}...</p>
              </div>

              {/* Participants */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                    <User className="w-4 h-4 inline mr-1" />
                    Seeker
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700">
                      {context.seeker?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{context.seeker?.name}</p>
                      <p className="text-sm text-gray-500">{context.seeker?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                  <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-3">
                    <User className="w-4 h-4 inline mr-1" />
                    Expert
                  </h3>
                  {context.recipients?.length > 0 ? (
                    <select
                      value={selectedExpertId}
                      onChange={(e) => setSelectedExpertId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {context.recipients.map((r: any) => (
                        <option key={r.expertId} value={r.expertId}>
                          {r.expert?.user?.name || 'Expert'} ({r.status})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-500">No experts assigned yet</p>
                  )}
                </div>
              </div>

              {/* Meeting Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Meeting Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Meeting Link Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Video className="w-4 h-4 inline mr-1" />
                    Meeting Link
                  </label>
                  <div className="flex gap-4 mb-3">
                    <button
                      type="button"
                      onClick={() => setMeetType('auto')}
                      className={`flex-1 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        meetType === 'auto'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Auto-generate Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setMeetType('custom')}
                      className={`flex-1 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        meetType === 'custom'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <LinkIcon className="w-4 h-4 inline mr-1" />
                      Custom Link
                    </button>
                  </div>
                  {meetType === 'custom' && (
                    <input
                      type="url"
                      value={meetLink}
                      onChange={(e) => setMeetLink(e.target.value)}
                      placeholder="https://meet.google.com/..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Agenda / Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="What would you like to discuss?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirm & Schedule Meeting
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
