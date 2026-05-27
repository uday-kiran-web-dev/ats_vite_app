import { useState, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";

import { AuthContext } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Candidate",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const { data } = await API.post("/auth/register", formData);

      localStorage.setItem("userInfo", JSON.stringify(data));

      setUser(data);

      // Redirect by role
      if (data.role === "Admin") {
        navigate("/admin");
      } else if (data.role === "Recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        />

        <input type="hidden" name="role" value="Candidate" />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Register"}
        </button>

        <p className="mt-4 text-center">
          Already have an account?
          <Link to="/login" className="text-blue-600 ml-1">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
