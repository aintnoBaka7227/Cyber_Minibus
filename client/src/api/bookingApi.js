import api from "./axios";

/**
 * Booking API Service
 * Handles booking related API calls
 */

export const bookingApi = {
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @param {string} bookingData.tripInstanceID - Trip instance ID (Option 1)
   * @param {string} bookingData.templateId - Trip template ID (Option 2)
   * @param {string} bookingData.date - Date in YYYY-MM-DD format (Option 2)
   * @param {string} bookingData.time - Time in HH:MM format (Option 2)
   * @param {Array<string>} bookingData.seats - Array of seat IDs (e.g., ["A1", "A2"])
   * @returns {Promise} Response with created booking
   * 
   * Note: Provide either tripInstanceID OR (templateId + date + time)
   */
  createBooking: async (bookingData) => {
    const response = await api.post("/booking/create-booking", bookingData);
    return { ...response.data, httpStatus: response.status };
  },

  /**
   * Get all bookings (Admin only)
   * @returns {Promise} Response with list of all bookings
   */
  getAllBookings: async () => {
    const response = await api.get("/booking/all-bookings");
    return { ...response.data, httpStatus: response.status };
  },

  /**
   * Update booking details
   * @param {string} bookingId - Booking ID
   * @param {Object} updateData - Update data
   * @param {string} updateData.status - Booking status ("paid", "cancelled", "pending")
   * @returns {Promise} Response with updated booking
   */
  updateBooking: async (bookingId, updateData) => {
    const response = await api.post(`/booking/update-booking/${bookingId}`, updateData);
    return { ...response.data, httpStatus: response.status };
  },

  /**
   * Cancel a booking
   * @param {string} bookingId - Booking ID
   * @returns {Promise} Response with cancelled booking
   */
  cancelBooking: async (bookingId) => {
    return bookingApi.updateBooking(bookingId, { status: "cancelled" });
  },
};
