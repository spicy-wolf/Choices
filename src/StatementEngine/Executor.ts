import { v4 as uuidv4 } from 'uuid';
import { Statements } from '@src/Types';

// TODO: return something to mention whether this round of execution added logs or not
export const Executor = (
  statement: Statements.AnyStatementType,
  hooks: {
    addReadingLogs: (statements: Statements.AnyStatementType[]) => void;
    moveScriptCursor: (statementId?: string) => void;
    setPendingStatement: (
      pendingStatement: Statements.PendingStatementType
    ) => void;
  }
) => {
  if (!statement) return;
  // TODO: check condition

  const componentType = statement?.type?.toLowerCase() ?? '';
  switch (componentType) {
    case 'endofline':
    case 'eol':
      let eolStatement = statement as Statements.EndOfLineStatementType;
      // update reading log
      hooks.addReadingLogs && hooks.addReadingLogs([eolStatement]);
      // move to next statement
      hooks.moveScriptCursor && hooks.moveScriptCursor();
      break;
    case 'paragraph':
    case 'p':
    case 'sentence':
    case 's':
      /**
       * Split a big paragraph into small pieces
       */
      let s = statement as
        | Statements.ParagraphStatementType
        | Statements.SentenceStatementType;
      let data = s.data;
      // TODO: replace inline variables
      data = data.replace(/\r?\n/g, '\n');

      let statementList: (
        | Statements.SentenceStatementType
        | Statements.EndOfLineStatementType
      )[] = [];
      // split by \n and keep separator
      // https://stackoverflow.com/questions/12001953/javascript-and-regex-split-string-and-keep-the-separator
      let sentences: string[] = data.split(/(\n)/g);
      for (let i = 0; i < sentences.length; i++) {
        let shorterSentences = sentences[i].match(/.{1,30}/g) ?? ''; // TODO: is 30 good?
        for (let ss of shorterSentences) {
          if (ss === '\n') {
            statementList.push({
              id: uuidv4(),
              type: 'eol',
            });
          } else {
            statementList.push({
              id: uuidv4(),
              type: 's',
              data: ss,
            });
          }
        }

        // paragraph needs one more eol
        if (componentType === 'paragraph' || componentType === 'p') {
          statementList.push({
            id: uuidv4(),
            type: 'eol',
          });
        }
      }
      // update reading log
      hooks.addReadingLogs && hooks.addReadingLogs(statementList);
      // move to next statement
      hooks.moveScriptCursor && hooks.moveScriptCursor();
      break;
    case 'fin':
    case 'end':
      const pendingStatement = statement as Statements.PendingStatementType;
      hooks.setPendingStatement(pendingStatement);
      // dont move to next statement since the pending statement pauses execution
      break;
    case 'selection':
      // TODO: replace options' inline variables
      break;
    case 'jump':
    case 'j':
      // let jStatement = statement as JumpProps;
      // let nextStatementId = jStatement.destination;
      // // TODO: check condition
      // // TODO: replace inline variables
      // if (nextStatementId) {
      //   hooks.setNextStatementById(nextStatementId);
      // }
      break;
    case 'setter':
      // TODO: compute values
      break;
    default:
      break;
  }
};
