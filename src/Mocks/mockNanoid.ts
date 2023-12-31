/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

jest.mock('nanoid', () => {
  const incrementGenerator = () => {
    let n = 1000000000;

    return function () {
      n++;
      return n.toString();
    };
  };
  return { nanoid: incrementGenerator() };
});

