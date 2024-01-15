/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
import '@testing-library/jest-dom';
import { describe, test } from '@jest/globals';
import * as Database from '@src/Database';
import { render } from '@testing-library/react';
import { SaveAndLoad } from './SaveAndLoad';
import * as AddSaveDataCard from './AddSaveDataCard';
import * as SaveDataItem from './SaveDataItem';

describe('test SaveAndLoad', () => {
  const mockAddSaveDataCardComponent = jest.fn();
  const mockSaveDataItemComponent = jest.fn();

  beforeEach(() => {
    jest.spyOn(AddSaveDataCard, 'AddSaveDataCard').mockImplementation(mockAddSaveDataCardComponent);
    jest.spyOn(SaveDataItem, 'SaveDataItem').mockImplementation(mockSaveDataItemComponent);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should render no item when init with empty list', async () => {
    // arrange
    const defaultSaveData = {} as Database.Types.SaveDataType;
    const loadSaveData = jest.fn();
    const createSaveData = jest.fn();
    const deleteSaveData = jest.fn();
    const saveDataList: Database.Types.SaveDataType[] = [];
    const setLoadingMsg = jest.fn();

    // act
    const { findByText } = render(<SaveAndLoad
      defaultSaveData={defaultSaveData}
      loadSaveData={loadSaveData}
      createSaveData={createSaveData}
      deleteSaveData={deleteSaveData}
      saveDataList={saveDataList}
      setLoadingMsg={setLoadingMsg}
    />);

    // asset
    expect(await findByText('saveAndLoad.label')).toBeInTheDocument();
    expect(mockSaveDataItemComponent).toHaveBeenCalledTimes(0);
    expect(mockAddSaveDataCardComponent).toHaveBeenCalledTimes(1);
    expect(mockAddSaveDataCardComponent.mock.calls[0][0]).toEqual({
      defaultSaveData: defaultSaveData,
      createSaveData: createSaveData
    });
  });

  test('should not render default save data when give a list', async () => {
    // arrange
    const defaultSaveData = {} as Database.Types.SaveDataType;
    const loadSaveData = jest.fn();
    const createSaveData = jest.fn();
    const deleteSaveData = jest.fn();
    const saveDataList: Database.Types.SaveDataType[] = [{
      id: 'saveDataId',
      metadataId: 'metadataId',
      description: '',
      createTimestamp: Date.now(),
      saveDataType: 'default',
      statementCursorPos: 'statementCursorPos',
      logCursorPos: 0,
      context: {},
      readLogs: [],
    }];
    const setLoadingMsg = jest.fn();

    // act
    const { findByText } = render(<SaveAndLoad
      defaultSaveData={defaultSaveData}
      loadSaveData={loadSaveData}
      createSaveData={createSaveData}
      deleteSaveData={deleteSaveData}
      saveDataList={saveDataList}
      setLoadingMsg={setLoadingMsg}
    />);

    // asset
    expect(await findByText('saveAndLoad.label')).toBeInTheDocument();
    expect(mockSaveDataItemComponent).toHaveBeenCalledTimes(0);
    expect(mockAddSaveDataCardComponent).toHaveBeenCalledTimes(1);
  });

  test('should render 2 item in desc order when give a list', async () => {
    // arrange
    const defaultSaveData = {} as Database.Types.SaveDataType;
    const loadSaveData = jest.fn();
    const createSaveData = jest.fn();
    const deleteSaveData = jest.fn();
    const saveDataList: Database.Types.SaveDataType[] = [{
      id: 'saveDataId#1',
      metadataId: 'metadataId',
      description: 'description',
      createTimestamp: 0,
      saveDataType: 'manual',
      statementCursorPos: 'statementCursorPos',
      logCursorPos: 0,
      context: {},
      readLogs: [],
    }, {
      id: 'saveDataId#2',
      metadataId: 'metadataId',
      description: 'description',
      createTimestamp: 1,
      saveDataType: 'manual',
      statementCursorPos: 'statementCursorPos',
      logCursorPos: 0,
      context: {},
      readLogs: [],
    }];
    const setLoadingMsg = jest.fn();

    // act
    const { findByText } = render(<SaveAndLoad
      defaultSaveData={defaultSaveData}
      loadSaveData={loadSaveData}
      createSaveData={createSaveData}
      deleteSaveData={deleteSaveData}
      saveDataList={saveDataList}
      setLoadingMsg={setLoadingMsg}
    />);

    // asset
    expect(await findByText('saveAndLoad.label')).toBeInTheDocument();
    expect(mockSaveDataItemComponent).toHaveBeenCalledTimes(2);

    // first call will have the newer save data
    expect(mockSaveDataItemComponent.mock.calls[0][0]).toEqual({
      saveData: saveDataList[1],
      deleteSaveData: deleteSaveData,
      loadSaveData: loadSaveData
    });
    // second call will have the older save data
    expect(mockSaveDataItemComponent.mock.calls[1][0]).toEqual({
      saveData: saveDataList[0],
      deleteSaveData: deleteSaveData,
      loadSaveData: loadSaveData
    });
    expect(mockAddSaveDataCardComponent).toHaveBeenCalledTimes(1);
  });
});
