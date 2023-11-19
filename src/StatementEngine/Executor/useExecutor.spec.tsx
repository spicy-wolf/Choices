import { describe, expect, test } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import * as StatementTypes from '../Types';
import { useExecutor } from './useExecutor';
import * as Execute from './execute';

describe('test useExecutor hook', () => {
  let mockExecute: jest.SpyInstance;
  beforeEach(() => {
    mockExecute = jest.spyOn(Execute, 'execute').mockReturnValue(null);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should not call "execute" when giving 0 statement', () => {
    const scripts: StatementTypes.AnyStatementType[] = [];
    const saveData: StatementTypes.SaveDataType = null;
    const setSaveData: React.Dispatch<React.SetStateAction<StatementTypes.SaveDataType>> = jest.fn();
    const setPauseComponent: React.Dispatch<React.SetStateAction<StatementTypes.FinComponentType>> = jest.fn();

    const { result } = renderHook(() => useExecutor(scripts, saveData, setSaveData, setPauseComponent));
    act(() => result.current.doExecution());

    expect(mockExecute).not.toHaveBeenCalled();
  });

  test('should execute first statement when start', () => {
    const scripts: StatementTypes.AnyStatementType[] = [
      {
        id: 'LxSx0ehkYb',
        type: 'endofline',
        order: 0,
      },
      {
        id: 'Kylq1wXtq3',
        type: 'endofline',
        order: 1,
      }
    ];
    const saveData: StatementTypes.SaveDataType = null;
    const setSaveData: React.Dispatch<React.SetStateAction<StatementTypes.SaveDataType>> = jest.fn();
    const setPauseComponent: React.Dispatch<React.SetStateAction<StatementTypes.FinComponentType>> = jest.fn();

    const { result } = renderHook(() => useExecutor(scripts, saveData, setSaveData, setPauseComponent));
    act(() => result.current.doExecution());

    expect(mockExecute).toHaveBeenCalledTimes(1);
    expect(mockExecute).toBeCalledWith(
      scripts[0],
      { defaultNextStatementId: scripts[1].id, setSaveData: setSaveData, setPauseComponent: setPauseComponent }
    );
  });

  test('should execute 2nd statement when 1st statement is executed', () => {
    const scripts: StatementTypes.AnyStatementType[] = [
      {
        id: 'LxSx0ehkYb',
        type: 'endofline',
        order: 0,
      },
      {
        id: 'Kylq1wXtq3',
        type: 'endofline',
        order: 1,
      }
    ];
    const saveData: StatementTypes.SaveDataType = {
      scriptCursorPos: scripts[1].id,
      logCursorPos: undefined,
      context: {},
      readLogs: []
    };
    const setSaveData: React.Dispatch<React.SetStateAction<StatementTypes.SaveDataType>> = jest.fn();
    const setPauseComponent: React.Dispatch<React.SetStateAction<StatementTypes.FinComponentType>> = jest.fn();

    const { result } = renderHook(() => useExecutor(scripts, saveData, setSaveData, setPauseComponent));
    act(() => result.current.doExecution());

    expect(mockExecute).toHaveBeenCalledTimes(1);
    expect(mockExecute).toBeCalledWith(
      scripts[1],
      { defaultNextStatementId: undefined, setSaveData: setSaveData, setPauseComponent: setPauseComponent }
    );
  });
});