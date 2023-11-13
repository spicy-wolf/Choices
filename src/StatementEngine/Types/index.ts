import { SaveDataType } from './SaveData.type';
import { EndOfLineStatementType } from './EndOfLineStatement.type';
import { FinStatementType } from './FinStatement.type';
import { ParagraphStatementType } from './ParagraphStatement.type';
import { SentenceStatementType } from './SentenceStatement.type';
import { EndOfLineComponentType } from './EndOfLineComponent.type';
import { FinComponentType } from './FinComponent.type';
import { ParagraphComponentType } from './ParagraphComponent.type';
import { SentenceComponentType } from './SentenceComponent.type';

type AnyStatementType =
  | EndOfLineStatementType
  | FinStatementType
  | ParagraphStatementType
  | SentenceStatementType;

type AnyComponentType =
  | FinComponentType
  | EndOfLineComponentType
  | ParagraphComponentType
  | SentenceComponentType;

// the type of statement which can pause statement execution
// these statements will never be stored in reading logs since they can replaced
// e.g. choices
type AnyPauseComponentType = FinComponentType;

export {
  SaveDataType,
  // Statements
  EndOfLineStatementType,
  FinStatementType,
  ParagraphStatementType,
  SentenceStatementType,
  // Components
  EndOfLineComponentType,
  FinComponentType,
  ParagraphComponentType,
  SentenceComponentType,
  //
  AnyStatementType,
  AnyComponentType,
  AnyPauseComponentType as PauseComponentType,
};
