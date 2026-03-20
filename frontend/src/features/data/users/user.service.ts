import http from "@/lib/http";
import { PaginationResponse } from "@/shared/types";
import { QueryUsersInput, UpdateProfileInput } from "./update-profile.schema";
import { User } from "./user.types";

export const userService = {
  findAll: (params?: QueryUsersInput) =>
    http.get<PaginationResponse<User>>("/users", { params }),

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

  remove: (id: string) => http.delete<User>(`/users/${id}`),

  removeMany: (ids: string[]) =>
    http.delete(`/users/bulk`, {
      params: { ids },
    }),
};
