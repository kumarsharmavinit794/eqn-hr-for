import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
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
import AIChatPage from "@/pages/AIChatPage";
import AIATSPage from "@/pages/AIATSPage";
import AIInsightsPage from "@/pages/AIInsightsPage";
import AIInterviewPage from "@/pages/AIInterviewPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/hiring" element={<HiringPlanningPage />} />
            <Route path="/recruitment" element={<RecruitmentPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/engagement" element={<EngagementPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/it-access" element={<ITAccessPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/exit" element={<ExitManagementPage />} />
            <Route path="/culture" element={<CulturePage />} />
            <Route path="/ai-chat" element={<AIChatPage />} />
            <Route path="/ai/ats" element={<AIATSPage />} />
            <Route path="/ai/insights" element={<AIInsightsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
