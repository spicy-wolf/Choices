import * as StatementTypes from '../Types';

export const executeEndOfLine = (
  statement: StatementTypes.EndOfLineStatementType,
  controlMethods: {
    addReadingLogs: (statements: StatementTypes.AnyStatementType[]) => void;
    moveScriptCursor: (statementId?: string) => void;
  }
) => {
  if (!statement) return;

  // update reading log
  controlMethods.addReadingLogs && controlMethods.addReadingLogs([statement]);
  // move to next statement
  controlMethods.moveScriptCursor && controlMethods.moveScriptCursor();
};
