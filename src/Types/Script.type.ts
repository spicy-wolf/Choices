import { Types } from '@src/StatementEngine';

export type ScriptType = (Types.AnyStatementType & {
  metadataId: string;
})[];
