import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Upload, X, AlertCircle, CheckCircle, User, Mic, Plus, Award, DollarSign, Clock } from 'lucide-react';
import { api } from '../services/api';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { FULL_ENGAGEMENT_TYPES } from '../constants/engagementTypes';

type Step = 'expertise' | 'proof' | 'engagement' | 'pricing' | 'preview';

export function ProfileSetup() {
  const [currentStep, setCurrentStep] = useState<Step>('expertise');
  const [isDraft, setIsDraft] = useState(true);
  
  const [profile, setProfile] = useState({
    displayName: '',
    profilePicture: '',
    expertisePhotos: [
      {
        url: 'https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwc3BlYWtlciUyMHByZXNlbnRhdGlvbiUyMHN0YWdlfGVufDF8fHx8MTc2OTg2NDQzMnww&ixlib=rb-4.1.0&q=80&w=1080',
        link: 'https://tedx.com/talks/sample-talk'
      },
      {
        url: 'https://images.unsplash.com/photo-1766722906733-609eebf3b63a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF3YXJkJTIwdHJvcGh5JTIwd2lubmVyfGVufDF8fHx8MTY5ODY0NDQzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
        link: 'https://example.com/forbes-award-2023'
      }
    ] as Array<{ url: string; link: string }>,
    bio: '',
    linkedinProfile: '',
    primaryExpertise: '',
    yearsExperience: '',
    currentEngagement: '',
    pastEngagements: [] as string[],
    brands: [] as string[],
    scaleIndicators: [] as string[],
    careerHighlights: [] as Array<{ title: string; description: string }>,
    linkedinUrl: '',
    githubUrl: '',
    publicationsUrl: '',
    websiteUrl: '',
    deepProof: '',
    engagementTypes: [] as string[],
    showPricing: false,
    pricingEngagementTypes: [] as string[], // Track which engagement types have pricing
    pricingModel: 'hourly' as 'session' | 'hourly' | 'retainer' | 'equity' | 'none',
    sessionRates: {
      '15min': '',
      '30min': '',
      '45min': '',
      '60min': ''
    },
    hourlyRate: '',
    retainerMonthlyAmount: '',
    retainerHoursPerMonth: '',
    fullTimeAnnualSalary: '',
    partTimeHourlyRate: '',
    fractionalMonthlyRate: '',
    minimumCommitment: '',
    directBookingEnabled: false,
    requirePitch: true,
    showContact: false,
    email: '',
    phone: '',
    whatsapp: '',
  });

  const [newBrand, setNewBrand] = useState('');
  const [newPastEngagement, setNewPastEngagement] = useState('');
  const [newHighlightTitle, setNewHighlightTitle] = useState('');
  const [newHighlightDescription, setNewHighlightDescription] = useState('');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [aiWarning, setAiWarning] = useState('');

  const handleExpertiseChange = (value: string) => {
    setProfile({ ...profile, primaryExpertise: value });
    if (value.length > 0 && value.length < 10) {
      setAiWarning('⚠️ AI Flag: This expertise seems too generic. Consider being more specific.');
    } else {
      setAiWarning('');
    }
  };

  const addBrand = () => {
    if (newBrand.trim()) {
      setProfile({ ...profile, brands: [...profile.brands, newBrand.trim()] });
      setNewBrand('');
    }
  };

  const removeBrand = (index: number) => {
    setProfile({
      ...profile,
      brands: profile.brands.filter((_, i) => i !== index),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearProfilePicture = () => {
    setProfile({ ...profile, profilePicture: '' });
  };

  const handleExpertisePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && profile.expertisePhotos.length < 5) {
      const remainingSlots = 5 - profile.expertisePhotos.length;
      const filesToAdd = Array.from(files).slice(0, remainingSlots);
      
      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile(prev => ({
            ...prev,
            expertisePhotos: [...prev.expertisePhotos, { url: reader.result as string, link: '' }]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeExpertisePhoto = (index: number) => {
    setProfile({
      ...profile,
      expertisePhotos: profile.expertisePhotos.filter((_, i) => i !== index),
    });
  };

  const updateExpertisePhotoLink = (index: number, link: string) => {
    const updatedPhotos = [...profile.expertisePhotos];
    updatedPhotos[index] = { ...updatedPhotos[index], link };
    setProfile({ ...profile, expertisePhotos: updatedPhotos });
  };

  const generateBioFromLinkedIn = async () => {
    setIsGeneratingBio(true);
    // Simulating AI bio generation - in production, this would call an AI service
    setTimeout(() => {
      setProfile({
        ...profile,
        bio: `Experienced professional with ${profile.yearsExperience} years in ${profile.primaryExpertise}. Specialized in driving growth and innovation across multiple high-impact projects. Proven track record of delivering results in fast-paced environments.`
      });
      setIsGeneratingBio(false);
    }, 2000);
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setIsTranscribing(true);
      
      // Simulate transcription (1.5 seconds)
      setTimeout(() => {
        setIsTranscribing(false);
        setIsRewriting(true);
        
        // Simulate AI rewriting (2 seconds)
        setTimeout(() => {
          const sampleText = "I have over 15 years of experience in B2B SaaS growth marketing, specializing in scaling startups from seed to Series C. I've led marketing teams at companies like Segment and HubSpot, driving user acquisition strategies that resulted in 300% year-over-year growth. My expertise includes performance marketing, content strategy, and building high-performing marketing teams. I'm passionate about helping early-stage companies find product-market fit and scale efficiently.";
          setProfile({ ...profile, bio: sampleText });
          setIsRewriting(false);
        }, 2000);
      }, 1500);
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  const addPastEngagement = () => {
    if (newPastEngagement.trim()) {
      setProfile({ ...profile, pastEngagements: [...profile.pastEngagements, newPastEngagement.trim()] });
      setNewPastEngagement('');
    }
  };

  const removePastEngagement = (index: number) => {
    setProfile({
      ...profile,
      pastEngagements: profile.pastEngagements.filter((_, i) => i !== index),
    });
  };

  const toggleEngagement = (type: string) => {
    if (profile.engagementTypes.includes(type)) {
      setProfile({
        ...profile,
        engagementTypes: profile.engagementTypes.filter((t) => t !== type),
      });
    } else {
      setProfile({
        ...profile,
        engagementTypes: [...profile.engagementTypes, type],
      });
    }
  };

  const togglePricingEngagement = (type: string) => {
    if (profile.pricingEngagementTypes.includes(type)) {
      setProfile({
        ...profile,
        pricingEngagementTypes: profile.pricingEngagementTypes.filter((t) => t !== type),
      });
    } else {
      setProfile({
        ...profile,
        pricingEngagementTypes: [...profile.pricingEngagementTypes, type],
      });
    }
  };

  const toggleScale = (indicator: string) => {
    if (profile.scaleIndicators.includes(indicator)) {
      setProfile({
        ...profile,
        scaleIndicators: profile.scaleIndicators.filter((s) => s !== indicator),
      });
    } else {
      setProfile({
        ...profile,
        scaleIndicators: [...profile.scaleIndicators, indicator],
      });
    }
  };

  const addCareerHighlight = () => {
    if (newHighlightTitle.trim() && newHighlightDescription.trim()) {
      setProfile({
        ...profile,
        careerHighlights: [
          ...profile.careerHighlights,
          { title: newHighlightTitle.trim(), description: newHighlightDescription.trim() },
        ],
      });
      setNewHighlightTitle('');
      setNewHighlightDescription('');
    }
  };

  const removeCareerHighlight = (index: number) => {
    setProfile({
      ...profile,
      careerHighlights: profile.careerHighlights.filter((_, i) => i !== index),
    });
  };

  const navigate = useNavigate();

  const handlePublish = async () => {
    try {
      setIsDraft(false);
      await api.post('/experts/submit', profile);
      navigate('/profile-submitted');
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Failed to submit profile. Please try again.');
    }
  };

  const canPublish =
    profile.displayName.length > 0 &&
    profile.primaryExpertise.length > 0 &&
    profile.yearsExperience.length > 0 &&
    profile.bio.length > 0 &&
    profile.engagementTypes.length > 0;

  const steps = [
    { key: 'expertise', label: 'Profile' },
    { key: 'proof', label: 'Experience' },
    { key: 'engagement', label: 'Engagement' },
    { key: 'pricing', label: 'Pricing and Rates' },
    { key: 'preview', label: 'Preview' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="ExpertlyYours" className="h-10" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">
              {isDraft ? 'Status: Draft' : '✓ Published'}
            </span>
            <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
              <Upload className="w-4 h-4" />
              Save Draft
            </button>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-[#1B1B1B] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors font-medium text-sm"
            >
              Exit
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center flex-1">
                <button
                  onClick={() => setCurrentStep(step.key as Step)}
                  className={`flex items-center gap-3 transition-colors ${
                    currentStep === step.key ? 'text-[#1B1B1B]' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold transition-all ${
                      currentStep === step.key
                        ? 'border-[#A8FF36] bg-[#A8FF36] text-[#1B1B1B]'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="font-semibold hidden md:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-colors ${
                    currentStep === step.key ? 'bg-[#A8FF36]' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
          {currentStep === 'expertise' && (
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-[#1B1B1B] mb-2">Profile & Expertise</h2>
                <p className="text-gray-600">How you want to be seen on the platform</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                  Display Name *
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                  placeholder="e.g., Dr. Jane Smith or Jane S."
                />
                
              </div>

              <div>
                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                  Profile Picture
                </label>
                <div className="flex items-start gap-6">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 space-y-6">
                    <div>
                      <input
                        type="url"
                        value={profile.profilePicture}
                        onChange={(e) => setProfile({ ...profile, profilePicture: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                        placeholder="Paste image URL (e.g., from LinkedIn, Gravatar)"
                      />
                      <p className="text-sm text-gray-500 mt-2">Paste an image URL from the web</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-sm text-gray-500 font-medium">OR</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="profile-upload"
                      />
                      <label
                        htmlFor="profile-upload"
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors font-medium text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        Upload from device
                      </label>
                      <p className="text-sm text-gray-500 mt-2">Choose a photo from your laptop or phone</p>
                    </div>
                    {profile.profilePicture && (
                      <button
                        type="button"
                        onClick={clearProfilePicture}
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        <X className="w-4 h-4" />
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                  What is the PROVEN expertise you would like to offer? *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={80}
                    value={profile.primaryExpertise}
                    onChange={(e) => handleExpertiseChange(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                    placeholder="e.g., B2B SaaS Growth Marketing"
                  />
                  
                </div>
                <p className="text-sm text-gray-500 mt-2">{profile.primaryExpertise.length}/80 characters</p>
                {aiWarning && (
                  <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-900">
                    {aiWarning}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                  Total Years of Experience in the Area of Expertise *
                </label>
                <select
                  value={profile.yearsExperience}
                  onChange={(e) => setProfile({ ...profile, yearsExperience: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                >
                  <option value="">Select years</option>
                  <option value="<1">Less than 1 year</option>
                  <option value="1-3">1–3 years</option>
                  <option value="3-5">3–5 years</option>
                  <option value="5-10">5–10 years</option>
                  <option value="10-15">10–15 years</option>
                  <option value="15-20">15–20 years</option>
                  <option value="20+">20+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                  Expertise Photos - Build Credibility! (Optional)
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Upload up to 5 photos showing you speaking at conferences, receiving awards, presenting at TED talks, or other professional achievements. 
                  <strong className="text-blue-600"> Photos build credibility fast!</strong> Add a hyperlink to each photo (e.g., TED talk video, award announcement, conference page).
                </p>
                
                {profile.expertisePhotos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {profile.expertisePhotos.map((photo, index) => (
                      <div key={index} className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white hover:border-[#A8FF36] transition-colors">
                        <div className="relative aspect-video group">
                          <img src={photo.url} alt={`Expertise ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExpertisePhoto(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-3">
                          <label className="block text-xs font-semibold text-[rgb(37,95,186)] mb-2">
                            Hyperlink (e.g., TED talk, award page)
                          </label>
                          <input
                            type="url"
                            value={photo.link}
                            onChange={(e) => updateExpertisePhotoLink(index, e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {profile.expertisePhotos.length < 5 && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleExpertisePhotoUpload}
                      className="hidden"
                      id="expertise-photos-upload"
                    />
                    <label
                      htmlFor="expertise-photos-upload"
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors font-medium text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      {profile.expertisePhotos.length === 0 ? 'Upload from device' : 'Add more photos'}
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      {profile.expertisePhotos.length === 0 
                        ? 'You can add up to 5 photos' 
                        : `${5 - profile.expertisePhotos.length} more photo${5 - profile.expertisePhotos.length !== 1 ? 's' : ''} can be added`}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                  Short Bio *
                </label>
                
                <div className="mb-4 p-5 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-900 mb-3">
                    💡 <strong>Quick Bio Generation:</strong> Paste your LinkedIn profile URL and we'll help generate a professional bio for you.
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={profile.linkedinProfile}
                      onChange={(e) => setProfile({ ...profile, linkedinProfile: e.target.value })}
                      className="flex-1 px-4 py-2.5 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                    <button
                      type="button"
                      onClick={generateBioFromLinkedIn}
                      disabled={!profile.linkedinProfile || isGeneratingBio}
                      className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all ${
                        profile.linkedinProfile && !isGeneratingBio
                          ? 'bg-[#A8FF36] text-[#1B1B1B] hover:bg-[#98EF26]'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isGeneratingBio ? 'Generating...' : 'Generate Bio'}
                    </button>
                  </div>
                  
                </div>

                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  maxLength={2000}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                  placeholder="Share your background, what you specialize in, and what makes you uniquely qualified to offer this expertise..."
                  disabled={isRecording || isTranscribing || isRewriting}
                />
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleVoiceRecording}
                      disabled={isTranscribing || isRewriting}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium ${
                        isRecording
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : isTranscribing || isRewriting
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#1B1B1B] text-white hover:bg-[#2D2D2D]'
                      }`}
                    >
                      <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
                      {isRecording ? 'Stop Recording' : 'Record with Voice'}
                    </button>

                    {isRecording && (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-1 bg-red-600 rounded-full animate-pulse" style={{height: '12px', animationDelay: '0ms'}}></div>
                          <div className="w-1 bg-red-600 rounded-full animate-pulse" style={{height: '20px', animationDelay: '150ms'}}></div>
                          <div className="w-1 bg-red-600 rounded-full animate-pulse" style={{height: '16px', animationDelay: '300ms'}}></div>
                          <div className="w-1 bg-red-600 rounded-full animate-pulse" style={{height: '24px', animationDelay: '450ms'}}></div>
                          <div className="w-1 bg-red-600 rounded-full animate-pulse" style={{height: '14px', animationDelay: '600ms'}}></div>
                        </div>
                        <span className="text-sm text-red-600 font-medium animate-pulse">Recording...</span>
                      </div>
                    )}

                    {isTranscribing && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">Transcribing your voice...</span>
                      </div>
                    )}

                    {isRewriting && (
                      <div className="flex items-center gap-2 text-purple-600">
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">AI is rewriting and improving...</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 font-medium">{profile.bio.length}/2000 characters</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
                <p className="text-sm text-blue-900">
                  Your profile is auto-saved as a draft. It won't be visible to others until you publish.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('proof')}
                  className="px-8 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-semibold"
                >
                  Next: Experience
                </button>
              </div>
            </div>
          )}

          {currentStep === 'proof' && (
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-[#1B1B1B] mb-2">Experience & Proof</h2>
                <p className="text-gray-600">Brands you've worked with and proof of expertise</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                  Current Role / Engagement (Optional)
                </label>
                <input
                  type="text"
                  value={profile.currentEngagement}
                  onChange={(e) => setProfile({ ...profile, currentEngagement: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                  placeholder="e.g., VP of Growth at Stripe, Co-Founder at Zomato"
                />
                <p className="text-sm text-gray-500 mt-2">This will be displayed on your profile discovery card</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                  Past Experience (Optional)
                </label>
                <p className="text-sm text-gray-600 mb-3">Add 3-5 notable past roles or engagements to showcase your experience</p>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newPastEngagement}
                    onChange={(e) => setNewPastEngagement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPastEngagement())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                    placeholder="e.g., Head of Marketing at Segment (acquired by Twilio)"
                  />
                  <button
                    type="button"
                    onClick={addPastEngagement}
                    className="px-5 py-3 bg-[#1B1B1B] text-white rounded-xl hover:bg-[#2D2D2D] transition-colors flex items-center gap-2 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {profile.pastEngagements.map((engagement, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm flex items-center justify-between hover:border-gray-300 transition-colors"
                    >
                      <span className="flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span className="text-gray-700">{engagement}</span>
                      </span>
                      <button type="button" onClick={() => removePastEngagement(index)} className="hover:text-red-600 ml-2 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                  Who have you worked with and what have you done for them... Please give 3 to 5 examples
                </label>
                <p className="text-sm text-gray-600 mb-3">Add notable companies, startups, or organizations</p>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBrand())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                    placeholder="e.g., Google, Stripe, early-stage startups"
                  />
                  <button
                    type="button"
                    onClick={addBrand}
                    className="px-5 py-3 bg-[#1B1B1B] text-white rounded-xl hover:bg-[#2D2D2D] transition-colors flex items-center gap-2 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.brands.map((brand, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm flex items-center gap-2 hover:border-gray-300 transition-colors"
                    >
                      <span className="font-medium text-gray-700">{brand}</span>
                      <button type="button" onClick={() => removeBrand(index)} className="hover:text-red-600 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                  Scale Indicators (select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['High revenue ($10M+)', 'Significant users (100K+)', 'Exit/IPO', 'Series B+ funding', 'Team scale (50+)', 'International expansion'].map((indicator) => (
                    <button
                      key={indicator}
                      type="button"
                      onClick={() => toggleScale(indicator)}
                      className={`px-4 py-4 border-2 rounded-xl text-left font-medium transition-all ${
                        profile.scaleIndicators.includes(indicator)
                          ? 'border-[#A8FF36] bg-[#A8FF36] bg-opacity-10 text-[#1B1B1B]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {indicator}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-bold text-[#1B1B1B] mb-2 flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-gray-600" />
                  Career Highlights & Achievements (Optional)
                </h3>
                <p className="text-sm text-gray-600 mb-5">
                  Add your most impressive achievements, awards, or milestones. These build credibility fast! 
                  (e.g., "Forbes 30 Under 30", "Led company to $200M ARR", "TED Talk speaker")
                </p>

                <div className="space-y-6 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                      Achievement Title
                    </label>
                    <input
                      type="text"
                      value={newHighlightTitle}
                      onChange={(e) => setNewHighlightTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                      placeholder="e.g., Forbes 30 Under 30 (Marketing & Advertising)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                      Description
                    </label>
                    <textarea
                      value={newHighlightDescription}
                      onChange={(e) => setNewHighlightDescription(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                      placeholder="e.g., Recognized for innovation in product-led growth strategies in 2019"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addCareerHighlight}
                    disabled={!newHighlightTitle.trim() || !newHighlightDescription.trim()}
                    className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all ${
                      newHighlightTitle.trim() && newHighlightDescription.trim()
                        ? 'bg-[#1B1B1B] text-white hover:bg-[#2D2D2D]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Add Highlight
                  </button>
                </div>

                {profile.careerHighlights.length > 0 && (
                  <div className="space-y-3">
                    {profile.careerHighlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-[#1B1B1B]">{highlight.title}</h4>
                          <button
                            type="button"
                            onClick={() => removeCareerHighlight(index)}
                            className="hover:text-red-600 ml-2 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-700">{highlight.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-bold text-[#1B1B1B] mb-5 text-lg">Optional External Proof Links</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={profile.linkedinUrl}
                      onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                      GitHub / Portfolio
                    </label>
                    <input
                      type="url"
                      value={profile.githubUrl}
                      onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                      Publications / Articles
                    </label>
                    <input
                      type="url"
                      value={profile.publicationsUrl}
                      onChange={(e) => setProfile({ ...profile, publicationsUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                      Personal Website
                    </label>
                    <input
                      type="url"
                      value={profile.websiteUrl}
                      onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-bold text-[#1B1B1B] mb-2 text-lg">Deep Proof (Optional)</h3>
                <p className="text-sm text-gray-600 mb-4">Add detailed case studies or artifacts to stand out</p>
                <textarea
                  value={profile.deepProof}
                  onChange={(e) => setProfile({ ...profile, deepProof: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                  placeholder="Describe a specific case, results achieved, or attach links to work samples..."
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('expertise')}
                  className="px-8 py-3 border-2 border-gray-300 text-[#1B1B1B] rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep('engagement')}
                  className="px-8 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-semibold"
                >
                  Next: Engagement
                </button>
              </div>
            </div>
          )}

          {currentStep === 'engagement' && (
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-[#1B1B1B] mb-2">Engagement Controls</h2>
                <p className="text-gray-600">Control how you engage</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                  How are you open to engage? (select at least one) *
                </label>
                <div className="space-y-2">
                  {FULL_ENGAGEMENT_TYPES.map((type) => (
                    <label key={type} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      profile.engagementTypes.includes(type)
                        ? 'border-[#A8FF36] bg-[#A8FF36] bg-opacity-10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={profile.engagementTypes.includes(type)}
                        onChange={() => toggleEngagement(type)}
                        className="w-5 h-5 accent-[#A8FF36]"
                      />
                      <span className="font-medium text-[#1B1B1B]">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8 space-y-5">
                <h3 className="font-bold text-[#1B1B1B] text-lg">Booking & Requirement Settings</h3>
                
                <label className={`flex items-start gap-3 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                  profile.directBookingEnabled ? 'border-[#A8FF36] bg-[#A8FF36] bg-opacity-10' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={profile.directBookingEnabled}
                    onChange={(e) => setProfile({ ...profile, directBookingEnabled: e.target.checked })}
                    className="w-5 h-5 mt-0.5 accent-[#A8FF36]"
                  />
                  <div>
                    <span className="font-semibold text-[#1B1B1B]">Enable direct booking (default OFF)</span>
                    <p className="text-sm text-gray-600 mt-1">Allow others to book time directly after requirement acceptance</p>
                  </div>
                </label>

                {profile.directBookingEnabled && (
                  <div className="ml-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-900">
                      Calendar integration required (Google/Outlook). You'll set this up after publishing.
                    </p>
                  </div>
                )}

                <label className={`flex items-start gap-3 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                  profile.requirePitch ? 'border-[#A8FF36] bg-[#A8FF36] bg-opacity-10' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={profile.requirePitch}
                    onChange={(e) => setProfile({ ...profile, requirePitch: e.target.checked })}
                    className="w-5 h-5 mt-0.5 accent-[#A8FF36]"
                  />
                  <div>
                    <span className="font-semibold text-[#1B1B1B]">Require requirement submission before engagement (recommended)</span>
                    <p className="text-sm text-gray-600 mt-1">Others must submit formal requirement for review</p>
                  </div>
                </label>
              </div>

              <div className="border-t border-gray-200 pt-8 space-y-5">
                <h3 className="font-bold text-[#1B1B1B] text-lg">Contact Visibility (Optional)</h3>
                <p className="text-sm text-gray-600">
                  Control whether to show contact details on your public profile. All contact outside platform is at your discretion.
                </p>
                
                <label className={`flex items-center gap-3 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                  profile.showContact ? 'border-[#A8FF36] bg-[#A8FF36] bg-opacity-10' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={profile.showContact}
                    onChange={(e) => setProfile({ ...profile, showContact: e.target.checked })}
                    className="w-5 h-5 accent-[#A8FF36]"
                  />
                  <span className="font-semibold text-[#1B1B1B]">Show contact information (default OFF)</span>
                </label>

                {profile.showContact && (
                  <div className="ml-8 space-y-6 p-5 bg-gray-50 border border-gray-200 rounded-xl">
                    <div>
                      <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={profile.whatsapp}
                        onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-yellow-900">
                      <strong>Disclaimer:</strong> Contact outside the platform is at your own risk. Use platform requirements for formal engagements.
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('proof')}
                  className="px-8 py-3 border-2 border-gray-300 text-[#1B1B1B] rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep('pricing')}
                  className="px-8 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-semibold"
                >
                  Next: Pricing and Rates
                </button>
              </div>
            </div>
          )}

          {currentStep === 'pricing' && (
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-[#1B1B1B] mb-2">Pricing & Rates</h2>
                <p className="text-gray-600">Set your rates for different engagement types (optional)</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-[#1B1B1B] text-lg mb-2">Pricing & Rates</h3>
                  <p className="text-sm text-gray-600">
                    Set your rates for different engagement types. Pricing is optional and you can choose to show or hide it on your profile.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Not applicable for: Pro bono, Networking only, and Equity/Co-founder engagements
                  </p>
                </div>

                {/* Select which engagement types to price */}
                <div className="grid md:grid-cols-[499px_1fr] gap-8">
                  {/* Left Column: Engagement Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                      Select engagement types you want to set pricing for (optional)
                    </label>
                    <div className="space-y-2">
                      {[
                        'Paid Consulting',
                        'Retainer',
                        'Fractional Leadership',
                        'Full-time Employment',
                        'Hourly Consulting',
                        'Advisory',
                        'Part-time Employment',
                      ].map((type) => (
                        <label key={type} className={`flex items-center gap-3 px-3 py-3 border rounded-lg cursor-pointer transition-all ${
                          profile.pricingEngagementTypes.includes(type)
                            ? 'border-[#A8FF36] bg-[#A8FF36]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="checkbox"
                            checked={profile.pricingEngagementTypes.includes(type)}
                            onChange={() => togglePricingEngagement(type)}
                            className="w-4 h-4 accent-[#A8FF36]"
                          />
                          <span className="text-sm text-[#1B1B1B]">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Pricing Fields for Selected Type */}
                  <div className="min-h-[400px] space-y-8">
                    {profile.pricingEngagementTypes.length === 0 && (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Select an engagement type to set pricing
                      </div>
                    )}

                    {/* Paid Consulting */}
                    {profile.pricingEngagementTypes.includes('Paid Consulting') && (
                      <div className="space-y-6 pb-8 border-b border-gray-200">
                        <h4 className="font-bold text-[#1B1B1B]">Paid Consulting</h4>
                          
                          {/* Pricing Model Selection */}
                          <div>
                            <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                              Choose Pricing Model
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setProfile({ ...profile, pricingModel: 'session' })}
                                className={`p-4 border-2 rounded-xl transition-all text-left ${
                                  profile.pricingModel === 'session'
                                    ? 'border-[#A8FF36] bg-[#A8FF36]'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="font-semibold text-[#1B1B1B] mb-1">Per Session</div>
                                <div className="text-xs text-gray-600">Charge by session length</div>
                              </button>
                              <button
                                type="button"
                                onClick={() => setProfile({ ...profile, pricingModel: 'hourly' })}
                                className={`p-4 border-2 rounded-xl transition-all text-left ${
                                  profile.pricingModel === 'hourly'
                                    ? 'border-[#A8FF36] bg-[#A8FF36]'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="font-semibold text-[#1B1B1B] mb-1">Per Hour</div>
                                <div className="text-xs text-gray-600">Charge hourly rate</div>
                              </button>
                            </div>
                          </div>

                          {/* Per Session Rates */}
                          {profile.pricingModel === 'session' && (
                            <div className="space-y-3">
                              <label className="block text-sm font-semibold text-[rgb(37,95,186)]">
                                Session Rates
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-2">15 minute session</label>
                                  <input
                                    type="text"
                                    value={profile.sessionRates['15min']}
                                    onChange={(e) => setProfile({ 
                                      ...profile, 
                                      sessionRates: { ...profile.sessionRates, '15min': e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                    placeholder="$50"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-2">30 minute session</label>
                                  <input
                                    type="text"
                                    value={profile.sessionRates['30min']}
                                    onChange={(e) => setProfile({ 
                                      ...profile, 
                                      sessionRates: { ...profile.sessionRates, '30min': e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                    placeholder="$100"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-2">45 minute session</label>
                                  <input
                                    type="text"
                                    value={profile.sessionRates['45min']}
                                    onChange={(e) => setProfile({ 
                                      ...profile, 
                                      sessionRates: { ...profile.sessionRates, '45min': e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                    placeholder="$150"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-2">60 minute session (1 hour)</label>
                                  <input
                                    type="text"
                                    value={profile.sessionRates['60min']}
                                    onChange={(e) => setProfile({ 
                                      ...profile, 
                                      sessionRates: { ...profile.sessionRates, '60min': e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                    placeholder="$200"
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                💡 You can fill in only the session lengths you offer. Leave others blank.
                              </p>
                            </div>
                          )}

                          {/* Hourly Rate */}
                          {profile.pricingModel === 'hourly' && (
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                                  Hourly Rate
                                </label>
                                <input
                                  type="text"
                                  value={profile.hourlyRate}
                                  onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                  placeholder="$200/hour"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                                  Minimum Commitment
                                </label>
                                <input
                                  type="text"
                                  value={profile.minimumCommitment}
                                  onChange={(e) => setProfile({ ...profile, minimumCommitment: e.target.value })}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                  placeholder="e.g., 10 hours/month"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    {/* Hourly Consulting */}
                    {profile.pricingEngagementTypes.includes('Hourly Consulting') && (
                      <div className="space-y-6 pb-8 border-b border-gray-200">
                        <h4 className="font-bold text-[#1B1B1B]">Hourly Consulting</h4>
                          
                          {/* Pricing Model Selection */}
                          <div>
                            <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-3">
                              Choose Pricing Model
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setProfile({ ...profile, pricingModel: 'session' })}
                                className={`p-4 border-2 rounded-xl transition-all text-left ${
                                  profile.pricingModel === 'session'
                                    ? 'border-[#A8FF36] bg-[#A8FF36]'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="font-semibold text-[#1B1B1B] mb-1">Per Session</div>
                                <div className="text-xs text-gray-600">Charge by session length</div>
                              </button>
                              <button
                                type="button"
                                onClick={() => setProfile({ ...profile, pricingModel: 'hourly' })}
                                className={`p-4 border-2 rounded-xl transition-all text-left ${
                                  profile.pricingModel === 'hourly'
                                    ? 'border-[#A8FF36] bg-[#A8FF36]'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="font-semibold text-[#1B1B1B] mb-1">Per Hour</div>
                                <div className="text-xs text-gray-600">Charge hourly rate</div>
                              </button>
                            </div>
                          </div>

                          {/* Per Session Rates */}
                          {profile.pricingModel === 'session' && (
                            <div className="space-y-3">
                              <label className="block text-sm font-semibold text-[rgb(37,95,186)]">
                                Session Rates
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-2">15 minute session</label>
                                  <input
                                    type="text"
                                    value={profile.sessionRates['15min']}
                                    onChange={(e) => setProfile({ 
                                      ...profile, 
                                      sessionRates: { ...profile.sessionRates, '15min': e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                    placeholder="$50"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-2">30 minute session</label>
                                  <input
                                    type="text"
                                    value={profile.sessionRates['30min']}
                                    onChange={(e) => setProfile({ 
                                      ...profile, 
                                      sessionRates: { ...profile.sessionRates, '30min': e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                    placeholder="$100"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-2">45 minute session</label>
                                  <input
                                    type="text"
                                    value={profile.sessionRates['45min']}
                                    onChange={(e) => setProfile({ 
                                      ...profile, 
                                      sessionRates: { ...profile.sessionRates, '45min': e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                    placeholder="$150"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-2">60 minute session (1 hour)</label>
                                  <input
                                    type="text"
                                    value={profile.sessionRates['60min']}
                                    onChange={(e) => setProfile({ 
                                      ...profile, 
                                      sessionRates: { ...profile.sessionRates, '60min': e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                    placeholder="$200"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Hourly Rate */}
                          {profile.pricingModel === 'hourly' && (
                            <div>
                              <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                                Hourly Rate
                              </label>
                              <input
                                type="text"
                                value={profile.hourlyRate}
                                onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                placeholder="$200/hour"
                              />
                            </div>
                          )}
                        </div>
                      )}

                    {/* Retainer */}
                    {profile.pricingEngagementTypes.includes('Retainer') && (
                      <div className="space-y-4 pb-8 border-b border-gray-200">
                        <h4 className="font-bold text-[#1B1B1B]">Retainer</h4>
                          <p className="text-sm text-gray-600">
                            Set a monthly retainer amount and the included hours per month
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                                Monthly Amount
                              </label>
                              <input
                                type="text"
                                value={profile.retainerMonthlyAmount}
                                onChange={(e) => setProfile({ ...profile, retainerMonthlyAmount: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                placeholder="$10,000"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                                Hours per Month
                              </label>
                              <input
                                type="text"
                                value={profile.retainerHoursPerMonth}
                                onChange={(e) => setProfile({ ...profile, retainerHoursPerMonth: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                                placeholder="20 hours"
                              />
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">
                              💡 <strong>Example:</strong> $10,000/month for 20 hours = effective rate of $500/hour
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Advisory Note */}
                      {profile.pricingEngagementTypes.includes('Advisory') && (
                        <div className="space-y-4 pb-8 border-b border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-[#1B1B1B]">Advisory</h4>
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Note</span>
                          </div>
                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-sm text-purple-900">
                              💼 Advisory engagements can use <strong>Retainer pricing</strong> above, or you can specify "Equity preferred" or "Negotiable" in discussions. No need to set pricing here if you prefer to discuss case-by-case.
                            </p>
                          </div>
                        </div>
                      )}

                    {/* Fractional Leadership */}
                    {profile.pricingEngagementTypes.includes('Fractional Leadership') && (
                      <div className="space-y-4 pb-8 border-b border-gray-200">
                        <h4 className="font-bold text-[#1B1B1B]">Fractional Leadership</h4>
                        <p className="text-sm text-gray-600">
                          Set your monthly rate for fractional/part-time leadership roles
                        </p>
                        <div>
                          <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                            Monthly Rate
                          </label>
                          <input
                            type="text"
                            value={profile.fractionalMonthlyRate}
                            onChange={(e) => setProfile({ ...profile, fractionalMonthlyRate: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                            placeholder="$15,000/month"
                          />
                        </div>
                      </div>
                    )}

                    {/* Full-time Employment */}
                    {profile.pricingEngagementTypes.includes('Full-time Employment') && (
                      <div className="space-y-4 pb-8 border-b border-gray-200">
                        <h4 className="font-bold text-[#1B1B1B]">Full-time Employment</h4>
                        <p className="text-sm text-gray-600">
                          Set your expected annual salary for full-time roles
                        </p>
                        <div>
                          <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                            Annual Salary Expectation
                          </label>
                          <input
                            type="text"
                            value={profile.fullTimeAnnualSalary}
                            onChange={(e) => setProfile({ ...profile, fullTimeAnnualSalary: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                            placeholder="$250,000/year"
                          />
                        </div>
                      </div>
                    )}

                    {/* Part-time Employment */}
                    {profile.pricingEngagementTypes.includes('Part-time Employment') && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-[#1B1B1B]">Part-time Employment</h4>
                        <p className="text-sm text-gray-600">
                          Set your hourly or monthly rate for part-time employment
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                              Hourly Rate
                            </label>
                            <input
                              type="text"
                              value={profile.partTimeHourlyRate}
                              onChange={(e) => setProfile({ ...profile, partTimeHourlyRate: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                              placeholder="$150/hour"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[rgb(37,95,186)] mb-2">
                              Expected Hours/Week
                            </label>
                            <input
                              type="text"
                              value={profile.minimumCommitment}
                              onChange={(e) => setProfile({ ...profile, minimumCommitment: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8FF36] focus:border-transparent transition-all"
                              placeholder="20 hours/week"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing Visibility Toggle */}
                {profile.pricingEngagementTypes.length > 0 && (
                  <div className="pt-6 border-t border-gray-200">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={profile.showPricing}
                        onChange={(e) => setProfile({ ...profile, showPricing: e.target.checked })}
                        className="w-5 h-5 accent-[#A8FF36]"
                      />
                      <div>
                        <span className="font-semibold text-[#1B1B1B]">Show my pricing to others</span>
                        <p className="text-sm text-gray-600 mt-0.5">Display rates publicly on your profile</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('engagement')}
                  className="px-8 py-3 border-2 border-gray-300 text-[#1B1B1B] rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep('preview')}
                  className="px-8 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-semibold"
                >
                  Preview & Publish
                </button>
              </div>
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-[#1B1B1B] mb-2">Preview Your Profile</h2>
                <p className="text-gray-600">Review before publishing</p>
              </div>

              <div className="border-2 border-gray-200 rounded-2xl p-8 space-y-6 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start gap-6">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt={profile.displayName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#A8FF36]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center flex-shrink-0">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-[#1B1B1B] mb-2">{profile.displayName || '—'}</h3>
                    <p className="text-xl text-gray-700 font-medium">{profile.primaryExpertise || '—'}</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">{profile.yearsExperience ? `${profile.yearsExperience} years experience` : '—'}</p>
                  </div>
                </div>

                {profile.bio && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Bio</h3>
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {profile.brands.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">Brands Worked With</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.brands.map((brand, index) => (
                        <span key={index} className="px-4 py-2 bg-white border-2 border-gray-200 rounded-full text-sm font-medium text-gray-700">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.scaleIndicators.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">Scale Indicators</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.scaleIndicators.map((indicator, index) => (
                        <span key={index} className="px-4 py-2 bg-green-50 text-green-700 border-2 border-green-200 rounded-full text-sm font-medium">
                          ✓ {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">Open to</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.engagementTypes.map((type, index) => (
                      <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 border-2 border-blue-200 rounded-full text-sm font-medium">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {profile.showPricing && profile.pricingEngagementTypes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">Pricing & Rates</h3>
                    <div className="space-y-4">
                      {/* Paid/Hourly Consulting - Session Rates */}
                      {(profile.pricingEngagementTypes.includes('Paid Consulting') || 
                        profile.pricingEngagementTypes.includes('Hourly Consulting')) && 
                        profile.pricingModel === 'session' && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-bold text-blue-900 mb-2">Paid/Hourly Consulting - Session Rates</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                            {profile.sessionRates['15min'] && <div>• 15 min: {profile.sessionRates['15min']}</div>}
                            {profile.sessionRates['30min'] && <div>• 30 min: {profile.sessionRates['30min']}</div>}
                            {profile.sessionRates['45min'] && <div>• 45 min: {profile.sessionRates['45min']}</div>}
                            {profile.sessionRates['60min'] && <div>• 60 min: {profile.sessionRates['60min']}</div>}
                          </div>
                        </div>
                      )}

                      {/* Paid/Hourly Consulting - Hourly Rate */}
                      {(profile.pricingEngagementTypes.includes('Paid Consulting') || 
                        profile.pricingEngagementTypes.includes('Hourly Consulting')) && 
                        profile.pricingModel === 'hourly' && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-bold text-blue-900 mb-2">Paid/Hourly Consulting</h4>
                          <div className="text-sm text-blue-800">
                            {profile.hourlyRate && <div>• Hourly Rate: {profile.hourlyRate}</div>}
                            {profile.minimumCommitment && <div>• Minimum Commitment: {profile.minimumCommitment}</div>}
                          </div>
                        </div>
                      )}

                      {/* Retainer */}
                      {profile.pricingEngagementTypes.includes('Retainer') && (
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <h4 className="font-bold text-purple-900 mb-2">Retainer</h4>
                          <div className="text-sm text-purple-800">
                            {profile.retainerMonthlyAmount && <div>• Monthly Amount: {profile.retainerMonthlyAmount}</div>}
                            {profile.retainerHoursPerMonth && <div>• Hours per Month: {profile.retainerHoursPerMonth}</div>}
                          </div>
                        </div>
                      )}

                      {/* Fractional Leadership */}
                      {profile.pricingEngagementTypes.includes('Fractional Leadership') && profile.fractionalMonthlyRate && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-bold text-green-900 mb-2">Fractional Leadership</h4>
                          <div className="text-sm text-green-800">
                            • Monthly Rate: {profile.fractionalMonthlyRate}
                          </div>
                        </div>
                      )}

                      {/* Part-time Employment */}
                      {profile.pricingEngagementTypes.includes('Part-time Employment') && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <h4 className="font-bold text-orange-900 mb-2">Part-time Employment</h4>
                          <div className="text-sm text-orange-800">
                            {profile.partTimeHourlyRate && <div>• Hourly Rate: {profile.partTimeHourlyRate}</div>}
                            {profile.minimumCommitment && <div>• Expected Hours/Week: {profile.minimumCommitment}</div>}
                          </div>
                        </div>
                      )}

                      {/* Full-time Employment */}
                      {profile.pricingEngagementTypes.includes('Full-time Employment') && profile.fullTimeAnnualSalary && (
                        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                          <h4 className="font-bold text-indigo-900 mb-2">Full-time Employment</h4>
                          <div className="text-sm text-indigo-800">
                            • Annual Salary Expectation: {profile.fullTimeAnnualSalary}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!canPublish && (
                <div className="bg-red-50 border-2 border-red-200 p-5 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-900">
                    <strong className="text-base">Cannot publish yet:</strong> Please complete all required fields:
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      {!profile.displayName && <li>Display name</li>}
                      {!profile.primaryExpertise && <li>Primary expertise</li>}
                      {!profile.yearsExperience && <li>Years of experience</li>}
                      {!profile.bio && <li>Short bio</li>}
                      {profile.engagementTypes.length === 0 && <li>At least one engagement type</li>}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('pricing')}
                  className="px-8 py-3 border-2 border-gray-300 text-[#1B1B1B] rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={!canPublish}
                  className={`px-8 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                    canPublish
                      ? 'bg-[#A8FF36] text-[#1B1B1B] hover:bg-[#98EF26]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  Submit for Approval
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
