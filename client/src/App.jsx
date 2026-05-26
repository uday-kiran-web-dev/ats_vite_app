import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";

import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";

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

      {/* {Recruiter routes} */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute allowedRoles={["Recruiter"]}>
            <RecruiterDashboard />
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
    </Routes>
  );
}

export default App;
