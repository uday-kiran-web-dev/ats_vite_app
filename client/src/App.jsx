import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";

import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import RecruiterJobs from "./pages/RecruiterJobs";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import Candidates from "./pages/Candidates";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Routes>
      {/* {Public routes} */}
      <Route path="/" element={<Jobs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* {Candidate routes} */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Candidate"]}>
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute allowedRoles={["Candidate"]}>
            <Applications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["Candidate"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* {Recruiter routes} */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute allowedRoles={["Recruiter"]}>
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/jobs"
        element={
          <ProtectedRoute allowedRoles={["Recruiter"]}>
            <RecruiterJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/applications"
        element={
          <ProtectedRoute allowedRoles={["Recruiter"]}>
            <Applications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/candidates"
        element={
          <ProtectedRoute allowedRoles={["Recruiter", "Admin"]}>
            <Candidates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Recruiter"]}>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* {Admin routes} */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Applications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
