/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { describe, expect, test } from '@jest/globals';
import * as StatementTypes from '../Types';
import { executeSentence } from './executeSentence';
import * as Helper from '../Helper';

describe('test executeSentence', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should not throw error when give null setter', () => {
    expect(() => executeSentence(null, {
      defaultNextStatementId: 'dmjlGYdv7F',
      setSaveData: null,
      setPauseComponent: null
    })).not.toThrowError();
  });

  test('should not execute when give null statement', () => {
    const setSaveData = jest.fn();
    const setPauseComponent = jest.fn();

    executeSentence(null, {
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
    const mockSplitLongSentences = jest.spyOn(Helper, 'splitLongSentences').mockReturnValue(['This is a sentence']);
    const statement: StatementTypes.SentenceStatementType = {
      id: 'AjwAUo8nui',
      order: 0,
      type: 's',
      data: 'This is a sentence'
    };
    const saveData: StatementTypes.SaveDataType = {
      statementCursorPos: 'AjwAUo8nui',
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
    executeSentence(statement, {
      defaultNextStatementId: defaultNextStatementId,
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    // asset
    expect(setPauseComponent).not.toBeCalled();
    expect(mockSplitLongSentences).toBeCalledWith(statement.data);
    expect(actual).toEqual({
      statementCursorPos: defaultNextStatementId,
      logCursorPos: null,
      context: {},
      readLogs: [
        {
          sourceStatementId: statement.id,
          order: 0,
          type: 's',
          data: 'This is a sentence'
        }
      ]
    });
  });

  test('should append 2 sentences when give a long sentence', () => {
    let actual: StatementTypes.SaveDataType = null;

    // arrange
    const mockSplitLongSentences = jest.spyOn(Helper, 'splitLongSentences').mockReturnValue([
      'Dummy sentence #1',
      'Dummy sentence #2',
    ]);
    const statement: StatementTypes.SentenceStatementType = {
      id: 'AjwAUo8nui',
      order: 0,
      type: 's',
      data: 'This is a long sentence'
    };
    const saveData: StatementTypes.SaveDataType = {
      statementCursorPos: 'AjwAUo8nui',
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
    executeSentence(statement, {
      defaultNextStatementId: defaultNextStatementId,
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    // asset
    expect(setPauseComponent).not.toBeCalled();
    expect(mockSplitLongSentences).toBeCalledWith(statement.data);
    expect(actual.readLogs).not.toBe(saveData.readLogs); // check the old array is not reuse
    expect(actual).toEqual({
      statementCursorPos: defaultNextStatementId,
      logCursorPos: null,
      context: {},
      readLogs: [
        ...saveData.readLogs,
        {
          sourceStatementId: statement.id,
          order: 11,
          type: 's',
          data: 'Dummy sentence #1',
        },
        {
          sourceStatementId: statement.id,
          order: 12,
          type: 's',
          data: 'Dummy sentence #2',
        }
      ]
    });
  });

  test('should append 1 end of line when give an empty sentence', () => {
    let actual: StatementTypes.SaveDataType = null;

    // arrange
    const mockSplitLongSentences = jest.spyOn(Helper, 'splitLongSentences').mockReturnValue(['']);
    const statement: StatementTypes.SentenceStatementType = {
      id: 'AjwAUo8nui',
      order: 0,
      type: 's',
      data: '' // This is a an empty sentence
    };
    const saveData: StatementTypes.SaveDataType = {
      statementCursorPos: 'AjwAUo8nui',
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
    executeSentence(statement, {
      defaultNextStatementId: defaultNextStatementId,
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    // asset
    expect(setPauseComponent).not.toBeCalled();
    expect(mockSplitLongSentences).toBeCalledWith(statement.data);
    expect(actual.readLogs).not.toBe(saveData.readLogs); // check the old array is not reuse
    expect(actual).toEqual({
      statementCursorPos: defaultNextStatementId,
      logCursorPos: null,
      context: {},
      readLogs: [
        ...saveData.readLogs,
        {
          sourceStatementId: statement.id,
          order: 11,
          type: 's',
          data: '',
        }
      ]
    });
  });
});
