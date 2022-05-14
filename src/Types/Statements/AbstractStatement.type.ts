export type AbstractStatementType = {
  id?: string;
  order?: number;
  type: string;
  scriptId?: string;
  condition?: string | Function;
};
