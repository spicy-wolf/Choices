import { describe, expect, test } from '@jest/globals';
import * as StatementTypes from '../Types';
import { executeJump } from './executeJump';

describe('test executeJump', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should not throw error when give null setter', () => {
    expect(() => executeJump(null, {
      defaultNextStatementId: 'dmjlGYdv7F',
      setSaveData: null,
      setPauseComponent: null
    })).not.toThrowError();
  });

  test('should not execute when give null statement', () => {
    const setSaveData = jest.fn();
    const setPauseComponent = jest.fn();

    executeJump(null, {
      defaultNextStatementId: 'dmjlGYdv7F',
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    expect(setSaveData).not.toBeCalled();
    expect(setPauseComponent).not.toBeCalled();
  });

  test('should set given script cursor when give jump statement', () => {
    let actual: StatementTypes.SaveDataType = null;

    // arrange
    const statement: StatementTypes.JumpStatementType = {
      id: 'AjwAUo8nui',
      order: 0,
      type: 'jump',
      targetId: '8Wx4ShlqBF'
    };
    const saveData: StatementTypes.SaveDataType = {
      scriptCursorPos: 'AjwAUo8nui',
      logCursorPos: null,
      context: {},
      readLogs: null
    };
    const defaultNextStatementId = 'dmjlGYdv7F';
    const setSaveData = (callback: (_saveData: StatementTypes.SaveDataType) => StatementTypes.SaveDataType) => {
      actual = callback(saveData);
    };
    const setPauseComponent = jest.fn();

    // act
    executeJump(statement, {
      defaultNextStatementId: defaultNextStatementId,
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    // asset
    expect(setPauseComponent).not.toBeCalled();
    expect(actual?.scriptCursorPos).not.toEqual(defaultNextStatementId);
    expect(actual?.scriptCursorPos).toEqual(statement.targetId);
  });
});