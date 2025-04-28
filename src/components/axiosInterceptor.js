// // src/axiosInstance.js
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://easytym-backend.onrender.com",
//   withCredentials: true,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem("access_token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

// src/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://easytym-backend.onrender.com",
  withCredentials: true, // Keep it true if you want cookies when available
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    let token = sessionStorage?.getItem("access_token");

    if (!token) {
      // If no token in sessionStorage, try reading from URL
      const urlParams = new URLSearchParams(window.location.search);
      token = urlParams.get("token");

      if (token) {
        sessionStorage.setItem("access_token", token); // Save it for future use
      }
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      // Optionally: log or handle if no token
      console.warn("No access token found for this request.");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
