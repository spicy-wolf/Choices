/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
import { describe, test } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as Database from '@src/Database';
import { AddSaveDataCard } from './AddSaveDataCard';
import '@testing-library/jest-dom';

describe('test AddSaveDataCard', () => {
  test('should disable add button when init with null defaultSaveData', async () => {
    // arrange
    const defaultSaveData: Database.Types.SaveDataType = null;
    const createSaveData = jest.fn();

    // act
    const { findByText } = render(<AddSaveDataCard
      defaultSaveData={defaultSaveData}
      createSaveData={createSaveData}
    />);

    // asset
    const button = await findByText('saveAndLoad.saveNewBtn.label');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test('should render add button when init with a defaultSaveData', async () => {
    // arrange
    const defaultSaveData: Database.Types.SaveDataType = {
      id: 'saveDataId',
      metadataId: 'metadataId',
      description: '',
      createTimestamp: Date.now(),
      saveDataType: 'default',
      scriptCursorPos: 'scriptCursorPos#1',
      logCursorPos: 0,
      context: {},
      readLogs: [],
    };
    const createSaveData = jest.fn();

    // act
    const { findByText } = render(<AddSaveDataCard
      defaultSaveData={defaultSaveData}
      createSaveData={createSaveData}
    />);

    // asset
    const button = await findByText('saveAndLoad.saveNewBtn.label');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('should show description input box with empty value when click add button and no read logs', async () => {
    // arrange
    const defaultSaveData: Database.Types.SaveDataType = {
      id: 'saveDataId',
      metadataId: 'metadataId',
      description: '',
      createTimestamp: Date.now(),
      saveDataType: 'default',
      scriptCursorPos: 'scriptCursorPos#1',
      logCursorPos: 0,
      context: {},
      readLogs: [],
    };
    const createSaveData = jest.fn();

    // act
    const { findByText, findByLabelText } = render(<AddSaveDataCard
      defaultSaveData={defaultSaveData}
      createSaveData={createSaveData}
    />);
    fireEvent.click(await findByText('saveAndLoad.saveNewBtn.label'));

    // asset
    expect(await findByLabelText('saveAndLoad.saveDescriptionInput.label')).toBeInTheDocument();
    expect(await findByLabelText('saveAndLoad.saveDescriptionInput.label')).toHaveValue('');
    expect(await findByText('saveAndLoad.saveConfirmBtn.label')).toBeInTheDocument();
    expect(await findByText('saveAndLoad.saveCancelBtn.label')).toBeInTheDocument();
  });

  test('should back to show add button when click cancel button', async () => {
    // arrange
    const defaultSaveData: Database.Types.SaveDataType = {
      id: 'saveDataId',
      metadataId: 'metadataId',
      description: '',
      createTimestamp: Date.now(),
      saveDataType: 'default',
      scriptCursorPos: 'scriptCursorPos#1',
      logCursorPos: 0,
      context: {},
      readLogs: [],
    };
    const createSaveData = jest.fn();

    // act
    const { findByText } = render(<AddSaveDataCard
      defaultSaveData={defaultSaveData}
      createSaveData={createSaveData}
    />);
    fireEvent.click(await findByText('saveAndLoad.saveNewBtn.label'));
    fireEvent.click(await findByText('saveAndLoad.saveCancelBtn.label'));

    // asset
    expect(await findByText('saveAndLoad.saveNewBtn.label')).toBeInTheDocument();
  });

  test('should show description input box with string value when click add button and some read logs', async () => {
    // arrange
    const defaultSaveData: Database.Types.SaveDataType = {
      id: 'saveDataId',
      metadataId: 'metadataId',
      description: '',
      createTimestamp: Date.now(),
      saveDataType: 'default',
      scriptCursorPos: 'scriptCursorPos#1',
      logCursorPos: 0,
      context: {},
      readLogs: [
        {
          sourceStatementId: 'Qe53o_g4z_',
          order: 0,
          type: 's',
          data: 'This is a sentence #1.'
        },
        {
          sourceStatementId: 'VSQEcaHxUY',
          order: 1,
          type: 's',
          data: 'This is a sentence #2.'
        }
      ],
    } as Database.Types.SaveDataType;
    const createSaveData = jest.fn();

    // act
    const { findByText, findByLabelText } = render(<AddSaveDataCard
      defaultSaveData={defaultSaveData}
      createSaveData={createSaveData}
    />);
    fireEvent.click(await findByText('saveAndLoad.saveNewBtn.label'));

    // asset
    expect(await findByLabelText('saveAndLoad.saveDescriptionInput.label')).toBeInTheDocument();
    expect(await findByLabelText('saveAndLoad.saveDescriptionInput.label')).toHaveValue('This is a sentence #1.This is a sentence #2.');
    expect(await findByText('saveAndLoad.saveConfirmBtn.label')).toBeInTheDocument();
    expect(await findByText('saveAndLoad.saveCancelBtn.label')).toBeInTheDocument();
  });

  test('should call createSaveData with string value when click add button and some read logs', async () => {
    // arrange
    const defaultSaveData: Database.Types.SaveDataType = {
      id: 'saveDataId',
      metadataId: 'metadataId',
      description: '',
      createTimestamp: Date.now(),
      saveDataType: 'default',
      scriptCursorPos: 'scriptCursorPos#1',
      logCursorPos: 0,
      context: {},
      readLogs: [
        {
          sourceStatementId: 'Qe53o_g4z_',
          order: 0,
          type: 's',
          data: 'This is a sentence #1.'
        },
        {
          sourceStatementId: 'VSQEcaHxUY',
          order: 1,
          type: 's',
          data: 'This is a sentence #2.'
        }
      ],
    } as Database.Types.SaveDataType;
    const createSaveData = jest.fn();

    // act
    const { findByText } = render(<AddSaveDataCard
      defaultSaveData={defaultSaveData}
      createSaveData={createSaveData}
    />);
    fireEvent.click(await findByText('saveAndLoad.saveNewBtn.label'));
    await act(async () => {
      // need wrap in async act because the addManualSaveData is async function
      fireEvent.click(await findByText('saveAndLoad.saveConfirmBtn.label'));
    });

    // asset
    expect(createSaveData).toHaveBeenCalledWith('This is a sentence #1.This is a sentence #2.');
  });
});
