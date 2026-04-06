import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationsProvider } from "@/context/NotificationsContext";
import FaceAttendancePage from "@/pages/FaceAttendancePage";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import HomePage from "@/pages/HomePage";
import AdminPanelPage from "@/pages/AdminPanelPage";
import HRPanelPage from "@/pages/HRPanelPage";
import EmployeePanelPage from "@/pages/EmployeePanelPage";
import EmployeeJobsPage from "@/pages/EmployeeJobsPage";
import PricingPage from "@/pages/PricingPage";
import HiringPlanningPage from "@/pages/HiringPlanningPage";
import RecruitmentPage from "@/pages/RecruitmentPage";
import OnboardingPage from "@/pages/OnboardingPage";
import EmployeesPage from "@/pages/EmployeesPage";
import AttendancePage from "@/pages/AttendancePage";
import PayrollPage from "@/pages/PayrollPage";
import PerformancePage from "@/pages/PerformancePage";
import TrainingPage from "@/pages/TrainingPage";
import EngagementPage from "@/pages/EngagementPage";
import CompliancePage from "@/pages/CompliancePage";
import DocumentsPage from "@/pages/DocumentsPage";
import ITAccessPage from "@/pages/ITAccessPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ExitManagementPage from "@/pages/ExitManagementPage";
import CulturePage from "@/pages/CulturePage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import AIChatPage from "@/pages/AIChatPage";
import AIATSPage from "@/pages/AIATSPage";
import AIInsightsPage from "@/pages/AIInsightsPage";
import ResumeATS from "./pages/ai/ResumeATS";
import CandidateRanking from "./pages/ai/CandidateRanking";
import JDGenerator from "./pages/ai/JDGenerator";
import InterviewScheduling from "./pages/ai/InterviewScheduling";
import Onboarding from "./pages/ai/Onboarding";
import OCRVerification from "./pages/ai/OCRVerification";
import LeavePrediction from "./pages/ai/LeavePrediction";
import SalaryCalculator from "./pages/ai/SalaryCalculator";
import SupportChatbot from "./pages/ai/SupportChatbot";
import MentalHealth from "./pages/ai/MentalHealth";
import Attrition from "./pages/ai/Attrition";
import SkillGap from "./pages/ai/SkillGap";
import Compliance from "./pages/ai/Compliance";
import ExitInterview from "./pages/ai/ExitInterview";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import NotificationsPage from "@/pages/NotificationsPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import OAuthSuccess from "@/pages/OAuthSuccess";
import { getDefaultRoute } from "@/lib/auth";

const queryClient = new QueryClient();

const HomeRedirect = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "employee";
  return <Navigate to={token ? getDefaultRoute(role as any) : "/login"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationsProvider>
        <Toaster />
        <Sonner />

      <BrowserRouter future={{ v7_startTransition: true }}>
        {/* 🔥 GLOBAL RESPONSIVE WRAPPER */}

          {/* 🔥 CENTER CONTAINER */}

            <Routes>

              {/* Default redirect */}
              <Route path="/" element={<HomePage />} />
              <Route path="/app" element={<HomeRedirect />} />
              <Route path="/pricing" element={<PricingPage />} />

              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/oauth-success" element={<OAuthSuccess />} />

              {/* Protected Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminPanelPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hr"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "hr"]}>
                      <HRPanelPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employee"
                  element={
                    <ProtectedRoute allowedRoles={["employee"]}>
                      <EmployeePanelPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/hiring" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><HiringPlanningPage /></ProtectedRoute>} />
                <Route path="/recruitment" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><RecruitmentPage /></ProtectedRoute>} />
                <Route path="/onboarding" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><OnboardingPage /></ProtectedRoute>} />
                <Route path="/employees" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><EmployeesPage /></ProtectedRoute>} />
                <Route path="/attendance" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><AttendancePage /></ProtectedRoute>} />
                <Route path="/payroll" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><PayrollPage /></ProtectedRoute>} />
                <Route path="/performance" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><PerformancePage /></ProtectedRoute>} />
                <Route path="/training" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><TrainingPage /></ProtectedRoute>} />
                <Route path="/engagement" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><EngagementPage /></ProtectedRoute>} />
                <Route path="/compliance" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><CompliancePage /></ProtectedRoute>} />
                <Route path="/documents" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><DocumentsPage /></ProtectedRoute>} />
                <Route path="/it-access" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><ITAccessPage /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><AnalyticsPage /></ProtectedRoute>} />
                <Route path="/exit" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><ExitManagementPage /></ProtectedRoute>} />
                <Route path="/culture" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><CulturePage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/jobs-browser" element={<ProtectedRoute allowedRoles={["employee"]}><EmployeeJobsPage /></ProtectedRoute>} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/ai-chat" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><AIChatPage /></ProtectedRoute>} />
                <Route path="/ai/ats" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><AIATSPage /></ProtectedRoute>} />
                <Route path="/ai/insights" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><AIInsightsPage /></ProtectedRoute>} />
                {/* The existing AI Interview route is updated to use InterviewScheduling */}
                <Route path="/ai/interview" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><InterviewScheduling /></ProtectedRoute>} />
                <Route path="/ai/resume-ats" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><ResumeATS /></ProtectedRoute>} />
                <Route path="/ai/candidate-ranking" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><CandidateRanking /></ProtectedRoute>} />
                <Route path="/ai/jd-generator" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><JDGenerator /></ProtectedRoute>} />
                <Route path="/ai/onboarding" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><Onboarding /></ProtectedRoute>} />
                <Route path="/ai/ocr" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><OCRVerification /></ProtectedRoute>} />
                <Route path="/ai/leave" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><LeavePrediction /></ProtectedRoute>} />
                <Route path="/ai/salary" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><SalaryCalculator /></ProtectedRoute>} />
                <Route path="/ai/support" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><SupportChatbot /></ProtectedRoute>} />
                <Route path="/ai/mental-health" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><MentalHealth /></ProtectedRoute>} />
                <Route path="/ai/attrition" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><Attrition /></ProtectedRoute>} />
                <Route path="/ai/skill-gap" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><SkillGap /></ProtectedRoute>} />
                <Route path="/ai/compliance" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><Compliance /></ProtectedRoute>} />
                <Route path="/ai/exit" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><ExitInterview /></ProtectedRoute>} />
                <Route path="/face-attendance" element={<ProtectedRoute allowedRoles={["admin", "hr"]}><FaceAttendancePage /></ProtectedRoute>} />
              </Route>

              <Route path="*" element={<NotFound />} />

            </Routes>

        </BrowserRouter>

      </NotificationsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
