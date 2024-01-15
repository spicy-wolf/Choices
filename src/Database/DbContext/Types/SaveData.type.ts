/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { ReadLogType } from './ReadLog.type';
import { SaveDataContext } from './SaveDataContext.type';

export type SaveDataType = {
  id?: string;
  metadataId?: string; // parent id
  description: string; // a short description for this piece of savedata
  createTimestamp: number;
  saveDataType: 'default' | 'manual';

  statementCursorPos: string;
  logCursorPos: number;

  context: SaveDataContext;
  readLogs?: ReadLogType[];
};

