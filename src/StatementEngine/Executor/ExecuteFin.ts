import * as StatementTypes from '../Types';
import type { ExecuteHelpersType } from './Execute.type';

export const executeFin = (
  statement: StatementTypes.FinStatementType,
  helpers: ExecuteHelpersType
) => {
  if (!statement) return;

  const setSaveData = helpers?.setSaveData;
  if (!setSaveData) return;

  helpers.setPauseComponent({
    sourceStatementId: helpers.defaultNextStatementId,
    order: null, // fin component does not have order because it is always at the bottom
    type: statement.type,
  } as StatementTypes.FinComponentType);
};
