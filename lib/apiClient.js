import axios from "axios";

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // sends cookies (refresh token)
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle expired access token
api.interceptors.response.use(
  (response) => 
    response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const res = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        // Update access token
        accessToken = res.data.accessToken;

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → force logout
        accessToken = null;
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
