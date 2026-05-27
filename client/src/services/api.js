import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI || "http://localhost:5000/api",
});

//Add token automatically
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const storedUser = JSON.parse(userInfo);
    const token = storedUser.token;

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }

  return req;
});

// Handle 401/403 errors
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear invalid token and logout
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default API;
