export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const IMAGE_FORMAT_LABELS = ["PNG", "JPG", "WEBP"];
export const ALLOWED_IMAGE_TYPES_STRING = ALLOWED_IMAGE_TYPES.join(",");
export const MAX_AVATAR_SIZE_MB = 5;

export const MAX_SIZE_MB = {
  DOCUMENT: 20,
};

export const ALLOWED_EXCEL_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];
export const EXCEL_FORMAT_LABELS = ["XLSX", "XLS"];
export const ALLOWED_EXCEL_TYPES_STRING = ALLOWED_EXCEL_TYPES.join(",");
export const MAX_EXCEL_SIZE_MB = 20;
