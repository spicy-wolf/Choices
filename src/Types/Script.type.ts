export type ScriptType = Statement[];

export type Statement = {
  id?: string;
  order: number;
  type: string;
  [key: string]: any;
};
