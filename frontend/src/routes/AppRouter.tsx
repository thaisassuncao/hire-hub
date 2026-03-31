import { BrowserRouter, Route, Routes } from "react-router-dom";
import GuestRoute from "../components/common/GuestRoute";
import ProtectedRoute from "../components/common/ProtectedRoute";
import CreateJobPage from "../pages/CreateJobPage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import JobDetailPage from "../pages/JobDetailPage";
import JobsPage from "../pages/JobsPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs/new" element={<CreateJobPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
