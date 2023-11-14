export type AbstractStatementType = {
  id: string;
  order: number;
  type: string;
  condition?: string | Function;
};

export type AbstractComponentType = {
  sourceStatementId: string;
  /**
   * Note: the order value is init to null, then it will be assigned in addReadLog func
   */
  order: number | null;
  type: string;
};
