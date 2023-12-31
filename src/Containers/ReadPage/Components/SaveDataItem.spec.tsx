import React from 'react';
import '@testing-library/jest-dom';
import { describe, test } from '@jest/globals';
import * as Database from '@src/Database';
import { act, fireEvent, render } from '@testing-library/react';
import { SaveDataItem } from './SaveDataItem';

describe('test SaveDataItem', () => {

  jest.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US');
  const saveData: Database.Types.SaveDataType = {
    id: 'saveDataId',
    metadataId: 'metadataId',
    description: 'this is description',
    saveDataType: 'manual',
    createTimestamp: 1654405690298, // UTC => 06/05/2022, 05:08:10
    scriptCursorPos: '',
    logCursorPos: 0,
    context: {},
    readLogs: [],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render with date and description when give save data', async () => {
    // arrange

    // act
    const { findByText } = render(<SaveDataItem
      saveData={saveData}
      deleteSaveData={jest.fn()}
      loadSaveData={jest.fn()}
    />);

    // asset
    expect(await findByText(saveData.description)).toBeInTheDocument();
    expect(await findByText('06/05/2022, 05:08:10')).toBeInTheDocument();
  });

  test('should call loadSaveData when load save data', async () => {
    // arrange
    const deleteSaveData = jest.fn();
    const loadSaveData = jest.fn();

    // act
    const { findByText } = render(<SaveDataItem
      saveData={saveData}
      deleteSaveData={deleteSaveData}
      loadSaveData={loadSaveData}
    />);

    // asset
    fireEvent.click(await findByText(saveData.description));
    await act(async () => { // wrap in an act as the loadSaveData function is async
      fireEvent.click(await findByText('yesNoModal.confirmBtn.label'));
    });

    // arrange
    expect(loadSaveData).toHaveBeenCalledTimes(1);
    expect(deleteSaveData).not.toHaveBeenCalled();
  });

  test('should call deleteSaveData when delete save data', async () => {
    // arrange
    const deleteSaveData = jest.fn();
    const loadSaveData = jest.fn();

    // act
    const { findByText, findByTestId } = render(<SaveDataItem
      saveData={saveData}
      deleteSaveData={deleteSaveData}
      loadSaveData={loadSaveData}
    />);

    // asset
    fireEvent.click(await findByTestId('save-data-item.hamburger-menu'));
    fireEvent.click(await findByText('saveAndLoad.deleteBtn.label'));
    await act(async () => { // wrap in an act as the loadSaveData function is async
      fireEvent.click(await findByText('yesNoModal.confirmBtn.label'));
    });

    // arrange
    expect(deleteSaveData).toHaveBeenCalledTimes(1);
    expect(loadSaveData).not.toHaveBeenCalled();
  });
});