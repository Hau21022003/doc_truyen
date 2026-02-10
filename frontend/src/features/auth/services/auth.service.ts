import { User } from "@/features/users/types";
import http from "@/lib/http";
import { SHARED_ENDPOINTS } from "@/shared/constants";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";

export const authService = {
  login: (data: LoginInput) => http.post(SHARED_ENDPOINTS.AUTH.LOGIN, data),
  register: (data: RegisterInput) => {
    const body = {
      ...data,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    return http.post("/auth/register", body);
  },
  profile: () => http.get<User>("/auth/profile", { authRequired: false }),
  logout: () => http.get("/auth/logout", { authRequired: false }),
};
