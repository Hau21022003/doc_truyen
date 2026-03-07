import http from "@/lib/http";
import { UploadResult } from "../types/media.types";

export const mediaService = {
  async upload(file: File): Promise<UploadResult> {
    const tempId = crypto.randomUUID();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tempId", tempId);

    const response = await http.post<{ url: string }>(
      "/media/upload-draft",
      formData,
    );

    return {
      url: response.payload.url,
      tempId,
    };
  },
};

export default mediaService;
