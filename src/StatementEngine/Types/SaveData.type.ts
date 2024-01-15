/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { BaseComponentType } from './BaseComponent.type';

export type SaveDataType = {
  statementCursorPos: string;
  logCursorPos: number;
  context: { [key: string]: unknown };
  readLogs?: (BaseComponentType & { [key: string]: unknown })[];
};

