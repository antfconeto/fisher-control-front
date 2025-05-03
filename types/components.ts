import { IconType } from "react-icons";

export type FilterInputType = "text" | "select" | "number";

export type FilterSize = "small" | "medium" | "large";

export interface FilterOption {
  label: string;
  value: string | number | undefined;
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  icon?: IconType;
  type: FilterInputType;
  size?: FilterSize;
  placeholder?: string;
  selectOptions?: FilterOption[]; 
  value: string | number | undefined; 
  onChange: (value: string | number) => void;
}


