import api from "./axios";

/**
 * Trip Instance API Service
 * Read-only preview of trip instances and occupied seats
 */

export const tripApi = {
  /**
   * Get a preview for a trip instance by template/date/time
   * Does not create an instance; returns { exists, tripInstanceId, bookedSeats, seatLayout }
   */
  getInstanceByParams: async ({ templateId, date, time }) => {
    const response = await api.get("/trip/instance", {
      params: { templateId, date, time },
    });
    return { ...response.data, httpStatus: response.status };
  },
};
