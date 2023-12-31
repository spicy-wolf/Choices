/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { Types } from '@src/StatementEngine';

export type ScriptType = (Types.AnyStatementType & {
  metadataId: string;
})[];

