/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

export const splitLongSentences = (
  sentence: string | number,
  maxLength: number = 30
) => {
  const result: string[] = [];
  if (sentence === null || sentence === undefined || sentence === '')
    return [''];

  const regex = new RegExp('.{1,' + maxLength + '}', 'g');
  const shorterSentences = sentence.toString().match(regex);
  for (const ss of shorterSentences) {
    result.push(ss ?? '');
  }

  return result;
};

