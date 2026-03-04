import { useAuthStore } from "@/shared/stores";
import { useMemo } from "react";

export const useTimeZone = () => {
  const { user } = useAuthStore();

  return useMemo(() => {
    return (
      user?.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      "UTC"
    );
  }, [user?.timezone]);
};
