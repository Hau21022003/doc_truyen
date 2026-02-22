export const toSlug = (str: string): string => {
  return str
    .normalize("NFD") // 1️⃣ tách dấu
    .replace(/[\u0300-\u036f]/g, "") // 2️⃣ xoá dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // 3️⃣ xoá ký tự đặc biệt
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
