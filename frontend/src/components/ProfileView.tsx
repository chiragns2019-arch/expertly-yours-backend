import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, MapPin, DollarSign, Briefcase, Calendar, Award, ExternalLink, Mail, Phone, Share2, MessageSquare, Bookmark, AlertTriangle, TrendingUp } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { api } from '../services/api';

export function ProfileView() {
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const isLoggedIn = true; // Mock - user is logged in

  // Mock user engagement history with this expert
  const userEngagementHistory = {
    hasContacted: true,
    requirementsSent: 5,
    lastContactDate: '2026-01-15'
  };

  const [expert, setExpert] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(`/experts/${id}`);
        // Map data to the component's expected structure
        setExpert({
          id: data.id,
          name: data.user?.name || 'Unknown',
          profilePhoto: data.user?.avatar || 'https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmZW1hbGUlMjBkb2N0b3IlMjBwaHlzaWNpYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzAxMTcxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
          expertisePhotos: [],
          expertise: data.expertise || 'Expertise Not Specified',
          experience: '10+ years',
          currentEngagement: data.title || '',
          pastEngagements: [],
          careerHighlights: [],
          scaleIndicators: [],
          engagementTypes: ['Paid consulting', 'Advisory'],
          showPricing: !!data.hourlyRate,
          pricing: data.hourlyRate ? `$${data.hourlyRate}/hour` : 'Negotiable',
          minimumCommitment: 'Flexible',
          requirePitch: true,
          directBookingEnabled: false,
          linkedinUrl: data.linkedinUrl || '',
          websiteUrl: data.websiteUrl || '',
          showContact: true,
          email: data.user?.email || '',
          phone: '',
          whatsapp: '',
          deepProof: data.bio || '',
          usefulnessScore: data.usefulnessScore || 90,
          engagementCount: 0,
        });
      } catch (err) {
        console.error('Failed to load expert profile', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchExpert();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A8FF36]"></div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-[#1B1B1B]">Expert not found</h2>
        <Link to="/discover" className="text-blue-600 hover:underline">Return to Discovery</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/discover"
              className="flex items-center gap-2 text-gray-700 hover:text-[#1B1B1B] transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Discovery
            </Link>
            <Link to="/" className="flex items-center">
              <img src={logo} alt="ExpertlyYours" className="h-10" />
            </Link>
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* User Engagement History Alert */}
        {isLoggedIn && userEngagementHistory.hasContacted && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1B1B1B]">
                  You've already contacted this expert
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  You've sent {userEngagementHistory.requirementsSent} requirement{userEngagementHistory.requirementsSent !== 1 ? 's' : ''} to {expert.name}. 
                  Last contact: {new Date(userEngagementHistory.lastContactDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Header with Photo */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-sm hover:shadow-xl transition-shadow">
          {/* Full-width Profile Photo */}
          <div className="w-full h-96 overflow-hidden bg-gray-100">
            <img 
              src={expert.profilePhoto} 
              alt={expert.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Two Column Layout: Left (Name/Expertise) and Right (Actions/Details) */}
          <div className="grid md:grid-cols-[300px_1fr] gap-8 p-8">
            {/* Left Column: Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-[#1B1B1B] mb-2">{expert.name}</h1>
              <p className="text-xl font-semibold text-gray-700 mb-4">{expert.expertise}</p>

              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Total years in this area of expertise</p>
                <p className="text-[#1B1B1B] font-semibold">{expert.experience}</p>
              </div>

              {expert.currentEngagement && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Currently</p>
                  <p className="text-[#1B1B1B] font-semibold">{expert.currentEngagement}</p>
                </div>
              )}

              {expert.pastEngagements && expert.pastEngagements.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Past Experience</p>
                  <ul className="space-y-1">
                    {expert.pastEngagements.map((engagement, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-600 mr-2 font-bold">•</span>
                        <span>{engagement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Scale Indicators</p>
                <div className="flex flex-wrap gap-2">
                  {expert.scaleIndicators.map((indicator) => (
                    <span
                      key={indicator}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      ✓ {indicator}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Actions and Profile Details */}
            <div>
              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-semibold ${
                    isBookmarked 
                      ? 'bg-[#A8FF36] bg-opacity-10 border-[#A8FF36] text-[#1B1B1B]' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
                
                <Link
                  to={`/requirement/send/${expert.id}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold"
                >
                  <Share2 className="w-5 h-5" />
                  Share Requirements
                </Link>
                
                <Link
                  to={`/messages/conv-${expert.id}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                >
                  <MessageSquare className="w-5 h-5" />
                  Message
                </Link>
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Open to</p>
                <div className="flex flex-wrap gap-2">
                  {expert.engagementTypes.map((type) => {
                    const isHighlighted = type === 'Paid consulting' || type === 'Advisory';
                    return (
                      <span
                        key={type}
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                          isHighlighted
                            ? 'bg-[#A8FF36] bg-opacity-20 text-[#1B1B1B] border border-[#A8FF36] border-opacity-30'
                            : 'bg-gray-100 text-gray-700 font-medium'
                        }`}
                      >
                        {type}
                      </span>
                    );
                  })}
                </div>
              </div>

              {expert.showPricing && (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Pricing</p>
                  <p className="text-[#1B1B1B] font-bold text-lg">{expert.pricing}</p>
                  <p className="text-sm text-gray-600">Minimum: {expert.minimumCommitment}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expertise Photos Gallery */}
        {expert.expertisePhotos && expert.expertisePhotos.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="font-bold text-[#1B1B1B] mb-4 flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-blue-600" />
              Credibility Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {expert.expertisePhotos.map((photo, idx) => (
                <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-[#A8FF36] transition-colors">
                  <img 
                    src={photo} 
                    alt={`${expert.name} - Credibility ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Speaking engagements, awards, presentations, and other professional achievements
            </p>
          </div>
        )}

        {/* Career Highlights & Achievements */}
        {expert.careerHighlights && expert.careerHighlights.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="font-bold text-[#1B1B1B] mb-4 flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Career Highlights & Achievements
            </h2>
            <div className="space-y-4">
              {expert.careerHighlights.map((highlight, idx) => (
                <div key={idx} className="border-l-4 border-[#A8FF36] pl-4 py-2 bg-gray-50 rounded-r-xl">
                  <h3 className="font-bold text-[#1B1B1B] mb-1">{highlight.title}</h3>
                  <p className="text-gray-700 text-sm">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-1">Limited Access</h3>
                <p className="text-sm text-yellow-800">
                  Full profile details, case studies, and contact information are only visible to logged-in users.
                </p>
                <Link to="/signup" className="inline-block mt-3 px-6 py-3 bg-[#1B1B1B] text-white rounded-xl hover:bg-[#2D2D2D] transition-colors text-sm font-bold">
                  Sign Up to View Full Profile
                </Link>
              </div>
            </div>
          </div>
        )}

        {isLoggedIn && (
          <>
            {/* External Links */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
              <h2 className="font-bold text-[#1B1B1B] mb-4 text-lg">External Proof Links</h2>
              <div className="space-y-2">
                {expert.linkedinUrl && (
                  <a
                    href={expert.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn Profile
                  </a>
                )}
                {expert.websiteUrl && (
                  <a
                    href={expert.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Personal Website
                  </a>
                )}
              </div>
            </div>

            {/* Deep Proof */}
            {expert.deepProof && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
                <h2 className="font-bold text-[#1B1B1B] mb-4 text-lg">Background & Case Studies</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{expert.deepProof}</p>
              </div>
            )}

            {/* Contact Information */}
            {expert.showContact && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
                <h2 className="font-bold text-[#1B1B1B] mb-4 text-lg">Contact Information</h2>
                <div className="space-y-3 mb-4">
                  {expert.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <a href={`mailto:${expert.email}`} className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                        {expert.email}
                      </a>
                    </div>
                  )}
                  {expert.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <a href={`tel:${expert.phone}`} className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                        {expert.phone}
                      </a>
                    </div>
                  )}
                  {expert.whatsapp && (
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-gray-500" />
                      <a 
                        href={`https://wa.me/${expert.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                      >
                        WhatsApp
                      </a>
                    </div>
                  )}
                </div>
                <div className="bg-yellow-50 border-2 border-yellow-300 p-3 rounded-xl text-sm text-yellow-900">
                  <strong>Note:</strong> External contact is outside the platform. Use platform requirements for formal engagement.
                </div>
              </div>
            )}
          </>
        )}

        {/* Engagement Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-[#1B1B1B] mb-4 text-lg">How to Engage</h2>
          <div className="space-y-3 text-sm text-gray-700">
            {expert.requirePitch && (
              <div className="flex items-start gap-2">
                <MessageSquare className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                <div>
                  <strong className="text-[#1B1B1B]">Requirement-first:</strong> Submit your opportunity details for review
                </div>
              </div>
            )}
            {expert.directBookingEnabled && (
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                <div>
                  <strong className="text-[#1B1B1B]">Direct Booking:</strong> Calendar unlocked after requirement acceptance
                </div>
              </div>
            )}
            {!expert.directBookingEnabled && (
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                <div>
                  <strong className="text-[#1B1B1B]">No Direct Booking:</strong> Coordination after requirement acceptance
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}