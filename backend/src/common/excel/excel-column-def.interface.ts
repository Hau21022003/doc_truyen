// common/excel/interfaces/excel-column-def.interface.ts
export interface ExcelColumnDef<T = any> {
  header: string; // Tên hiển thị trên Excel
  key: keyof T | string; // Mapping với field entity
  width?: number;
  transform?: (value: any, row: T) => any; // Export transform
  parse?: (rawValue: any) => any; // Import parse
  required?: boolean; // Validate khi import
}
