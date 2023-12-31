/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

export type AbstractStatementType = {
  id: string;
  order: number;
  type: string;
  condition?: unknown;
};

export type AbstractComponentType = {
  sourceStatementId: string;
  /**
   * Note: the order value is init to null, then it will be assigned in addReadLog func
   */
  order: number | null;
  type: string;
};

