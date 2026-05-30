import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";

import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import UserLogs from "./pages/UserLogs";
import ProtectedRoute from "./utils/ProtectedRoute";
import RecruiterJobs from "./pages/RecruiterJobs";
import Applications from "./pages/Applications";
import ApplicationDetails from "./pages/ApplicationDetails";
import CandidateDetails from "./pages/CandidateDetails";
import AddCandidate from "./pages/AddCandidate";
import Profile from "./pages/Profile";
import Candidates from "./pages/Candidates";
import Analytics from "./pages/Analytics";
import JobDetails from "./pages/JobDetails";
import AddUser from "./pages/AddUser";

function App() {
  const location = useLocation();
  const hideLayout = [
    "/dashboard",
    "/applications",
    "/profile",
    "/recruiter",
    "/admin",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {!hideLayout && <Header />}

      <main className="flex-1">
        <Routes>
          {/* {Public routes} */}
          <Route path="/" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
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
            path="/applications/:id"
            element={
              <ProtectedRoute allowedRoles={["Candidate"]}>
                <ApplicationDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                allowedRoles={["Candidate", "Recruiter", "Admin"]}
              >
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
            path="/recruiter/applications/:id"
            element={
              <ProtectedRoute allowedRoles={["Recruiter"]}>
                <ApplicationDetails />
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
            path="/recruiter/candidates/add"
            element={
              <ProtectedRoute allowedRoles={["Recruiter", "Admin"]}>
                <AddCandidate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/candidates/:id"
            element={
              <ProtectedRoute allowedRoles={["Recruiter", "Admin"]}>
                <CandidateDetails />
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
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/add"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AddUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/user-logs"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <UserLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <UserDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <RecruiterJobs />
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
          <Route
            path="/admin/applications/:id"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <ApplicationDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
