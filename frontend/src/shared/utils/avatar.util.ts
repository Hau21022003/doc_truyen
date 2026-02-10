// src/shared/utils/avatar.util.ts
export const generateAvatarUrl = (
  userId?: string,
  name?: string,
  avatarUrl?: string,
): string => {
  // Nếu đã có URL avatar, trả về
  if (avatarUrl) {
    return avatarUrl;
  }

  // Xử lý trường hợp avatar null, tạo avatar từ ID hoặc tên
  const identifier = userId || name || "user";

  // Số lượng avatar mặc định có sẵn
  const avatarCount = 10;

  // Tạo một số determinstic dựa trên ID để chọn avatar nhất quán
  const getAvatarIndex = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return (Math.abs(hash) % avatarCount) + 1; // 1 đến 10
  };

  // Lấy index từ ID
  const avatarIndex = getAvatarIndex(identifier);

  // Tạo chuỗi có số 0 phía trước cho số < 10
  const paddedIndex = avatarIndex.toString().padStart(2, "0");

  // Trả về đường dẫn đến avatar tương ứng
  return `/avatars/avatar-${paddedIndex}.png`;
};
