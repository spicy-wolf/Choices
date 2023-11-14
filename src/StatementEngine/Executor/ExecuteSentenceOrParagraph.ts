import { v4 as uuidv4 } from 'uuid';
import * as StatementTypes from '../Types';
import { StatementTypeNames } from '../Constants';

export const executeSentence = (
  statement: StatementTypes.SentenceStatementType,
  controlMethods: {
    addReadLogs: (statements: StatementTypes.LogComponentType[]) => void;
    moveScriptCursor: (statementId?: string) => void;
  }
) => {
  if (!statement) return;

  const components: StatementTypes.LogComponentType[] =
    splitLongStatement(statement);

  // update reading log
  controlMethods.addReadLogs && controlMethods.addReadLogs(components);
  // move to next statement
  controlMethods.moveScriptCursor && controlMethods.moveScriptCursor();
};

export const executeParagraph = (
  statement: StatementTypes.ParagraphStatementType,
  hooks: {
    addReadLogs: (statements: StatementTypes.LogComponentType[]) => void;
    moveScriptCursor: (statementId?: string) => void;
  }
) => {
  if (!statement) return;

  const components: StatementTypes.LogComponentType[] =
    splitLongStatement(statement);

  // paragraph needs one more eol
  components.push({
    sourceStatementId: statement.id,
    order: null,
    type: StatementTypeNames.END_OF_LINE[0],
  });

  // update reading log
  hooks.addReadLogs && hooks.addReadLogs(components);
  // move to next statement
  hooks.moveScriptCursor && hooks.moveScriptCursor();
};

const splitLongStatement = (
  statement:
    | StatementTypes.SentenceStatementType
    | StatementTypes.ParagraphStatementType
): Array<
  StatementTypes.SentenceComponentType | StatementTypes.EndOfLineComponentType
> => {
  let components: Array<
    StatementTypes.SentenceComponentType | StatementTypes.EndOfLineComponentType
  > = [];

  if (!statement) return components;

  /**
   * Split a big paragraph into small pieces
   */
  let data = statement.data?.toString() ?? '';
  // TODO: replace inline variables
  data = data.replace(/\r?\n/g, '\n');

  // split by \n and keep separator
  // https://stackoverflow.com/questions/12001953/javascript-and-regex-split-string-and-keep-the-separator
  let sentences: string[] = data.split(/(\n)/g);
  for (let i = 0; i < sentences.length; i++) {
    let shorterSentences = sentences[i].match(/.{1,30}/g) ?? ''; // TODO: is 30 good?
    for (let ss of shorterSentences) {
      // convert statement to log
      if (ss === '\n') {
        components.push({
          sourceStatementId: statement.id,
          order: null,
          type: StatementTypeNames.END_OF_LINE[0],
        });
      } else {
        components.push({
          sourceStatementId: statement.id,
          order: null,
          type: StatementTypeNames.SENTENCE[0],
          data: ss,
        });
      }
    }
  }

  return components;
};
