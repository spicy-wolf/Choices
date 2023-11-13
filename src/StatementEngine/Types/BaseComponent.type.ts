export type BaseComponentType = {
  sourceStatementId: string;
  order: number | null; // this is needed to locate previous read postion
  type: string;
};
