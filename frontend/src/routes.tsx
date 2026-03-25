import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { LandingPage } from './components/LandingPage';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { Dashboard } from './components/DashboardNew';
import { ProfileSetup } from './components/ProfileSetup';
import { ExpertDiscovery } from './components/ExpertDiscovery';
import { ProfileView } from './components/ProfileView';
import { RequirementSubmission } from './components/RequirementSubmission';
import { RequirementsInbox } from './components/RequirementsInbox';
import { RequirementDetails } from './components/RequirementDetails';
import { BookmarkedExperts } from './components/BookmarkedExperts';
import { NotificationCenter } from './components/NotificationCenter';
import { RequirementSent } from './components/RequirementSent';
import { SlotBooking } from './components/SlotBooking';
import { BookingConfirmed } from './components/BookingConfirmed';
import { SuggestSlots } from './components/SuggestSlots';
import { SlotsSent } from './components/SlotsSent';
import { AccountSettings } from './components/AccountSettings';
import { Messages } from './components/Messages';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminExpertReview } from './components/AdminExpertReview';
import { AdminExpertDetail } from './components/AdminExpertDetail';
import { AdminRegistrationsList } from './components/AdminRegistrationsList';
import { AdminExpertsList } from './components/AdminExpertsList';
import { AdminRequirementsList } from './components/AdminRequirementsList';
import { AdminRequirementDetail } from './components/AdminRequirementDetail';
import { ProfileSubmitted } from './components/ProfileSubmitted';
import { ExpertRedirect } from './components/ExpertRedirect';
import { AIMatches } from './components/AIMatches';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SingleExpertRequirement } from './components/SingleExpertRequirement';
import { ActiveEngagements } from './components/ActiveEngagements';
import { EngagementDetail } from './components/EngagementDetail';
import { EditRequirement } from './components/EditRequirement';
import { DirectBooking } from './components/DirectBooking';
import { RequirementsBoard } from './components/RequirementsBoard';
import { AdminLogin } from './components/AdminLogin';
import { AuthSuccess } from './components/AuthSuccess';
import { ScheduleMeeting } from './components/ScheduleMeeting';
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userStr = localStorage.getItem('expertly_yours_user');
  const user = userStr ? JSON.parse(userStr) : null;
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userStr = localStorage.getItem('expertly_yours_user');
  const user = userStr ? JSON.parse(userStr) : null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/expert-signup",
    Component: ProfileSetup,
  },
  {
    path: "/expert-benefits",
    Component: LandingPage, // Placeholder - can be a dedicated page later
  },
  {
    path: "/expert-requirements",
    Component: LandingPage, // Placeholder - can be a dedicated page later
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/profile/setup",
    Component: ProfileSetup,
  },
  {
    path: "/profile-submitted",
    Component: ProfileSubmitted,
  },
  {
    path: "/discover",
    Component: ExpertDiscovery,
  },
  {
    path: "/profile/:id",
    Component: ProfileView,
  },
  {
    path: "/expert/:id",
    Component: ExpertRedirect,
  },
  {
    path: "/requirement/:userId",
    Component: RequirementSubmission,
  },
  {
    path: "/requirement/new",
    Component: RequirementSubmission, // New requirement without pre-selected experts
  },
  {
    path: "/requirement/bulk",
    Component: RequirementSubmission, // Bulk send to multiple experts
  },
  {
    path: "/requirements",
    Component: RequirementsInbox,
  },
  {
    path: "/requirements/:id",
    Component: RequirementDetails,
  },
  {
    path: "/bookmarks",
    Component: BookmarkedExperts,
  },
  {
    path: "/notifications",
    Component: NotificationCenter,
  },
  {
    path: "/requirement-sent",
    Component: RequirementSent,
  },
  {
    path: "/requirement/:id/view",
    Component: RequirementSent, // Can be a detailed view component later
  },
  {
    path: "/requirement/:id/edit",
    Component: EditRequirement, // Edit existing requirement with pre-filled form
  },
  {
    path: "/requirement/:id/reuse",
    Component: RequirementSubmission, // Reuse the same form but pre-filled
  },
  {
    path: "/requirement/:id/ai-matches",
    Component: AIMatches,
  },
  {
    path: "/book-slot/:expertId/:requirementId",
    Component: SlotBooking,
  },
  {
    path: "/booking-confirmed",
    Component: BookingConfirmed,
  },
  {
    path: "/booking/:expertId",
    Component: DirectBooking,
  },
  {
    path: "/suggest-slots/:requirementId",
    Component: SuggestSlots,
  },
  {
    path: "/slots-sent",
    Component: SlotsSent,
  },
  {
    path: "/account-settings",
    Component: AccountSettings,
  },
  {
    path: "/messages",
    Component: Messages,
  },
  {
    path: "/messages/:conversationId",
    Component: Messages,
  },
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    element: <AdminRoute><AdminDashboard /></AdminRoute>,
  },
  {
    path: "/admin/experts",
    element: <AdminRoute><AdminExpertReview /></AdminRoute>,
  },
  {
    path: "/admin/experts/:id",
    Component: AdminExpertDetail,
  },
  {
    path: "/admin/registrations",
    Component: AdminRegistrationsList,
  },
  {
    path: "/admin/experts-list",
    Component: AdminExpertsList,
  },
  {
    path: "/admin/requirements-list",
    Component: AdminRequirementsList,
  },
  {
    path: "/admin/requirements/:id",
    Component: AdminRequirementDetail,
  },
  {
    path: "/expert-redirect",
    Component: ExpertRedirect,
  },
  {
    path: "/requirement/send/:expertId",
    Component: SingleExpertRequirement,
  },
  {
    path: "/active-engagements",
    Component: ActiveEngagements,
  },
  {
    path: "/engagements/:engagementId",
    Component: EngagementDetail,
  },
  {
    path: "/requirements-board",
    Component: RequirementsBoard,
  },
  {
    path: "/auth-success",
    Component: AuthSuccess,
  },
  {
    path: "/schedule-meeting/:requirementId",
    Component: ScheduleMeeting,
  },
  {
    path: "*",
    Component: ErrorBoundary,
  },
]);