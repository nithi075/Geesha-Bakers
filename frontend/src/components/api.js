import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://geesha-bakers.onrender.com/api",
  timeout: 100000, // 100 seconds
  // ❌ DO NOT set Content-Type here
});

export default API;
