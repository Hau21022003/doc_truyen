/**
 * Các utility functions làm việc với chuỗi
 */

/**
 * Chuyển đổi chuỗi thành slug (URL-friendly)
 */
export const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Loại bỏ ký tự đặc biệt
    .replace(/[\s_-]+/g, '-') // Thay thế khoảng trắng và dấu gạch dưới bằng dấu gạch nối
    .replace(/^-+|-+$/g, ''); // Loại bỏ dấu gạch nối ở đầu và cuối
};

/**
 * Viết hoa chữ cái đầu
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Loại bỏ dấu tiếng Việt
 */
export const removeVietnameseAccents = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

/**
 * Kiểm tra chuỗi rỗng hoặc chỉ chứa whitespace
 */
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Kiểm tra chuỗi không rỗng và có chứa ký tự khác whitespace
 */
export const isNotEmpty = (str: string | null | undefined): boolean => {
  return !isEmpty(str);
};
