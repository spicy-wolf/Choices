import * as StatementTypes from '../Types';
import { CheckStatementType } from '../Helper';
import { executeEndOfLine } from './ExecuteEndOfLine';
import { executeFin } from './ExecuteFin';
import { executeSentence } from './ExecuteSentence';
import { executeParagraph } from './ExecuteParagraph';
import type { ExecuteHelpersType } from './Execute.type';

// TODO: return something to mention whether this round of execution added logs or not
export const execute = (
  statement: StatementTypes.AnyStatementType,
  helpers: ExecuteHelpersType
) => {
  if (!statement) return;
  // TODO: check condition

  if (CheckStatementType.isEndOfLine(statement)) {
    const eolStatement = statement as StatementTypes.EndOfLineStatementType;
    executeEndOfLine(eolStatement, helpers);
  } else if (CheckStatementType.isFin(statement)) {
    const finStatement = statement as StatementTypes.FinStatementType;
    executeFin(finStatement, helpers);
  } else if (CheckStatementType.isParagraph(statement)) {
    const paragraphStatement =
      statement as StatementTypes.ParagraphStatementType;
    executeParagraph(paragraphStatement, helpers);
  } else if (CheckStatementType.isSentence(statement)) {
    const sentenceStatement = statement as StatementTypes.SentenceStatementType;
    executeSentence(sentenceStatement, helpers);
  } else {
    //TODO: Error for unknown
  }
};
