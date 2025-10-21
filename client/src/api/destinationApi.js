import api from "./axios";

/**
 * Destination API Service
 * Handles destination/trip related API calls
 */

export const destinationApi = {
  /**
   * Get all destinations
   * @returns {Promise} Response with list of destinations
   */
  getAllDestinations: async () => {
    const response = await api.get("/destination/all-destinations");
    return response.data;
  },

  /**
   * Get destination details by ID
   * @param {string} destinationId - Destination ID
   * @returns {Promise} Response with destination details
   */
  getDestinationDetails: async (destinationId) => {
    const response = await api.get(`/destination/get-destination-details/${destinationId}`);
    return response.data;
  },

  /**
   * Add a new destination (Admin only)
   * @param {Object} destinationData - Destination data
   * @param {string} destinationData.name - Destination name
   * @param {string} destinationData.teaser - Short description
   * @param {string} destinationData.description - Full description
   * @param {number} destinationData.rating - Rating (0-5)
   * @param {string} destinationData.mainphoto - Main photo URL
   * @param {Array} destinationData.tripTemplates - Trip templates array
   * @returns {Promise} Response with created destination
   */
  addDestination: async (destinationData) => {
    const response = await api.post("/destination/add-destination", destinationData);
    return response.data;
  },
};
