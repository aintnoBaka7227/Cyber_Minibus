import api from "./axios";

/**
 * Auth API Service
 * Handles authentication related API calls
 */

export const authApi = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} userData.role - User role (optional, defaults to "client")
   * @returns {Promise} Response with user data and token
   */
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - Email address
   * @param {string} credentials.password - Password
   * @returns {Promise} Response with user data and token
   */
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  /**
   * Get current authenticated user
   * @returns {Promise} Response with current user data
   */
  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * Logout current user
   * @returns {Promise} Response with logout message
   */
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};
