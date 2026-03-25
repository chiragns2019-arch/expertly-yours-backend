import { useState } from 'react';
import { CheckCircle, Zap, Lock, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: "Discover experts with proven track records",
    description: "Browse verified experts filtered by expertise area, years of experience, and scale indicators (high revenue, significant users, exits/IPOs, Series B+ funding). See exactly who they've worked with and what they've accomplished—not just generic bios.",
    content: (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 backdrop-blur">
        <p className="text-sm font-medium text-[#d4ff00] mb-4">What you'll see on every profile:</p>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#d4ff00] flex-shrink-0 mt-0.5" />
            <span><strong className="text-white">Total years in their area of expertise</strong> (not just career length)</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#d4ff00] flex-shrink-0 mt-0.5" />
            <span><strong className="text-white">Current and past engagements</strong> with company names and roles</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#d4ff00] flex-shrink-0 mt-0.5" />
            <span><strong className="text-white">Scale indicators</strong> showing the magnitude of their experience</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#d4ff00] flex-shrink-0 mt-0.5" />
            <span><strong className="text-white">Usefulness scores</strong> from previous engagements</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#d4ff00] flex-shrink-0 mt-0.5" />
            <span><strong className="text-white">Engagement preferences</strong> (advisory, consulting, equity, retainer)</span>
          </li>
        </ul>
      </div>
    )
  },
  {
    number: 2,
    title: "Bookmark and shortlist",
    description: "Found multiple experts who could help? Bookmark them all. Your bookmarks are private, persistent across sessions, and create a personal shortlist you can reference anytime. Think of it as your own curated network of world-class specialists.",
    content: (
      <div className="flex gap-4">
        <div className="flex-1 bg-gray-800/50 border border-[#d4ff00]/30 rounded-xl p-6 backdrop-blur">
          <Zap className="w-10 h-10 text-[#d4ff00] mb-3" />
          <p className="font-semibold text-white mb-2 text-lg">Instant access</p>
          <p className="text-sm text-gray-400">Your bookmarks are always available in your dashboard</p>
        </div>
        <div className="flex-1 bg-gray-800/50 border border-[#d4ff00]/30 rounded-xl p-6 backdrop-blur">
          <Lock className="w-10 h-10 text-[#d4ff00] mb-3" />
          <p className="font-semibold text-white mb-2 text-lg">Private</p>
          <p className="text-sm text-gray-400">Experts don't see who bookmarked them</p>
        </div>
      </div>
    )
  },
  {
    number: 3,
    title: "Share your requirement—with one or 100 experts at once",
    description: "Here's where we're different: instead of sending individual cold emails or DMs, you write your requirement once and share it with as many experts as you want. Bulk-select from your bookmarks and send to everyone simultaneously.",
    content: (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 backdrop-blur">
        <p className="text-sm font-medium text-[#d4ff00] mb-4">Your requirement should include:</p>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-3">
            <span className="text-[#d4ff00] font-bold text-lg">•</span>
            <span>Your problem statement or challenge</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#d4ff00] font-bold text-lg">•</span>
            <span>Your company/project stage and context</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#d4ff00] font-bold text-lg">•</span>
            <span>Time commitment you're looking for</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#d4ff00] font-bold text-lg">•</span>
            <span>What you're offering (consulting fee, equity, advisory shares, etc.)</span>
          </li>
        </ul>
      </div>
    )
  },
  {
    number: 4,
    title: "Experts respond if they see a good fit",
    description: "This is requirement-first engagement. Experts review your needs and respond only if they believe they can help. You won't get 100 responses—you'll get responses from those who genuinely see alignment. Quality over quantity.",
    content: (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-green-600/40 rounded-xl p-6 backdrop-blur">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <p className="font-semibold text-white text-lg">What happens next</p>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Experts who respond will either accept your requirement, suggest modifications, or offer alternative engagement structures. All communication happens outside the platform (email, video call, etc.).
          </p>
        </div>
        <div className="bg-gray-800/50 border border-green-600/40 rounded-xl p-6 backdrop-blur">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-6 h-6 text-green-400" />
            <p className="font-semibold text-white text-lg">Response time</p>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Most experts respond within 48 hours. If they're interested, you'll hear from them quickly. No response? They likely don't see a fit—move on to others on your shortlist.
          </p>
        </div>
      </div>
    )
  }
];

export function HowItWorksSlider() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  const step = steps[currentStep];

  return (
    <div className="relative">
      {/* Main Content */}
      <div className="min-h-[400px]">
        <div className="flex gap-8 items-start">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-[#d4ff00] rounded-full flex items-center justify-center shadow-lg shadow-[#d4ff00]/20">
              <span className="text-3xl font-bold text-black">{step.number}</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-semibold mb-4 text-white">{step.title}</h3>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {step.description.includes('once') 
                ? step.description.split('once').map((part, i) => 
                    i === 0 ? <span key={i}>{part}</span> : <span key={i}><strong className="text-white">once</strong>{part}</span>
                  )
                : step.description
              }
            </p>
            {step.content}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevStep}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 w-12 h-12 bg-gray-900 border-2 border-[#d4ff00] rounded-full flex items-center justify-center text-[#d4ff00] hover:bg-[#d4ff00] hover:text-black transition-colors shadow-lg"
        aria-label="Previous step"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextStep}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 w-12 h-12 bg-gray-900 border-2 border-[#d4ff00] rounded-full flex items-center justify-center text-[#d4ff00] hover:bg-[#d4ff00] hover:text-black transition-colors shadow-lg"
        aria-label="Next step"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-3 mt-12">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => goToStep(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentStep
                ? 'bg-[#d4ff00] w-8 shadow-lg shadow-[#d4ff00]/30'
                : 'bg-gray-700 hover:bg-gray-600 w-3'
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}