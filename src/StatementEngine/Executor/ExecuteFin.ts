import * as StatementTypes from '../Types';

export const executeFin = (
  statement: StatementTypes.FinStatementType,
  controlMethods: {
    setPendingStatement: (
      pendingStatement: StatementTypes.PendingStatementType
    ) => void;
  }
) => {
  if (!statement) return;

  controlMethods.setPendingStatement &&
    controlMethods.setPendingStatement(statement);
  // dont move to next statement since the pending statement pauses execution
};
