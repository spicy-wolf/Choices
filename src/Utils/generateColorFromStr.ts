/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

export const generateColorFromStr = (str: string) => {
  const strPad = str.padStart(32, ' ');
  let hash: number = 0;
  for (const char of strPad) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
};

