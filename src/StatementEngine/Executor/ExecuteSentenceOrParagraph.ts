import { v4 as uuidv4 } from 'uuid';
import * as StatementTypes from '../Types';
import { StatementTypeNames } from '../Constants';

export const executeSentence = (
  statement: StatementTypes.SentenceStatementType,
  controlMethods: {
    addReadingLogs: (statements: StatementTypes.AnyStatementType[]) => void;
    moveScriptCursor: (statementId?: string) => void;
  }
) => {
  if (!statement) return;

  const statementList = splitLongStatement(statement);

  // update reading log
  controlMethods.addReadingLogs && controlMethods.addReadingLogs(statementList);
  // move to next statement
  controlMethods.moveScriptCursor && controlMethods.moveScriptCursor();
};

export const executeParagraph = (
  statement: StatementTypes.ParagraphStatementType,
  hooks: {
    addReadingLogs: (statements: StatementTypes.AnyStatementType[]) => void;
    moveScriptCursor: (statementId?: string) => void;
  }
) => {
  if (!statement) return;

  const statementList = splitLongStatement(statement);

  // paragraph needs one more eol
  statementList.push({
    id: uuidv4(),
    type: StatementTypeNames.END_OF_LINE[0],
  });

  // update reading log
  hooks.addReadingLogs && hooks.addReadingLogs(statementList);
  // move to next statement
  hooks.moveScriptCursor && hooks.moveScriptCursor();
};

const splitLongStatement = (
  statement:
    | StatementTypes.SentenceStatementType
    | StatementTypes.ParagraphStatementType
): Array<
  StatementTypes.SentenceStatementType | StatementTypes.EndOfLineStatementType
> => {
  let statementList: Array<
    StatementTypes.SentenceStatementType | StatementTypes.EndOfLineStatementType
  > = [];

  if (!statement) return statementList;

  /**
   * Split a big paragraph into small pieces
   */
  let data = statement.data;
  // TODO: replace inline variables
  data = data.replace(/\r?\n/g, '\n');

  // split by \n and keep separator
  // https://stackoverflow.com/questions/12001953/javascript-and-regex-split-string-and-keep-the-separator
  let sentences: string[] = data.split(/(\n)/g);
  for (let i = 0; i < sentences.length; i++) {
    let shorterSentences = sentences[i].match(/.{1,30}/g) ?? ''; // TODO: is 30 good?
    for (let ss of shorterSentences) {
      if (ss === '\n') {
        statementList.push({
          id: uuidv4(),
          type: StatementTypeNames.END_OF_LINE[0],
        });
      } else {
        statementList.push({
          id: uuidv4(),
          type: StatementTypeNames.SENTENCE[0],
          data: ss,
        });
      }
    }
  }

  return statementList;
};
