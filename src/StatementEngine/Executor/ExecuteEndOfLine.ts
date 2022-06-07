import * as StatementTypes from '../Types';

export const executeEndOfLine = (
  statement: StatementTypes.EndOfLineStatementType,
  controlMethods: {
    addReadingLogs: (statements: StatementTypes.LogComponentType[]) => void;
    moveScriptCursor: (statementId?: string) => void;
  }
) => {
  if (!statement) return;

  // update reading log
  if (controlMethods.addReadingLogs) {
    // convert statement to log
    const component: StatementTypes.EndOfLineComponentType = {
      sourceStatementId: statement.id,
      order: null, // the order will be filled in addReadingLogs
      type: statement.type,
    };
    controlMethods.addReadingLogs([component]);
  }
  // move to next statement
  controlMethods.moveScriptCursor && controlMethods.moveScriptCursor();
};
