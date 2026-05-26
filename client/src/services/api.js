import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI || "http://localhost:5000/api",
});

//Add token automatically
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const storedUser = JSON.parse(userInfo);
    const token = storedUser.token || storedUser.toke;

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }

  return req;
});

export default API;
