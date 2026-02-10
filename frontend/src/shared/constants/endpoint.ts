import envConfig from "@/config";

export const SHARED_ENDPOINTS = {
  // AUTH_REFRESH: "/auth/refresh", // ✅ Dùng trong http và auth service
  AUTH: {
    // ✅ Dùng trong http và auth service
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    GOOGLE_LOGIN: `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/google?prompt=select_account`,
    FACEBOOK_LOGIN: `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/facebook`,
  },
} as const;
