/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { nanoid } from 'nanoid';

export const generateId = (size: number = 10) => {
  // Nano ID Collision https://zelark.github.io/nano-id-cc/
  return nanoid(size);
};

