import { describe, expect, test } from '@jest/globals';
import * as StatementTypes from '../Types';
import { executeEndOfLine } from './executeEndOfLine';

describe('test executeEndOfLine', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should not throw error when give null setter', () => {
    expect(() => executeEndOfLine(null, {
      defaultNextStatementId: 'dmjlGYdv7F',
      setSaveData: null,
      setPauseComponent: null
    })).not.toThrowError();
  });

  test('should not execute when give null statement', () => {
    const setSaveData = jest.fn();
    const setPauseComponent = jest.fn();

    executeEndOfLine(null, {
      defaultNextStatementId: 'dmjlGYdv7F',
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    expect(setSaveData).not.toBeCalled();
    expect(setPauseComponent).not.toBeCalled();
  });

  test('should start order from 0 when start executing without read logs', () => {
    let actual: StatementTypes.SaveDataType = null;

    // arrange
    const statement: StatementTypes.EndOfLineStatementType = {
      id: 'AjwAUo8nui',
      order: 0,
      type: 'eol'
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
    executeEndOfLine(statement, {
      defaultNextStatementId: defaultNextStatementId,
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    // asset
    expect(setPauseComponent).not.toBeCalled();
    expect(actual).toEqual({
      scriptCursorPos: defaultNextStatementId,
      logCursorPos: null,
      context: {},
      readLogs: [
        {
          sourceStatementId: statement.id,
          order: 0,
          type: 'eol',
        }
      ]
    });
  });

  test('should append 1 end of line when execute end of line statement', () => {
    let actual: StatementTypes.SaveDataType = null;

    // arrange
    const statement: StatementTypes.EndOfLineStatementType = {
      id: 'AjwAUo8nui',
      order: 0,
      type: 'eol'
    };
    const saveData: StatementTypes.SaveDataType = {
      scriptCursorPos: 'AjwAUo8nui',
      logCursorPos: null,
      context: {},
      readLogs: [
        {
          sourceStatementId: 'BP8Yj4yYp0',
          order: 10,
          type: 'eol',
        }
      ]
    };
    const defaultNextStatementId = 'dmjlGYdv7F';
    const setSaveData = (callback: (_saveData: StatementTypes.SaveDataType) => StatementTypes.SaveDataType) => {
      actual = callback(saveData);
    };
    const setPauseComponent = jest.fn();

    // act
    executeEndOfLine(statement, {
      defaultNextStatementId: defaultNextStatementId,
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    // asset
    expect(setPauseComponent).not.toBeCalled();
    expect(actual.readLogs).not.toBe(saveData.readLogs); // check the old array is not reuse
    expect(actual).toEqual({
      scriptCursorPos: defaultNextStatementId,
      logCursorPos: null,
      context: {},
      readLogs: [
        ...saveData.readLogs,
        {
          sourceStatementId: statement.id,
          order: 11,
          type: 'eol',
        }
      ]
    });
  });
});