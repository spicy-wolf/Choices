import { EndOfLineStatementType } from './EndOfLineStatement.type';
import { FinStatementType } from './FinStatement.type';
import { ParagraphStatementType } from './ParagraphStatement.type';
import { SentenceStatementType } from './SentenceStatement.type';

type AnyStatementType =
  | EndOfLineStatementType
  | FinStatementType
  | ParagraphStatementType
  | SentenceStatementType;

// the type of statement which can pause statement execution
// these statements will never be stored in reading logs since they can replaced
// e.g. choices
type PendingStatementType = FinStatementType;

export {
  EndOfLineStatementType,
  FinStatementType,
  ParagraphStatementType,
  SentenceStatementType,
  AnyStatementType,
  PendingStatementType,
};
