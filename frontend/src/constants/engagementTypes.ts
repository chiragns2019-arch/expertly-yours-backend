// Shared engagement types used across the platform
// Update this file when adding new engagement types in onboarding or member screens

// Filter options for discovery page (simplified)
export const ENGAGEMENT_TYPES = [
  'all',
  'paid',
  'advisory',
  'equity',
  'pro bono'
] as const;

export type EngagementType = typeof ENGAGEMENT_TYPES[number];

// Full engagement options for profile setup (detailed)
export const FULL_ENGAGEMENT_TYPES = [
  'Paid consulting',
  'Advisory',
  'Fractional leadership',
  'Full-time employment',
  'Part-time employment',
  'Equity / Co-founder',
  'Retainer',
  'Pro bono',
  'Networking only',
] as const;

export type FullEngagementType = typeof FULL_ENGAGEMENT_TYPES[number];