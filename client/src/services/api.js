import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Important for cookies
});

// Request interceptor to add access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Or from memory if passed via closure/context.
    // Ideally we inject store or use a callback, but for simplicity we often allow localStorage fallback for access token or manage it via headers manually in components.
    // Use a simple custom header injection if managed outside.
    // For this setup, let's assume we store the short-lived access token in localStorage for simplicity in this demo, or we can use a variable.
    // To keep it clean, AuthContext will set the default header on api instance when token changes.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const { data } = await api.post("/auth/refresh");

        // Update default header for future requests
        api.defaults.headers.common["Authorization"] =
          `Bearer ${data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        // If using localStorage, update it (though memory is preferred)
        localStorage.setItem("accessToken", data.accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, user needs to login
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
