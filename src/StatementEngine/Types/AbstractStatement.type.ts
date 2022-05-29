export type AbstractStatementType = {
  id?: string;
  order?: number;
  type: string;
  condition?: string | Function;
};
