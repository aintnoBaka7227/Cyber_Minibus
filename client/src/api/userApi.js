import api from "./axios";

/**
 * User API Service
 * Handles user related API calls
 */

export const userApi = {
  /**
   * Get user bookings
   * @param {string} userId - User ID
   * @returns {Promise} Response with user's bookings
   */
  getUserBookings: async (userId) => {
    const response = await api.get(`/user/bookings/${userId}`);
    return { ...response.data, httpStatus: response.status };
  },

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise} Response with user profile
   */
  getUserProfile: async (userId) => {
    const response = await api.get(`/user/profile/${userId}`);
    return { ...response.data, httpStatus: response.status };
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.firstName - First name
   * @param {string} profileData.lastName - Last name
   * @param {string} profileData.phone - Phone number
   * @param {string} profileData.address - Address
   * @param {string} profileData.email - Email
   * @returns {Promise} Response with updated user profile
   */
  updateUserProfile: async (userId, profileData) => {
    const response = await api.post(`/user/update-profile/${userId}`, profileData);
    return { ...response.data, httpStatus: response.status };
  },
};
