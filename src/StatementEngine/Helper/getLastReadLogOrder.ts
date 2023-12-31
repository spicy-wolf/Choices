/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { AnyComponentType } from '../Types';

export const getLastReadLogOrder = (readLogs: AnyComponentType[][]): number => {
  let order = null;
  if (!readLogs || readLogs.length === 0) return order;

  for (let i = readLogs?.length - 1; i >= 0; i--) {
    if (!readLogs?.[i]) continue;

    for (let j = readLogs[i]?.length - 1; j >= 0; j--) {
      if (
        readLogs[i][j]?.order === null ||
        readLogs[i][j]?.order === undefined ||
        isNaN(readLogs[i][j]?.order)
      ) {
        continue;
      } else {
        order = readLogs[i][j]?.order;
        return order;
      }
    }
  }
};

