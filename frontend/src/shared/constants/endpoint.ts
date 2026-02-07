export const SHARED_ENDPOINTS = {
  // AUTH_REFRESH: "/auth/refresh", // ✅ Dùng trong http và auth service
  AUTH: {
    // ✅ Dùng trong http và auth service
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
  },
} as const;
