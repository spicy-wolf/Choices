import {
  EndOfLineComponentType,
  EndOfLineStatementType,
} from './EndOfLineStatement.type';
import { FinComponentType, FinStatementType } from './FinStatement.type';
import {
  ParagraphComponentType,
  ParagraphStatementType,
} from './ParagraphStatement.type';
import {
  SentenceComponentType,
  SentenceStatementType,
} from './SentenceStatement.type';

type AnyStatementType =
  | EndOfLineStatementType
  | FinStatementType
  | ParagraphStatementType
  | SentenceStatementType;

type LogComponentType =
  | EndOfLineComponentType
  | ParagraphComponentType
  | SentenceComponentType;

// the type of statement which can pause statement execution
// these statements will never be stored in reading logs since they can replaced
// e.g. choices
type PauseComponentType = FinComponentType;

export {
  EndOfLineStatementType,
  FinStatementType,
  ParagraphStatementType,
  SentenceStatementType,
  // log types
  EndOfLineComponentType,
  FinComponentType,
  ParagraphComponentType,
  SentenceComponentType,
  //
  AnyStatementType,
  LogComponentType,
  PauseComponentType,
};
