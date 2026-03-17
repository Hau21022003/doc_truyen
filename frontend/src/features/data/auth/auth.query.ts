import { useQuery } from "@tanstack/react-query";
import { authService } from "./auth.service";

export const AUTH_QUERY_KEYS = {
  profile: ["auth", "profile"],
};

export const useProfileQuery = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: authService.profile,
    retry: false,
  });
};
