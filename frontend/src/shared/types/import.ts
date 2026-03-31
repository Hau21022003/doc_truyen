export interface ImportResult {
  imported: number;
  errors: { row: number; messages: string[] }[];
}
