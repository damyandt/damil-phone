export type FormStatuses =
  | "error"
  | "success"
  | "info"
  | "warning"
  | "loading"
  | null;
export type SelectOption<T extends string = string> = {
  value: T;
  description: string;
};
export type Table = {
  config: Configuration;
  columns: Column[];
  // rows: Row[];
  rows: any;
};
export type PaletteMode = "light" | "dark";
export type Row = Record<string, any>;

export type Column = {
  onCreation?: number;
  field: string;
  header: string;
  type: ColumnType;
  align?: "left" | "center" | "right";
  width?: number;
  dropDownConfig?: {
    url: string;
  };
  enumConfig?: {
    url: string;
  };
};

export interface Response<TData> {
  success: boolean;
  message: string;
  errorCode: string | null;
  data: TData;
  validationErrors: Record<string, string> | {};
}

export type Enum = {
  title: string;
  value: string | number;
};

export type ColumnType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "custom"
  | "enum"
  | "dropdown"
  | "phone";

export type Configuration = {
  sortable?: {
    field: string;
    desc: boolean;
  };
  actions?: TableAction[];
  columnsLayoutConfig: {
    columnVisibility: Record<string, boolean>;
  };
  createFields?: Record<string, boolean>;
  pagination: {
    pageSize: number;
  };
};

export type TableAction = {
  id: string;
  name: string;
  url: string;
};

export type AutocompleteOption = SelectOption;

export type AutocompleteGroupedOption = {
  value: string;
  groupName: string;
  description: string;
};

export type DeleteQueueType = {
  [key: string]: {
    progress: number;
    timerId: any;
  };
};

export type PreferencesType = {
  themeColor: string;
  mode: "light" | "dark";
  language: string;
  currency: string;
  homeFilters: string[];
};

export type EnumMap = {
  [key: string]: Enum[];
};
