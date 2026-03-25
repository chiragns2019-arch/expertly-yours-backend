import { useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Upload, X, Paperclip, ChevronUp, ChevronDown, Send, Save, Zap, FileText, DollarSign, Clock, Building, Sparkles } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { api } from '../services/api';
import { PostLoginNav } from './PostLoginNav';

export function RequirementSubmission() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get selected experts from navigation state (from Bookmarks or Discovery page)
  const expertsFromState = location.state?.selectedExperts || [];
  
  const [requirement, setRequirement] = useState({
    problemDescription: '',
    timeCommitment: '',
    offerType: '',
    offerDetails: '',
    companyName: '',
    companyStage: '',
    additionalContext: '',
  });

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showAllExperts, setShowAllExperts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSavedRequirements, setShowSavedRequirements] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [postToBoard, setPostToBoard] = useState(false);

  // State for managing selected experts - initialize with experts from navigation state
  // Normalize the profilePicture/avatar field to ensure compatibility
  const [selectedExperts, setSelectedExperts] = useState(
    expertsFromState.length > 0 
      ? expertsFromState.map((expert: any) => ({
          ...expert,
          profilePicture: expert.profilePicture || expert.avatar,
        }))
      : []
  );

  // Mock saved requirements/drafts
  const savedRequirements = [
    {
      id: 'req-123',
      title: 'B2B SaaS Growth Strategy',
      problemDescription: 'Looking for help with our B2B SaaS product\'s go-to-market strategy...',
      companyName: 'TechCorp',
      companyStage: 'seed',
      timeCommitment: 'short-term',
      offerType: 'paid',
      offerDetails: '$150/hour for 3 month engagement',
      additionalContext: '',
      sentCount: 8,
      createdAt: 'Just now',
      hasAttachments: true,
      isDraft: false,
    },
    {
      id: 'req-draft-1',
      title: 'Product Roadmap Review (Draft)',
      problemDescription: 'Need expert review of our product roadmap for Q2 2026...',
      companyName: 'StartupXYZ',
      companyStage: 'pre-seed',
      timeCommitment: 'one-time',
      offerType: 'paid',
      offerDetails: '$200 one-time fee',
      additionalContext: 'We have a deck ready',
      sentCount: 0,
      createdAt: '2 days ago',
      hasAttachments: false,
      isDraft: true,
    },
  ];

  const isBulkSend = selectedExperts.length > 1;
  const expertName = 'Dr. Jane Smith';
  const expertExpertise = 'B2B SaaS Growth Marketing';

  const displayedExperts = showAllExperts ? selectedExperts : selectedExperts.slice(0, 4);
  const remainingCount = selectedExperts.length - 4;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles([...attachedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        title: requirement.companyName ? `${requirement.companyName} Requirement` : 'Untitled Requirement',
        description: requirement.problemDescription,
        companyName: requirement.companyName,
        companyStage: requirement.companyStage,
        timeCommitment: requirement.timeCommitment,
        offerType: requirement.offerType,
        offerDetails: requirement.offerDetails,
        additionalContext: requirement.additionalContext,
        isDraft: false,
        isPublic: postToBoard,
        expertIds: selectedExperts.map((exp: any) => exp.id),
      };
      await api.post('/requirements', payload);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to send requirement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const payload = {
        title: requirement.companyName ? `${requirement.companyName} Draft` : 'Untitled Draft',
        description: requirement.problemDescription,
        companyName: requirement.companyName,
        companyStage: requirement.companyStage,
        timeCommitment: requirement.timeCommitment,
        offerType: requirement.offerType,
        offerDetails: requirement.offerDetails,
        additionalContext: requirement.additionalContext,
        isDraft: true,
      };
      await api.post('/requirements/draft', payload);
      setSaveMessage('Draft saved! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const loadRequirement = (req: typeof savedRequirements[0]) => {
    setRequirement({
      problemDescription: req.problemDescription,
      timeCommitment: req.timeCommitment,
      offerType: req.offerType,
      offerDetails: req.offerDetails,
      companyName: req.companyName,
      companyStage: req.companyStage,
      additionalContext: req.additionalContext,
    });
    setShowSavedRequirements(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeExpert = (expertId: number) => {
    setSelectedExperts(selectedExperts.filter(expert => expert.id !== expertId));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Navigation */}
      <PostLoginNav />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1B1B1B] transition-colors group font-medium"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Discovery
            </Link>

            {/* How it Works Button - Moved to top right */}
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <Zap className="w-4 h-4" />
              {showHowItWorks ? 'Hide' : 'How it Works'}
              {showHowItWorks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-300 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-semibold text-sm">Share Your Requirement</span>
            </div>

            <h1 className="text-5xl font-bold text-[#1B1B1B] mb-4">
              Connect with the Right Experts
            </h1>
            
            {isBulkSend ? (
              <p className="text-xl text-gray-700 mb-8">
                Sending this requirement to <span className="text-blue-600 font-bold">{selectedExperts.length} experts</span> in one shot
              </p>
            ) : (
              <p className="text-xl text-gray-700 mb-8">
                To: <span className="text-blue-600 font-bold">{expertName}</span> · {expertExpertise}
              </p>
            )}

            {/* Expert Cards Section - Moved here */}
            {isBulkSend && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-8 shadow-sm max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Send className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1B1B1B]">Sending to {selectedExperts.length} Experts</h3>
                </div>
                
                {/* Horizontal scrolling expert cards */}
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-4 min-w-max">
                    {selectedExperts.map((expert) => (
                      <div
                        key={expert.id}
                        className="relative group bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 hover:border-blue-300 transition-all w-32"
                      >
                        <button
                          type="button"
                          onClick={() => removeExpert(expert.id)}
                          className="absolute top-2 right-2 p-1 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 z-10"
                          title={`Remove ${expert.name}`}
                        >
                          <X className="w-3 h-3 text-gray-600 hover:text-red-600" />
                        </button>
                        <div className="flex flex-col items-center text-center">
                          <img 
                            src={expert.profilePicture} 
                            alt={expert.name}
                            className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-lg mb-3"
                          />
                          <p className="font-bold text-[#1B1B1B] text-sm line-clamp-2 leading-tight">{expert.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Collapsible How it Works Modal */}
            {showHowItWorks && (
              <div className="mt-6 bg-white border-2 border-blue-300 rounded-2xl p-8 text-left max-w-2xl mx-auto shadow-xl animate-in slide-in-from-top duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1B1B1B] mb-2">How it Works</h3>
                    <p className="text-gray-600">Share once, reach many experts efficiently</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHowItWorks(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1B1B1B] mb-1">Describe Your Challenge</h4>
                      <p className="text-gray-700">Fill out the form once with your specific problem or opportunity. Be clear about what you need help with.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1B1B1B] mb-1">Send to Multiple Experts</h4>
                      <p className="text-gray-700">Your requirement is shared with all {selectedExperts.length} selected experts in one click—no need to repeat yourself.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1B1B1B] mb-1">Experts Review & Respond</h4>
                      <p className="text-gray-700">Experts review your requirement and respond only if they see a good fit. No spam, no tire-kickers—just qualified connections.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1B1B1B] mb-1">Connect & Engage</h4>
                      <p className="text-gray-700">When an expert accepts, you'll be notified and can book a time to discuss your project in detail.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Pro Tip:</strong> Save your requirement as a draft to reuse it with different experts later!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 rounded-2xl p-8 space-y-12 shadow-sm">
          {/* Microcopy Header with Load Requirement Button */}
          <div className="pb-6 border-b-2 border-gray-200">
            <div className="flex items-start justify-between gap-6 mb-4">
              <p className="text-gray-700 text-base leading-relaxed flex-1">
                <span className="font-semibold text-[#1B1B1B]">Fill in your requirement details below.</span> The more specific you are about your challenge, timeline, and offer, the better experts can evaluate if they're the right fit to help you.
              </p>
              
              {savedRequirements.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowSavedRequirements(!showSavedRequirements)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-blue-50 border-2 border-blue-300 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-semibold"
                >
                  <FileText className="w-4 h-4" />
                  Load Saved ({savedRequirements.length})
                  {showSavedRequirements ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {/* Collapsible Saved Requirements List */}
            {showSavedRequirements && savedRequirements.length > 0 && (
              <div className="mt-4 p-6 bg-gray-50 border-2 border-gray-200 rounded-xl space-y-4">
                {savedRequirements.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-[#1B1B1B]">{req.companyName}</h4>
                          {req.isDraft && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm mb-2 line-clamp-2">{req.problemDescription}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                          {!req.isDraft && <span>✓ Sent to {req.sentCount} experts</span>}
                          <span>•</span>
                          <span>{req.createdAt}</span>
                          {req.hasAttachments && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Paperclip className="w-3 h-3" />
                                Attachments
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => loadRequirement(req)}
                        className="px-5 py-2.5 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold text-sm"
                      >
                        Load
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Company Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-[rgb(37,95,186)] mb-3 uppercase tracking-wide">
                <Building className="w-4 h-4 text-blue-600" />
                Company / Project Name *
              </label>
              <input
                type="text"
                required
                value={requirement.companyName}
                onChange={(e) => setRequirement({ ...requirement, companyName: e.target.value })}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-[#1B1B1B] placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Your company or project name"
              />
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-bold text-[rgb(37,95,186)] mb-3 uppercase tracking-wide">
                Stage
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'idea', label: 'Idea' },
                  { value: 'pre-seed', label: 'Pre-seed' },
                  { value: 'seed', label: 'Seed' },
                  { value: 'series-a', label: 'Series A' },
                  { value: 'series-b+', label: 'Series B+' },
                  { value: 'established', label: 'Established' },
                ].map((stage) => (
                  <button
                    key={stage.value}
                    type="button"
                    onClick={() => setRequirement({ ...requirement, companyStage: stage.value })}
                    className={`px-4 py-2.5 rounded-xl border-2 transition-all font-semibold ${
                      requirement.companyStage === stage.value
                        ? 'bg-[#A8FF36] border-[#A8FF36] text-[#1B1B1B]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-[rgb(37,95,186)] mb-3 uppercase tracking-wide">
              <FileText className="w-4 h-4 text-blue-600" />
              Problem Description *
            </label>
            <textarea
              required
              value={requirement.problemDescription}
              onChange={(e) => setRequirement({ ...requirement, problemDescription: e.target.value })}
              rows={6}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-[#1B1B1B] placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              placeholder="Describe the specific challenge or opportunity you need help with. Be as specific as possible about what you're trying to achieve..."
            />
            <p className="text-sm text-gray-600 mt-2">What problem are you trying to solve?</p>
          </div>

          {/* Time Commitment */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-[rgb(37,95,186)] mb-3 uppercase tracking-wide">
              <Clock className="w-4 h-4 text-blue-600" />
              Expected Time Commitment *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'one-time', label: 'One-time (1-2 hours)' },
                { value: 'short-term', label: 'Short-term (1-3 months)' },
                { value: 'medium-term', label: 'Medium-term (3-6 months)' },
                { value: 'long-term', label: 'Long-term (6+ months)' },
                { value: 'ongoing', label: 'Ongoing retainer' },
              ].map((time) => (
                <button
                  key={time.value}
                  type="button"
                  onClick={() => setRequirement({ ...requirement, timeCommitment: time.value })}
                  className={`px-4 py-3 rounded-xl border-2 transition-all font-semibold text-sm ${
                    requirement.timeCommitment === time.value
                      ? 'bg-[#A8FF36] border-[#A8FF36] text-[#1B1B1B]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* What You're Offering */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-[rgb(37,95,186)] mb-3 uppercase tracking-wide">
              <DollarSign className="w-4 h-4 text-blue-600" />
              What You're Offering *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {[
                { value: 'paid', label: 'Paid' },
                { value: 'advisory', label: 'Advisory' },
                { value: 'equity', label: 'Equity / Co-founder' },
                { value: 'networking', label: 'Networking' },
                { value: 'pro-bono', label: 'Pro bono' },
              ].map((offer) => (
                <button
                  key={offer.value}
                  type="button"
                  onClick={() => setRequirement({ ...requirement, offerType: offer.value })}
                  className={`px-4 py-3 rounded-xl border-2 transition-all font-semibold ${
                    requirement.offerType === offer.value
                      ? 'bg-[#A8FF36] border-[#A8FF36] text-[#1B1B1B]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {offer.label}
                </button>
              ))}
            </div>
            <textarea
              required
              value={requirement.offerDetails}
              onChange={(e) => setRequirement({ ...requirement, offerDetails: e.target.value })}
              rows={4}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-[#1B1B1B] placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              placeholder="Be specific: hourly rate, total budget, equity percentage, or other compensation details..."
            />
          </div>

          {/* Additional Context */}
          <div>
            <label className="block text-sm font-bold text-[rgb(37,95,186)] mb-3 uppercase tracking-wide">
              Additional Context
            </label>
            <textarea
              value={requirement.additionalContext}
              onChange={(e) => setRequirement({ ...requirement, additionalContext: e.target.value })}
              rows={4}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-[#1B1B1B] placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              placeholder="Any other relevant information about your company, team, traction, or why this expert is a good fit..."
            />
          </div>

          {/* File Attachments */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-[rgb(37,95,186)] mb-3 uppercase tracking-wide">
              <Paperclip className="w-4 h-4 text-blue-600" />
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-all bg-gray-50">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-[#1B1B1B] font-semibold mb-2">
                Drag and drop or browse files
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Attach documents, PDFs, images, or presentations
              </p>
              <label className="inline-flex items-center px-6 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] cursor-pointer font-bold transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.gif"
                />
                Choose Files
              </label>
              <p className="text-xs text-gray-500 mt-3">
                Supported: PDF, Word, PowerPoint, Excel, Images (Max 10MB per file)
              </p>
            </div>

            {/* Attached Files List */}
            {attachedFiles.length > 0 && (
              <div className="mt-4 space-y-4">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 border-2 border-gray-200 rounded-xl px-5 py-4 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Paperclip className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#1B1B1B] truncate">{file.name}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <X className="w-5 h-5 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-center">
              <p className="text-green-700 font-semibold">{saveMessage}</p>
            </div>
          )}

          {/* Post to Requirements Board Checkbox */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={postToBoard}
                onChange={(e) => setPostToBoard(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[#1B1B1B]">Post to Requirements Board</span>
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">PUBLIC</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Make this requirement publicly visible on the Requirements Board so any expert can browse and respond. 
                  This gives you maximum reach beyond just the experts you're sending it to.
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t-2 border-gray-200">
            <Link
              to="/discover"
              className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold text-center"
            >
              Cancel
            </Link>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3.5 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {isSaving ? 'Sending...' : 'Share Requirement'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}