import * as StatementTypes from '../Types';

export type ExecuteHelpersType = {
  defaultNextStatementId: string | null | undefined;
  setSaveData: React.Dispatch<React.SetStateAction<StatementTypes.SaveDataType>>;
  setPauseComponent: React.Dispatch<React.SetStateAction<StatementTypes.FinComponentType>>;
};
