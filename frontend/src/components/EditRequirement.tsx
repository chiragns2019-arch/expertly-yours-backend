import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, Upload, X, Paperclip, Save, FileText, DollarSign, Clock, Building, Edit } from 'lucide-react';
import logo from 'figma:asset/a7938614fa0da6ff7c03770db78dd32b63a97b03.png';
import { PostLoginNav } from './PostLoginNav';

export function EditRequirement() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock data - in real app, would fetch based on ID
  const [requirement, setRequirement] = useState({
    title: 'Growth Strategy Consultation',
    problemDescription: 'Need help with B2B SaaS product go-to-market strategy for our new analytics platform. Looking for someone with experience in enterprise sales cycles and product-led growth.',
    timeCommitment: 'short-term',
    offerType: 'paid',
    offerDetails: '$150/hour for 3 month engagement',
    companyName: 'TechCorp Analytics',
    companyStage: 'seed',
    additionalContext: 'We have a deck ready and some early traction with pilot customers.',
  });

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Requirement updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-20">
      {/* Top Navigation */}
      <PostLoginNav />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-16">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1B1B1B] transition-colors mb-8 group font-medium"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-300 rounded-full mb-6">
              <Edit className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-semibold text-sm">Edit Requirement</span>
            </div>

            <h1 className="text-5xl font-bold text-[#1B1B1B] mb-4">
              Update Your Requirement
            </h1>
            
            <p className="text-xl text-gray-700">
              Make changes to your requirement details below
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Save Message */}
        {saveMessage && (
          <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-6 mb-8">
            <p className="text-green-800 font-semibold text-center">{saveMessage}</p>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSave} className="bg-white border-2 border-gray-200 rounded-2xl p-8 space-y-12 shadow-sm">
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

          {/* Requirement Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-[rgb(37,95,186)] mb-3 uppercase tracking-wide">
              <FileText className="w-4 h-4 text-blue-600" />
              Requirement Title *
            </label>
            <input
              type="text"
              required
              value={requirement.title}
              onChange={(e) => setRequirement({ ...requirement, title: e.target.value })}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-[#1B1B1B] placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="e.g., Growth Strategy Consultation"
            />
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
              placeholder="Any other details that might help the expert understand your needs better..."
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-[rgb(37,95,186)] mb-3 uppercase tracking-wide">
              <Paperclip className="w-4 h-4 text-blue-600" />
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 transition-colors">
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-semibold">Upload files</span>
                  <span className="text-gray-600"> or drag and drop</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">PDF, DOC, PPT, or images up to 10MB each</p>
              </div>
            </div>

            {/* Attached Files List */}
            {attachedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-[#1B1B1B]">{file.name}</p>
                        <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-bold text-lg"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-3 px-8 py-4 bg-[#A8FF36] text-[#1B1B1B] rounded-xl hover:bg-[#98EF26] transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-3 border-[#1B1B1B] border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}