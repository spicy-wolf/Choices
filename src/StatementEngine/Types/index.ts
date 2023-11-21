import { SaveDataType } from './SaveData.type';
import { EndOfLineStatementType } from './EndOfLineStatement.type';
import { FinStatementType } from './FinStatement.type';
import { ParagraphStatementType } from './ParagraphStatement.type';
import { SentenceStatementType } from './SentenceStatement.type';
import { JumpStatementType } from './JumpStatement.type';
import { EndOfLineComponentType } from './EndOfLineComponent.type';
import { FinComponentType } from './FinComponent.type';
import { ParagraphComponentType } from './ParagraphComponent.type';
import { SentenceComponentType } from './SentenceComponent.type';
import { JumpComponentType } from './JumpComponent.type';

type AnyStatementType =
  | EndOfLineStatementType
  | FinStatementType
  | ParagraphStatementType
  | SentenceStatementType
  | JumpStatementType;

type AnyComponentType =
  | FinComponentType
  | EndOfLineComponentType
  | ParagraphComponentType
  | SentenceComponentType
  | JumpComponentType;

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
  JumpStatementType,
  // Components
  EndOfLineComponentType,
  FinComponentType,
  ParagraphComponentType,
  SentenceComponentType,
  JumpComponentType,
  //
  AnyStatementType,
  AnyComponentType,
  AnyPauseComponentType as PauseComponentType,
};
