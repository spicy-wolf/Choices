import * as StatementTypes from '../Types';

export const executeFin = (
  statement: StatementTypes.FinStatementType,
  controlMethods: {
    setPauseComponent: (
      pauseComponent: StatementTypes.PauseComponentType
    ) => void;
  }
) => {
  if (!statement) return;

  const component: StatementTypes.FinComponentType = {
    sourceStatementId: statement.id,
    order: null, // fin component does not have order because it is always at the bottom
    type: statement.type,
  };
  controlMethods.setPauseComponent &&
    controlMethods.setPauseComponent(component);
  // dont move to next statement since the pause component pauses execution
};
