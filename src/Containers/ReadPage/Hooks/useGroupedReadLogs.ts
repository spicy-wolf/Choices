/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { useEffect, useState } from 'react';
import * as StatementEngine from '@src/StatementEngine';

type AnyComponentType = StatementEngine.Types.AnyComponentType;
export const useGroupedReadLogs = (readLogs: AnyComponentType[]) => {
  const [groupedReadLogs, setGroupedReadLogs] = useState<AnyComponentType[][]>(
    null
  );

  useEffect(() => {
    if (!readLogs || readLogs.length === 0) {
      setGroupedReadLogs([]);
      return;
    }

    const newGroupedReadLogs = groupedReadLogs ? [...groupedReadLogs] : [];
    const lastReadLogOrder =
      StatementEngine.getLastReadLogOrder(groupedReadLogs);
    let index = 0;
    if (lastReadLogOrder !== null && lastReadLogOrder !== undefined) {
      const nextReadLogOrder = lastReadLogOrder + 1;
      index = readLogs.findIndex(
        (readLog) => readLog.order === nextReadLogOrder
      );
      if (index === -1) return;
    }

    for (; index < readLogs.length; index++) {
      const lastGroup = newGroupedReadLogs.at(-1);
      // edge case, if no last group
      if (!lastGroup) {
        newGroupedReadLogs.push([readLogs[index]]);
        continue;
      }

      const lastReadLog = lastGroup.at(-1);
      if (
        StatementEngine.CheckStatementType.isSentence(lastReadLog) &&
        StatementEngine.CheckStatementType.isSentence(readLogs[index])
      ) {
        newGroupedReadLogs[newGroupedReadLogs.length - 1] = [
          ...newGroupedReadLogs[newGroupedReadLogs.length - 1],
          readLogs[index],
        ];
      } else {
        newGroupedReadLogs.push([readLogs[index]]);
      }
    }

    setGroupedReadLogs(newGroupedReadLogs);
  }, [readLogs]);

  return { groupedReadLogs };
};

