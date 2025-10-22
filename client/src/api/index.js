/**
 * API Service Index
 * Centralized export for all API services
 */

export { authApi } from "./authApi";
export { destinationApi } from "./destinationApi";
export { bookingApi } from "./bookingApi";
export { userApi } from "./userApi";
export { adminApi } from "./adminApi";

// Also export the axios instance for direct use if needed
export { default as api } from "./axios";
