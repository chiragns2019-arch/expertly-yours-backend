import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, Upload, X, Paperclip, Send, Save, Zap, FileText, DollarSign, Clock, Building, Sparkles, Trash2 } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { PostLoginNav } from './PostLoginNav';
import { api } from '../services/api';
import { useEffect } from 'react';

export function SingleExpertRequirement() {
  const { expertId } = useParams();
  const navigate = useNavigate();
  
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
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSavedRequirementsModal, setShowSavedRequirementsModal] = useState(false);
  const [savedRequirementsList, setSavedRequirementsList] = useState([
    {
      id: 'req-123',
      title: 'B2B SaaS Growth Strategy',
      problemDescription: 'Looking for help with our B2B SaaS product\'s go-to-market strategy. We need someone who has scaled multiple B2B products from 0 to significant revenue.',
      companyName: 'TechCorp',
      companyStage: 'seed',
      timeCommitment: 'short-term',
      offerType: 'paid',
      offerDetails: '$150/hour for 3 month engagement',
      additionalContext: '',
      createdAt: '2 days ago',
      hasAttachments: true,
      isDraft: false,
    },
    {
      id: 'req-draft-1',
      title: 'Product Roadmap Review (Draft)',
      problemDescription: 'Need expert review of our product roadmap for Q2 2026. Looking for strategic guidance on feature prioritization.',
      companyName: 'StartupXYZ',
      companyStage: 'pre-seed',
      timeCommitment: 'one-time',
      offerType: 'paid',
      offerDetails: '$200 one-time fee',
      additionalContext: 'We have a deck ready',
      createdAt: '5 days ago',
      hasAttachments: false,
      isDraft: true,
    },
    {
      id: 'req-456',
      title: 'AI/ML Implementation Strategy',
      problemDescription: 'Looking for guidance on implementing machine learning features in our fintech product. Need help with architecture decisions and team structure.',
      companyName: 'FinTechPro',
      companyStage: 'series-a',
      timeCommitment: 'ongoing',
      offerType: 'hybrid',
      offerDetails: '$120/hour + 0.15% equity',
      additionalContext: 'Currently have 2 ML engineers on the team',
      createdAt: '1 week ago',
      hasAttachments: false,
      isDraft: false,
    },
    {
      id: 'req-789',
      title: 'Sales Process Optimization',
      problemDescription: 'Our sales cycle is too long (6+ months). Need an expert who has optimized enterprise B2B sales processes before.',
      companyName: 'EnterpriseApp Inc',
      companyStage: 'series-b',
      timeCommitment: 'short-term',
      offerType: 'paid',
      offerDetails: '$200/hour, 20 hours total',
      additionalContext: 'Current team of 5 AEs',
      createdAt: '2 weeks ago',
      hasAttachments: true,
      isDraft: false,
    },
    {
      id: 'req-draft-2',
      title: 'Content Marketing Strategy (Draft)',
      problemDescription: 'Need to build out content marketing from scratch. Looking for someone who has built successful B2B SaaS content engines.',
      companyName: 'CloudSolutions',
      companyStage: 'seed',
      timeCommitment: 'ongoing',
      offerType: 'equity',
      offerDetails: '0.3% equity, advisory role',
      additionalContext: '',
      createdAt: '3 weeks ago',
      hasAttachments: false,
      isDraft: true,
    },
  ]);

  const [expert, setExpert] = useState<any>(null);
  const [isLoadingExpert, setIsLoadingExpert] = useState(false);

  useEffect(() => {
    if (expertId) {
      const fetchExpert = async () => {
        try {
          setIsLoadingExpert(true);
          const data = await api.get(`/experts/${expertId}`);
          setExpert({
            id: data.id,
            name: data.user?.name || 'Unknown Expert',
            avatar: data.user?.avatar || 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg',
            title: data.title || 'Expert',
            expertise: data.expertise || 'Specialized Expertise',
          });
        } catch (error) {
          console.error('Failed to fetch expert', error);
        } finally {
          setIsLoadingExpert(false);
        }
      };
      fetchExpert();
    }
  }, [expertId]);

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
        isPublic: true,
        expertIds: expert ? [expert.id] : [],
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
        isPublic: false,
      };
      await api.post('/requirements/draft', payload);
      setSaveMessage('Draft saved! You can send this to more experts anytime.');
    } catch (err) {
      console.error(err);
      alert('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const loadRequirement = (req: typeof savedRequirementsList[0]) => {
    setRequirement({
      problemDescription: req.problemDescription,
      timeCommitment: req.timeCommitment,
      offerType: req.offerType,
      offerDetails: req.offerDetails,
      companyName: req.companyName,
      companyStage: req.companyStage,
      additionalContext: req.additionalContext,
    });
    setShowSavedRequirementsModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteRequirement = (reqId: string) => {
    setSavedRequirementsList(savedRequirementsList.filter(req => req.id !== reqId));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <PostLoginNav />

      <div className="max-w-5xl mx-auto px-8 py-10 pt-24">
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1B1B1B] transition-colors mb-8 group font-medium"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Discovery
        </Link>

        {/* Expert Card at Top */}
        <div className="bg-white border-2 border-blue-300 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-[#1B1B1B]">Sending requirement to:</h2>
          </div>
          
          {isLoadingExpert ? (
             <div className="flex items-center gap-4 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
             </div>
          ) : expert ? (
            <div className="flex items-center gap-4">
              <Link to={`/profile/${expert.id}`}>
                <img
                  src={expert.avatar}
                  alt={expert.name}
                  className="w-20 h-20 rounded-xl border-2 border-white shadow-lg object-cover hover:opacity-90 transition-opacity cursor-pointer"
                />
              </Link>
              <div className="flex-1">
                <Link to={`/profile/${expert.id}`}>
                  <h3 className="text-2xl font-bold text-[#1B1B1B] hover:text-blue-600 transition-colors cursor-pointer">
                    {expert.name}
                  </h3>
                </Link>
                <p className="text-gray-600 font-medium">{expert.title}</p>
                <p className="text-sm text-blue-600 font-semibold mt-1">{expert.expertise}</p>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic">No expert selected or expert not found.</div>
          )}
        </div>

        {/* Requirement Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1B1B1B]">Your Requirement Details</h2>
              <button
                type="button"
                onClick={() => setShowSavedRequirementsModal(true)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors"
              >
                <FileText className="w-5 h-5" />
                Load From Saved Requirements
              </button>
            </div>

            {/* Problem Description */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-[#1B1B1B] mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                What do you need help with? <span className="text-red-600">*</span>
              </label>
              <textarea
                required
                value={requirement.problemDescription}
                onChange={(e) => setRequirement({ ...requirement, problemDescription: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                rows={6}
                placeholder="Describe your challenge, project, or what you're looking to accomplish. Be specific about what you need."
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: The more context you provide, the better experts can evaluate if they're the right fit
              </p>
            </div>

            {/* Company Information */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#1B1B1B] mb-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Company Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={requirement.companyName}
                  onChange={(e) => setRequirement({ ...requirement, companyName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Your company or project name"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#1B1B1B] mb-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Company Stage
                </label>
                <select
                  value={requirement.companyStage}
                  onChange={(e) => setRequirement({ ...requirement, companyStage: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select stage</option>
                  <option value="idea">Idea / Pre-launch</option>
                  <option value="pre-seed">Pre-seed</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b">Series B+</option>
                  <option value="established">Established / Enterprise</option>
                </select>
              </div>
            </div>

            {/* Time Commitment */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-[#1B1B1B] mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Expected Time Commitment
              </label>
              <select
                value={requirement.timeCommitment}
                onChange={(e) => setRequirement({ ...requirement, timeCommitment: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select time commitment</option>
                <option value="one-time">One-time consultation (1-2 hours)</option>
                <option value="short-term">Short-term (1-3 months)</option>
                <option value="ongoing">Ongoing engagement (3+ months)</option>
                <option value="flexible">Flexible / To be discussed</option>
              </select>
            </div>

            {/* Offer Type */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-[#1B1B1B] mb-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                What are you offering? <span className="text-red-600">*</span>
              </label>
              <select
                required
                value={requirement.offerType}
                onChange={(e) => setRequirement({ ...requirement, offerType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select offer type</option>
                <option value="paid">💰 Paid Consulting</option>
                <option value="equity">📈 Equity / Advisory Shares</option>
                <option value="hybrid">🤝 Paid + Equity</option>
                <option value="networking">🌐 Networking / Portfolio Value</option>
              </select>
            </div>

            {/* Offer Details */}
            {requirement.offerType && (
              <div className="mb-6">
                <label className="text-sm font-bold text-[#1B1B1B] mb-2 block">
                  Offer Details <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  value={requirement.offerDetails}
                  onChange={(e) => setRequirement({ ...requirement, offerDetails: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  rows={3}
                  placeholder={
                    requirement.offerType === 'paid'
                      ? 'e.g., $150/hour for 10 hours over 3 months'
                      : requirement.offerType === 'equity'
                      ? 'e.g., 0.5% equity with 2-year vesting'
                      : requirement.offerType === 'hybrid'
                      ? 'e.g., $100/hour + 0.25% equity'
                      : 'e.g., Access to network of 50+ founders, portfolio company status'
                  }
                />
              </div>
            )}

            {/* Additional Context */}
            <div className="mb-6">
              <label className="text-sm font-bold text-[#1B1B1B] mb-2 block">
                Additional Context (Optional)
              </label>
              <textarea
                value={requirement.additionalContext}
                onChange={(e) => setRequirement({ ...requirement, additionalContext: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                rows={3}
                placeholder="Any other relevant information, links, or context"
              />
            </div>

            {/* File Attachments */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-[#1B1B1B] mb-2">
                <Paperclip className="w-4 h-4 text-blue-600" />
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  Drag & drop files here, or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Choose Files
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PDFs, images, or documents (max 10MB each)
                </p>
              </div>

              {attachedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 border-2 border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#1B1B1B] truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}\n                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Save as Draft
            </button>
            
            <button
              type="submit"
              disabled={isSaving || !expert}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#1B1B1B] border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Requirement to {expert?.name || 'Expert'}
                </>
              )}
            </button>
          </div>

          {saveMessage && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-xl">
              <p className="text-green-700 font-semibold text-sm">{saveMessage}</p>
            </div>
          )}
        </form>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-2xl">
          <h3 className="font-bold text-[#1B1B1B] mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>{expert?.name || 'The expert'} will review your requirement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>If interested, they'll accept and suggest time slots</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>You pick a slot and start your collaboration!</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Saved Requirements Modal */}
      {showSavedRequirementsModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSavedRequirementsModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-[#1B1B1B]">Load From Saved Requirements</h2>
              </div>
              <button
                onClick={() => setShowSavedRequirementsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Body - Scrollable List */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {savedRequirementsList.length > 0 ? (
                <div className="space-y-4">
                  {savedRequirementsList.map((req) => (
                    <div
                      key={req.id}
                      className="border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:bg-purple-50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-[#1B1B1B]">{req.title}</h4>
                            {req.isDraft && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                Draft
                              </span>
                            )}
                            {req.hasAttachments && (
                              <Paperclip className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{req.problemDescription}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span className="font-semibold">{req.companyName}</span>
                            <span>•</span>
                            <span>{req.createdAt}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                              {req.timeCommitment === 'one-time' ? 'One-time' : req.timeCommitment === 'short-term' ? 'Short-term' : 'Ongoing'}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                              {req.offerType === 'paid' ? '💰 Paid' : req.offerType === 'equity' ? '📈 Equity' : req.offerType === 'hybrid' ? '🤝 Hybrid' : '🌐 Networking'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => loadRequirement(req)}
                            className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold whitespace-nowrap"
                          >
                            Load This
                          </button>
                          <button
                            onClick={() => deleteRequirement(req.id)}
                            className="px-4 py-2.5 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-semibold"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No saved requirements yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
