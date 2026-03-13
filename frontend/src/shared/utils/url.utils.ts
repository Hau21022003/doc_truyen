import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * Tạo query string mới bằng cách thêm hoặc cập nhật một tham số.
 * Giữ nguyên các query params hiện có.
 */
function createQueryString(
  searchParams: ReadonlyURLSearchParams,
  name: string,
  value: string,
) {
  const params = new URLSearchParams(searchParams.toString());
  params.set(name, value);
  return params.toString();
}

export const urlUtils = { createQueryString };
