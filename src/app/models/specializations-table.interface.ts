/** Users info
 * relation out on id */
export interface User {
  id: string;
  username: string;
  display_name: string;
}

/** Players info
 * relation in on use_id with User.id */
export interface Player {
  /** Relation with User.id */
  user_id: string;
  name: string;
  /** Really a boolean in mayus */
  is_default: string;
}

/** All details about a specialization
 * relation out on id */
export interface SpecializationsDetails {
  /** String of name, relates out */
  id: string;
  name: string;
  levels: string;
  type: string;
  affected: string;
  category: string;
  identity: string;
  description: string;
  icon_url: string;
  active: string; // actually a boolean, they arrive as 'TRUE' or 'FALSE'
}

/** Players who have a specialization in a certain point in time
 * relation in on use_id with User.id
 * relation in on  specialization_id with SpecializationsDetails.id */
export interface PlayerSpec {
  /** Relation with User.id */
  user_id: string;
  level: string;
  /** Relation with SpecializationsDetails.id */
  specialization_id: string;
}

export interface TableData {
  columns: ColumnConfig[];
  rows: any[];
}

export type ColumnConfig = {
  title: string;
  key: string;
};
