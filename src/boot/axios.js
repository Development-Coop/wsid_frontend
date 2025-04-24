import { boot } from "quasar/wrappers";
import axios from "axios";

let isRefreshing = false; // Flag to prevent multiple token refresh requests
let refreshSubscribers = []; // Queue to store pending requests during token refresh

// Function to subscribe to the refreshed token
function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

// Notify all subscribers when the token is refreshed
function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// Create a custom axios instance
const api = axios.create({
  baseURL: "https://wsid-service.netlify.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default boot(({ app, router }) => {
  // Request Interceptor: Add Authorization Header
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Handle Errors
  api.interceptors.response.use(
    (response) => response, // Return the response if successful
    async (error) => {
      const originalRequest = error.config;

      // If 401 Unauthorized, attempt to refresh the token
      if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite retries

        // If a refresh token request is already in progress, queue the requests
        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest)); // Retry the original request with the new token
            });
          });
        }

        isRefreshing = true; // Set the flag to true
        try {
          // Attempt to refresh the token
          const refreshToken = localStorage.getItem("refresh-token");
          const response = await axios.post("https://wsid-service.netlify.app/api/auth/refresh-token", {
            refreshToken,
          });

          const { accessToken } = response.data;

          // Store new tokens
          localStorage.setItem("access-token", accessToken);

          // Notify all subscribers with the new token
          onRefreshed(accessToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Handle refresh token failure
          if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
            localStorage.clear();
            const isMobile = window.innerWidth <= 768;
            const redirectTo = router.currentRoute.value.fullPath;
            if (isMobile) {
              router.push({ name: "login", query: { expired: "true", redirectTo } }); // Redirect to mobile login route
            } else {
              router.push({ name: "web-login", query: { expired: "true", redirectTo } }); // Redirect to desktop login route
            }
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false; // Reset the flag
        }
      }

      return Promise.reject(error); // Reject other errors
    }
  );

  // Make the axios instance available globally
  app.config.globalProperties.$axios = axios; // Generic axios
  app.config.globalProperties.$api = api; // Custom API instance
});

export { api };