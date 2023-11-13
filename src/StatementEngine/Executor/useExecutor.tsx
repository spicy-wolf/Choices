import React, { useEffect, useMemo } from 'react';
import * as StatementTypes from '../Types';
import { execute } from './Execute';

type AnyStatementType = StatementTypes.AnyStatementType;

export const useExecutor = (
  scripts: AnyStatementType[],
  saveData: StatementTypes.SaveDataType,
  setSaveData: React.Dispatch<
    React.SetStateAction<StatementTypes.SaveDataType>
  >,
  setPauseComponent: React.Dispatch<
    React.SetStateAction<StatementTypes.FinComponentType>
  >
) => {
  const [triggerExecuting, setTriggerExecuting] =
    React.useState<boolean>(false);

  // create a script dic base on script array to speed up search by id
  const scriptIdIndexDic: { [key: string]: number } = useMemo(() => {
    let result = {};
    if (scripts && scripts.length > 0) {
      result = scripts.reduce<{ [key: string]: number }>(
        (dic, current, index) => {
          dic[current.id] = index;
          return dic;
        },
        {}
      );
    }
    return result;
  }, [scripts]);

  useEffect(() => {
    if (!triggerExecuting) return;
    setTriggerExecuting(false);

    //#region execute scripts
    if (scripts.length === 0) return;

    const currentStatementId = saveData?.scriptCursorPos;
    const currentStatementCursorIndex =
      scriptIdIndexDic[currentStatementId] ?? 0;
    const currentStatement: AnyStatementType =
      scripts[currentStatementCursorIndex];
    const defaultNextStatementId: string =
      scripts?.[currentStatementCursorIndex + 1]?.id;

    execute(currentStatement, {
      defaultNextStatementId: defaultNextStatementId,
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent,
    });
    //#endregion
  }, [triggerExecuting]);

  const doExecution = () => {
    setTriggerExecuting(true);
  };

  return { doExecution };
};
