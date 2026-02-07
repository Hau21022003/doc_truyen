import { User } from "@/features/users/types";
import http from "@/lib/http";

export const authService = {
  login: (data: any) => http.post("/auth/login", data),
  register: (data: any) => http.post("/auth/register", data),
  profile: () => http.get<User>("/auth/profile"),
  logout: () => http.get("/auth/logout"),
};
