import { describe, expect, test } from '@jest/globals';
import * as StatementTypes from '../Types';
import { executeFin } from './executeFin';

describe('test executeFin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should not throw error when give null setter', () => {
    expect(() => executeFin(null, {
      defaultNextStatementId: 'dmjlGYdv7F',
      setSaveData: null,
      setPauseComponent: null
    })).not.toThrowError();
  });

  test('should not execute when give null statement', () => {
    const setSaveData = jest.fn();
    const setPauseComponent = jest.fn();

    executeFin(null, {
      defaultNextStatementId: 'dmjlGYdv7F',
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    expect(setSaveData).not.toBeCalled();
    expect(setPauseComponent).not.toBeCalled();
  });

  test('should set pause component when give fin statement', () => {
    // arrange
    const statement: StatementTypes.FinStatementType = {
      id: 'AjwAUo8nui',
      order: 0,
      type: 'fin',
    };
    const setSaveData = jest.fn();
    const setPauseComponent = jest.fn();

    // act
    executeFin(statement, {
      defaultNextStatementId: null,
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    // asset
    expect(setSaveData).not.toBeCalled();
    expect(setPauseComponent).toBeCalledWith({
      sourceStatementId: 'AjwAUo8nui',
      order: null,
      type: 'fin',
    });
  });
});