// common/excel/excel.service.ts
import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { ExcelColumnDef } from './excel-column-def.interface';

@Injectable()
export class ExcelService {
  // ─── EXPORT ───────────────────────────────────────────────
  async export<T extends object>(
    data: T[],
    columns: ExcelColumnDef<T>[],
    options?: { sheetName?: string },
  ): Promise<Buffer> {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(options?.sheetName ?? 'Sheet1');

    ws.columns = columns.map((col) => ({
      header: col.header,
      key: col.key as string,
      width: col.width ?? 20,
    }));

    // Style header row
    ws.getRow(1).font = { bold: true };
    ws.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    };

    for (const row of data) {
      const rowData: Record<string, any> = {};
      for (const col of columns) {
        const raw = this.getNestedValue(row, col.key as string);
        rowData[col.key as string] = col.transform
          ? col.transform(raw, row)
          : raw;
      }
      ws.addRow(rowData);
    }

    // return wb.xlsx.writeBuffer() as Promise<Buffer>;
    const arrayBuffer = await wb.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }

  // ─── IMPORT ───────────────────────────────────────────────
  async import<T>(
    buffer: Buffer,
    columns: ExcelColumnDef<T>[],
    options?: { startRow?: number },
  ): Promise<{ data: Partial<T>[]; errors: ImportRowError[] }> {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(Buffer.from(buffer) as unknown as ArrayBuffer);
    const ws = wb.worksheets[0];

    const startRow = options?.startRow ?? 2; // row 1 = header
    const data: Partial<T>[] = [];
    const errors: ImportRowError[] = [];

    ws.eachRow((row, rowNumber) => {
      if (rowNumber < startRow) return;

      const record: Partial<T> = {} as any;
      const rowErrors: string[] = [];

      columns.forEach((col, colIndex) => {
        const cellValue = row.getCell(colIndex + 1).value;

        if (
          col.required &&
          (cellValue === null || cellValue === undefined || cellValue === '')
        ) {
          rowErrors.push(`"${col.header}" is required`);
          return;
        }

        const parsed = col.parse ? col.parse(cellValue) : cellValue;
        this.setNestedValue(record, col.key as string, parsed);
      });

      if (rowErrors.length) {
        errors.push({ row: rowNumber, messages: rowErrors });
      } else {
        data.push(record);
      }
    });

    return { data, errors };
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const last = keys.pop()!;
    const target = keys.reduce((acc, key) => (acc[key] ??= {}), obj);
    target[last] = value;
  }
}

export interface ImportRowError {
  row: number;
  messages: string[];
}
