import api from "./axios";

/**
 * Admin API Service
 * Handles admin related API calls (requires admin role)
 */

export const adminApi = {
  /**
   * Get dashboard statistics (Admin only)
   * @returns {Promise} Response with dashboard statistics
   */
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard-stats");
    return { ...response.data, httpStatus: response.status };
  },

  /**
   * Get all users (Admin only)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.search - Search term for username, email, firstName, lastName
   * @param {string} params.role - Filter by role ("client" or "admin")
   * @returns {Promise} Response with paginated users list
   */
  getAllUsers: async (params = {}) => {
    const response = await api.get("/admin/all-users", { params });
    return { ...response.data, httpStatus: response.status };
  },

  /**
   * Get revenue data (Admin only)
   * @param {Object} params - Query parameters
   * @param {string} params.from - Start date (ISO format)
   * @param {string} params.to - End date (ISO format)
   * @param {string} params.groupBy - Group by period ("day", "week", "month", "year")
   * @returns {Promise} Response with revenue data
   */
  getRevenue: async (params = {}) => {
    const response = await api.get("/admin/get-revenue", { params });
    return { ...response.data, httpStatus: response.status };
  },
};
