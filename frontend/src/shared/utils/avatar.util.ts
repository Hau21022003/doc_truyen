export const generateAvatarUrl = (
  seed?: string,
  avatarUrl?: string,
): string => {
  // Nếu đã có URL avatar, trả về
  if (avatarUrl) {
    return avatarUrl;
  }

  // Xử lý trường hợp avatar null, tạo avatar từ ID hoặc tên
  const identifier = seed || "user";

  // Số lượng avatar mặc định có sẵn (từ 1 đến 10)
  const avatarCount = 10;

  // Tạo một số deterministic dựa trên ID để chọn avatar nhất quán
  const getAvatarIndex = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return (Math.abs(hash) % avatarCount) + 1; // 1 đến 10
  };

  // Lấy index từ ID
  const avatarIndex = getAvatarIndex(identifier);

  // Trả về đường dẫn đến avatar tương ứng
  return `/avatars/avatar-${avatarIndex}.jpg`;
};
