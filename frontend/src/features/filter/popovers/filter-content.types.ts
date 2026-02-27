import { AnyFilterConfig } from "../filter.types";

export interface FilterContentProps {
  config: AnyFilterConfig;
  value: any;
  onChange: (value: any) => void;
  onClose: () => void;
}
