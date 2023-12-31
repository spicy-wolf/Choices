/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

export type BaseStatementType = {
  id: string;
  order: number;
  type: string;
  condition?: unknown;
};

