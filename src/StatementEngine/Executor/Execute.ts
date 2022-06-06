import * as StatementTypes from '../Types';
import { CheckStatementType } from '../Helper';
import { executeEndOfLine } from './ExecuteEndOfLine';
import { executeFin } from './ExecuteFin';
import {
  executeParagraph,
  executeSentence,
} from './ExecuteSentenceOrParagraph';

// TODO: return something to mention whether this round of execution added logs or not
export const execute = (
  statement: StatementTypes.AnyStatementType,
  controlMethods: {
    addReadingLogs: (statements: StatementTypes.LogComponentType[]) => void;
    moveScriptCursor: (statementId?: string) => void;
    setPauseComponent: (
      pauseComponent: StatementTypes.PauseComponentType
    ) => void;
  }
) => {
  if (!statement) return;
  // TODO: check condition

  if (CheckStatementType.isEndOfLine(statement)) {
    let eolStatement = statement as StatementTypes.EndOfLineStatementType;
    executeEndOfLine(eolStatement, controlMethods);
  } else if (CheckStatementType.isFin(statement)) {
    const finStatement = statement as StatementTypes.FinStatementType;
    executeFin(finStatement, controlMethods);
  } else if (CheckStatementType.isParagraph(statement)) {
    const paragraphStatement =
      statement as StatementTypes.ParagraphStatementType;
    executeParagraph(paragraphStatement, controlMethods);
  } else if (CheckStatementType.isSentence(statement)) {
    const sentenceStatement = statement as StatementTypes.SentenceStatementType;
    executeSentence(sentenceStatement, controlMethods);
  } else {
    // Error for unknown
  }
};
