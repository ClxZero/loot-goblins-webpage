export interface SpecializationsTable {
  spec_type: string;
  spec_target: string;
  spec_name: string;
  spec_description: string;
  spec_img_url?: string;
  players?: string | string[];
  extra_info?: string;
}

export interface SpecializationsTableTrimmed {
  spec_name: string;
  spec_description: string;
  spec_img_url?: string;
  players?: string[];
  extra_info?: string;
}

export interface SpecializationsTableParsed {
  [key: string]: {[key: string]: SpecializationsTableTrimmed[]};
}
