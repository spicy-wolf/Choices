import { AnyStatementType } from './Statements';

export type ScriptType = (AnyStatementType & { metadataId: string })[];
