import { useEffect, useState } from 'react';
import * as StatementEngine from '@src/StatementEngine';

type AnyComponentType = StatementEngine.Types.AnyComponentType;
export const useGroupedReadingLogs = (readingLogs: AnyComponentType[]) => {
  const [groupedReadingLogs, setGroupedReadingLogs] = useState<
    AnyComponentType[][]
  >([]);

  useEffect(() => {
    if (!readingLogs || readingLogs.length === 0) {
      setGroupedReadingLogs([]);
      return;
    }

    let newGroupedReadingLogs = [...groupedReadingLogs];
    const lastReadingLogOrder =
      StatementEngine.getLastReadLogOrder(groupedReadingLogs);
    let index = 0;
    if (lastReadingLogOrder !== null && lastReadingLogOrder !== undefined) {
      const nextReadingLogOrder = lastReadingLogOrder + 1;
      index = readingLogs.findIndex(
        (readingLog) => readingLog.order === nextReadingLogOrder
      );
      if (index === -1) return;
    }

    for (; index < readingLogs.length; index++) {
      const lastGroup = newGroupedReadingLogs.at(-1);
      // edge case, if no last group
      if (!lastGroup) {
        newGroupedReadingLogs.push([readingLogs[index]]);
        continue;
      }

      const lastReadingLog = lastGroup.at(-1);
      if (
        StatementEngine.CheckStatementType.isSentence(lastReadingLog) &&
        StatementEngine.CheckStatementType.isSentence(readingLogs[index])
      ) {
        newGroupedReadingLogs[newGroupedReadingLogs.length - 1] = [
          ...newGroupedReadingLogs[newGroupedReadingLogs.length - 1],
          readingLogs[index],
        ];
      } else {
        newGroupedReadingLogs.push([readingLogs[index]]);
      }
    }

    setGroupedReadingLogs(newGroupedReadingLogs);
  }, [readingLogs]);

  return { groupedReadingLogs };
};
