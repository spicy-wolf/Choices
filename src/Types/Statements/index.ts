import { AbstractStatementType } from './AbstractStatement.type';
import { EndOfLineStatementType } from './EndOfLineStatement.type';
import { ParagraphStatementType } from './ParagraphStatement.type';
import { SentenceStatementType } from './SentenceStatement.type';

type AnyStatementType =
  | EndOfLineStatementType
  | ParagraphStatementType
  | SentenceStatementType;

export {
  AbstractStatementType,
  EndOfLineStatementType,
  ParagraphStatementType,
  SentenceStatementType,
  AnyStatementType,
};
