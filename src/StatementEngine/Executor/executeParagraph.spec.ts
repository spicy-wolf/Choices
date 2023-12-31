/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { describe, expect, test } from '@jest/globals';
import * as StatementTypes from '../Types';
import { executeParagraph } from './executeParagraph';
import * as Helper from '../Helper';

describe('test executeParagraph', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should not throw error when give null setter', () => {
    expect(() => executeParagraph(null, {
      defaultNextStatementId: 'dmjlGYdv7F',
      setSaveData: null,
      setPauseComponent: null
    })).not.toThrowError();
  });

  test('should not execute when give null statement', () => {
    const setSaveData = jest.fn();
    const setPauseComponent = jest.fn();

    executeParagraph(null, {
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
    const mockSplitLongSentences = jest.spyOn(Helper, 'splitLongSentences').mockReturnValue(['This is a a paragraph']);
    const statement: StatementTypes.ParagraphStatementType = {
      id: 'AjwAUo8nui',
      order: 0,
      type: 'p',
      data: 'This is a a paragraph'
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
    executeParagraph(statement, {
      defaultNextStatementId: defaultNextStatementId,
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    // asset
    expect(setPauseComponent).not.toBeCalled();
    expect(mockSplitLongSentences).toBeCalledWith(statement.data);
    expect(actual).toEqual({
      scriptCursorPos: defaultNextStatementId,
      logCursorPos: null,
      context: {},
      readLogs: [
        {
          sourceStatementId: statement.id,
          order: 0,
          type: 's',
          data: 'This is a a paragraph'
        },
        {
          sourceStatementId: statement.id,
          order: 1,
          type: 'eol',
        }
      ]
    });
  });

  test('should append 2 sentences and 1 end of line when give a long paragraph', () => {
    let actual: StatementTypes.SaveDataType = null;

    // arrange
    const mockSplitLongSentences = jest.spyOn(Helper, 'splitLongSentences').mockReturnValue([
      'Dummy sentence #1',
      'Dummy sentence #2',
    ]);
    const statement: StatementTypes.ParagraphStatementType = {
      id: 'AjwAUo8nui',
      order: 0,
      type: 'p',
      data: 'This is a long paragraph'
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
    executeParagraph(statement, {
      defaultNextStatementId: defaultNextStatementId,
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    // asset
    expect(setPauseComponent).not.toBeCalled();
    expect(mockSplitLongSentences).toBeCalledWith(statement.data);
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
          type: 's',
          data: 'Dummy sentence #1',
        },
        {
          sourceStatementId: statement.id,
          order: 12,
          type: 's',
          data: 'Dummy sentence #2',
        },
        {
          sourceStatementId: statement.id,
          order: 13,
          type: 'eol',
        }
      ]
    });
  });

  test('should append 1 end of line when give an empty paragraph', () => {
    let actual: StatementTypes.SaveDataType = null;

    // arrange
    const mockSplitLongSentences = jest.spyOn(Helper, 'splitLongSentences').mockReturnValue(['']);
    const statement: StatementTypes.ParagraphStatementType = {
      id: 'AjwAUo8nui',
      order: 0,
      type: 'p',
      data: '' // This is a an empty paragraph
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
    executeParagraph(statement, {
      defaultNextStatementId: defaultNextStatementId,
      setSaveData: setSaveData,
      setPauseComponent: setPauseComponent
    });

    // asset
    expect(setPauseComponent).not.toBeCalled();
    expect(mockSplitLongSentences).toBeCalledWith(statement.data);
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
          type: 's',
          data: '',
        },
        {
          sourceStatementId: statement.id,
          order: 12,
          type: 'eol',
        }
      ]
    });
  });
});
