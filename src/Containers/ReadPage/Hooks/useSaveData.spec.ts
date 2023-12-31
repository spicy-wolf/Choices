/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { describe, expect, test } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useSaveData } from './useSaveData';
import * as Database from '@src/Database';
import * as DbContext from '@src/Context/DbContext';
import * as Utils from '@src/Utils';

describe('test useSaveData hook', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should not load save data when metadataId is missing', async () => {
    // arrange
    const _dbContext: Database.AbstractDbContext = new Database.DbContext();
    _dbContext.getAllSaveDataFromMetadataId = jest.fn();
    _dbContext.addSaveData = jest.fn();
    jest.spyOn(DbContext, 'useDbContext').mockReturnValue({
      dbContext: _dbContext
    });

    // act
    const { result } = renderHook(() => useSaveData(null));

    // asset
    expect(_dbContext.getAllSaveDataFromMetadataId).not.toBeCalled();
    expect(_dbContext.addSaveData).not.toBeCalled();
    expect(result.current[0].defaultSaveData).toBeUndefined();
  });

  test('should create a default savedata when first time load matadataid', async () => {
    // arrange
    const metadataId = 'metadataid';
    const _dbContext: Database.AbstractDbContext = new Database.DbContext();
    _dbContext.getAllSaveDataFromMetadataId = jest.fn().mockReturnValue([]);
    _dbContext.addSaveData = jest.fn().mockReturnValue('default-save-data-id');
    jest.spyOn(DbContext, 'useDbContext').mockReturnValue({
      dbContext: _dbContext
    });

    // act
    const { result } = renderHook(() => useSaveData(metadataId));
    await waitFor(() => expect(result.current?.[0]?.defaultSaveData).toBeDefined());

    // asset
    expect(_dbContext.getAllSaveDataFromMetadataId).toBeCalledWith(metadataId);
    expect(_dbContext.addSaveData).toBeCalledTimes(1);
    expect(result.current[0].defaultSaveData?.metadataId).toEqual(metadataId);
    expect(result.current[0].defaultSaveData?.id).toEqual('default-save-data-id');
    expect(result.current[0].defaultSaveData?.saveDataType).toEqual('default');
  });

  test('should load the default savedata when load matadataid', async () => {
    // arrange
    const metadataId = 'metadataid';
    const _dbContext: Database.AbstractDbContext = new Database.DbContext();
    const defaultSaveData = {
      id: 'saveDataId',
      metadataId: metadataId,
      description: '',
      createTimestamp: Date.now(),
      saveDataType: 'default',
      scriptCursorPos: 'scriptCursorPos',
      logCursorPos: 0,
      context: {},
      readLogs: [],
    } as Database.Types.SaveDataType;
    _dbContext.getAllSaveDataFromMetadataId = jest.fn().mockReturnValue([
      defaultSaveData
    ]);
    _dbContext.getSaveDataFromId = jest.fn().mockReturnValue(defaultSaveData);
    jest.spyOn(DbContext, 'useDbContext').mockReturnValue({
      dbContext: _dbContext
    });

    // act
    const { result } = renderHook(() => useSaveData(metadataId));
    await waitFor(() => expect(result.current?.[0]?.defaultSaveData).toBeDefined());

    // asset
    expect(_dbContext.getAllSaveDataFromMetadataId).toBeCalledWith(metadataId);
    expect(_dbContext.getSaveDataFromId).toBeCalledWith(defaultSaveData.id);
    expect(result.current[0].defaultSaveData).toEqual(defaultSaveData);
  });

  test('should update default save data when default save data changes', async () => {
    // arrange
    jest.useFakeTimers();

    const metadataId = 'metadataid';
    const _dbContext: Database.AbstractDbContext = new Database.DbContext();
    const defaultSaveData = {
      id: 'saveDataId',
      metadataId: metadataId,
      description: '',
      createTimestamp: Date.now(),
      saveDataType: 'default',
      scriptCursorPos: 'scriptCursorPos#1',
      logCursorPos: 0,
      context: {},
      readLogs: [],
    } as Database.Types.SaveDataType;
    const newDefaultSaveData = {
      ...defaultSaveData,
      scriptCursorPos: 'scriptCursorPos#2',
      logCursorPos: 100,
    };
    _dbContext.getAllSaveDataFromMetadataId = jest.fn().mockReturnValue([
      defaultSaveData
    ]);
    _dbContext.putSaveData = jest.fn();
    _dbContext.getSaveDataFromId = jest.fn().mockReturnValue(defaultSaveData);
    jest.spyOn(DbContext, 'useDbContext').mockReturnValue({
      dbContext: _dbContext
    });

    // act
    const { result } = renderHook(() => useSaveData(metadataId));
    await waitFor(() => expect(result.current?.[0]?.defaultSaveData).toBeDefined());

    act(() => result.current[0].setDefaultSaveData(newDefaultSaveData));
    await act(async () => jest.runAllTimers()); // as the useDebounce is used // debounce will trigger await calls

    // asset
    expect(result.current[0].defaultSaveData).toEqual(newDefaultSaveData);
    expect(_dbContext.putSaveData).toBeCalledWith(newDefaultSaveData);
  });

  test('should add save data (copy from default save data) when create new save data', async () => {
    // arrange
    const metadataId = 'metadataid';
    const _dbContext: Database.AbstractDbContext = new Database.DbContext();
    const defaultSaveData = {
      id: 'saveDataId',
      metadataId: metadataId,
      description: '',
      createTimestamp: (new Date('2023-01-01')).valueOf(),
      saveDataType: 'default',
      scriptCursorPos: 'scriptCursorPos#1',
      logCursorPos: 0,
      context: {},
      readLogs: [
        {
          saveDataId: 'saveDataId'
        }
      ],
    } as Database.Types.SaveDataType;
    _dbContext.getAllSaveDataFromMetadataId = jest.fn().mockReturnValue([
      defaultSaveData
    ]);
    _dbContext.putSaveData = jest.fn();
    _dbContext.addSaveData = jest.fn();
    _dbContext.getSaveDataFromId = jest.fn().mockReturnValue(defaultSaveData);
    jest.spyOn(DbContext, 'useDbContext').mockReturnValue({
      dbContext: _dbContext
    });
    jest.spyOn(Utils, 'generateId').mockReturnValue('new-save-data-id');
    jest.spyOn(Date, 'now').mockReturnValue(1700956800000);

    // act
    const { result } = renderHook(() => useSaveData(metadataId));
    await waitFor(() => expect(result.current?.[0]?.defaultSaveData).toBeDefined());

    await act(async () => {
      await result.current[0].createSaveData('save data description');
    });

    // asset
    // expect(result.current[0].saveDataList.length).toEqual(2);
    expect(_dbContext.addSaveData).toBeCalledWith({
      ...defaultSaveData,
      id: 'new-save-data-id',
      createTimestamp: 1700956800000,
      saveDataType: 'manual',
      description: 'save data description',
      readLogs: [
        {
          saveDataId: 'new-save-data-id'
        }
      ]
    });
  });

  test.skip('should load save data (copy from selected save data) when load a save data', async () => {
    // TODO: implement me
  });

  test.skip('should delete save data when delete a save data', async () => {
    // TODO: implement me
  });
});
