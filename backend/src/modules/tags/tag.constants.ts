import { ExcelColumnDef } from '@/modules/common/excel/excel-column-def.interface';
import { Tag } from './entities/tag.entity';

export const TAG_FIELDS = {
  NAME: 'name',
  SLUG: 'slug',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export const TAG_EXCEL_COLUMNS: ExcelColumnDef<Tag>[] = [
  { header: 'Name', key: 'name', width: 30, required: true },
  { header: 'Slug', key: 'slug', width: 25, required: true },
  {
    header: 'Featured',
    key: 'isFeatured',
    width: 12,
    transform: (v) => (v ? 'Yes' : 'No'), // chuyển sang khi export
    parse: (v) => String(v).toLowerCase() === 'yes', // chuyển sang khi import
    required: true,
  },
];
