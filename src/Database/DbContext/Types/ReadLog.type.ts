/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

export type ReadLogType = {
  saveDataId?: string; // TODO: remove me
  timestamp?: number; // timestamp cannot be used as order due to collision
  sourceStatementId: string;
  order: number;
  type: string;
  [key: string]: unknown; // extra data
};

