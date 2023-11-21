import * as StatementTypes from '../Types';
import { CheckStatementType } from '../Helper';
import { executeEndOfLine } from './executeEndOfLine';
import { executeFin } from './executeFin';
import { executeSentence } from './executeSentence';
import { executeParagraph } from './executeParagraph';
import type { ExecuteHelpersType } from './execute.type';
import { executeJump } from './executeJump';

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
  } else if (CheckStatementType.isJump(statement)) {
    const sentenceStatement = statement as StatementTypes.JumpStatementType;
    executeJump(sentenceStatement, helpers);
  } else {
    console.error('unknown statement type', statement);
  }
};
