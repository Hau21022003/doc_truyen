import http from "@/lib/http";
import { UpdateProfileInput } from "../schemas/update-profile.schema";

export const userService = {
  updateProfile: async (data: UpdateProfileInput, avatarFile?: File) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    return http.patch(`/users/profile`, formData);
  },
};
