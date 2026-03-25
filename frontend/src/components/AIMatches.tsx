import { Link, useParams } from 'react-router';
import { ArrowLeft, Sparkles, TrendingUp, Briefcase, DollarSign, MapPin, Star } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';

export function AIMatches() {
  const { id } = useParams();

  // Mock requirement data
  const requirement = {
    id: id || 'req-001',
    title: 'Need Growth Marketing Expert for B2B SaaS Launch',
    description: 'Looking for an expert to help with our product launch strategy and initial growth marketing campaigns.',
    budget: '$10,000 - $25,000',
    timeline: '3 months',
    expertiseNeeded: 'B2B SaaS Growth Marketing'
  };

  // Mock AI-matched experts
  const aiMatches = [
    {
      id: 1,
      name: 'Dr. Jane Smith',
      profilePhoto: 'https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmZW1hbGUlMjBkb2N0b3IlMjBwaHlzaWNpYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzAxMTcxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      expertise: 'B2B SaaS Growth Marketing',
      experience: '12 years',
      currentRole: 'VP of Growth at Stripe',
      matchScore: 98,
      matchReasons: [
        'Exact expertise match in B2B SaaS Growth Marketing',
        'Experience with product launches at scale',
        'Track record of $10M+ budget campaigns',
        'Available within your timeline'
      ],
      pricing: '$300/hour',
      availability: 'Available now'
    },
    {
      id: 2,
      name: 'Michael Chen',
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDExNzEwNXww&ixlib=rb-4.1.0&q=80&w=1080',
      expertise: 'Product-Led Growth & B2B Marketing',
      experience: '10 years',
      currentRole: 'Head of Growth at Notion',
      matchScore: 95,
      matchReasons: [
        'Strong expertise in product-led growth strategies',
        'Experience launching B2B SaaS products',
        'Budget-conscious approach with proven ROI',
        'Available for 3-month engagements'
      ],
      pricing: '$275/hour',
      availability: 'Available in 2 weeks'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwMTE3MTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      expertise: 'B2B SaaS Marketing & Demand Generation',
      experience: '15 years',
      currentRole: 'CMO at Figma',
      matchScore: 92,
      matchReasons: [
        'Extensive B2B SaaS marketing experience',
        'Led multiple successful product launches',
        'Strong in demand generation and positioning',
        'Premium tier expertise'
      ],
      pricing: '$400/hour',
      availability: 'Available now'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-gray-700 hover:text-[#1B1B1B] transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            <Link to="/" className="flex items-center">
              <img src={logo} alt="ExpertlyYours" className="h-10" />
            </Link>
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#1B1B1B] mb-2">AI-Matched Experts</h1>
              <p className="text-gray-700 mb-4">
                Our AI has analyzed your requirement and found {aiMatches.length} experts that match your needs.
              </p>
              
              {/* Requirement Summary */}
              <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                <h2 className="font-bold text-[#1B1B1B] mb-2">Your Requirement</h2>
                <p className="text-lg font-semibold text-gray-800 mb-2">{requirement.title}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span><strong>Budget:</strong> {requirement.budget}</span>
                  <span><strong>Timeline:</strong> {requirement.timeline}</span>
                  <span><strong>Expertise:</strong> {requirement.expertiseNeeded}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Matches */}
        <div className="space-y-6">
          {aiMatches.map((expert) => (
            <div key={expert.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-6">
                {/* Profile Photo */}
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-200">
                  <img 
                    src={expert.profilePhoto} 
                    alt={expert.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Expert Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#1B1B1B] mb-1">{expert.name}</h3>
                      <p className="text-lg font-semibold text-gray-700 mb-2">{expert.expertise}</p>
                      <p className="text-sm text-gray-600">{expert.currentRole}</p>
                    </div>

                    {/* Match Score */}
                    <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-xl px-4 py-2 text-center">
                      <div className="text-3xl font-bold">{expert.matchScore}%</div>
                      <div className="text-xs font-semibold">MATCH</div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
                    <h4 className="font-bold text-[#1B1B1B] mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Why this expert matches
                    </h4>
                    <ul className="space-y-1">
                      {expert.matchReasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                          <span className="text-purple-600 mr-2 font-bold">✓</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{expert.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>{expert.pricing}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-3 py-1 rounded-full font-semibold ${
                        expert.availability === 'Available now' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {expert.availability}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      to={`/profile/${expert.id}`}
                      className="px-6 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold"
                    >
                      View Full Profile
                    </Link>
                    <Link
                      to={`/requirement/${expert.id}`}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                    >
                      Contact Expert
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mt-8 text-center">
          <h3 className="font-bold text-[#1B1B1B] mb-2">Don't see the right match?</h3>
          <p className="text-gray-600 mb-4">Browse all experts or refine your requirement</p>
          <div className="flex justify-center gap-3">
            <Link
              to="/discover"
              className="px-6 py-3 bg-[#1B1B1B] text-white rounded-xl hover:bg-[#2D2D2D] transition-colors font-bold"
            >
              Browse All Experts
            </Link>
            <Link
              to={`/requirement/${requirement.id}/edit`}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
            >
              Edit Requirement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
