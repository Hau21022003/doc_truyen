import { FILTER_TYPE, FilterType } from "./filter.constants";

// Define specific types for each filter type's value
export type TextFilterValue = string;
export type SelectFilterValue = string;
export type ComboboxFilterValue = string[];
export type DateRangeFilterValue = {
  from: string | Date;
  to: string | Date;
};

// Create a union type for all possible filter values
export type FilterValue =
  | TextFilterValue
  | SelectFilterValue
  | ComboboxFilterValue
  | DateRangeFilterValue
  | null;

type FilterTypeMap = {
  [FILTER_TYPE.TEXT]: TextFilterValue;
  [FILTER_TYPE.SELECT]: SelectFilterValue;
  [FILTER_TYPE.COMBOBOX]: ComboboxFilterValue;
  [FILTER_TYPE.DATE_RANGE]: DateRangeFilterValue;
};

type FilterTypeToValue<T extends FilterType> = FilterTypeMap[T] | null;

export type FilterConfig<T extends FilterType = FilterType> = {
  key: string;
  label: string;
  defaultVisible: boolean;
  defaultValue?: FilterTypeToValue<T>; // giá trị mặc định
  type: T;
  options?: Array<{
    label: string;
    value: string;
    render?: () => React.ReactNode;
  }>; // chỉ dùng cho select/combobox
  render?: () => React.ReactNode; // dùng cho render trigger
  onChange?: (value: FilterTypeToValue<T>) => void;
  // callback khi filter thay đổi
  // Use indexed access type
  placeholder?: string;
  popoverSize?: "sm" | "md" | "lg" | "xl";
};

export type AnyFilterConfig =
  | FilterConfig<typeof FILTER_TYPE.TEXT>
  | FilterConfig<typeof FILTER_TYPE.SELECT>
  | FilterConfig<typeof FILTER_TYPE.COMBOBOX>
  | FilterConfig<typeof FILTER_TYPE.DATE_RANGE>;

export type FilterState<T extends FilterType = FilterType> = {
  visible: boolean;
  value: FilterTypeToValue<T>;
};

export type FilterStateMap = Record<string, FilterState>;
