import { AnyComponentType } from '../Types';

export const getLastReadLogOrder = (
  readingLogs: AnyComponentType[][]
): number => {
  let order = null;
  if (!readingLogs || readingLogs.length === 0) return order;

  // if (readingLogs?.length > 0) {
  //   const lastReadingLog = readingLogs?.at(-1)?.at(-1);
  //   order = lastReadingLog.order;
  // }

  for (let i = readingLogs?.length - 1; i >= 0; i--) {
    if (!readingLogs?.[i]) continue;

    for (let j = readingLogs[i]?.length - 1; j >= 0; j--) {
      if (
        readingLogs[i][j]?.order === null ||
        readingLogs[i][j]?.order === undefined ||
        isNaN(readingLogs[i][j]?.order)
      ) {
        continue;
      } else {
        order = readingLogs[i][j]?.order;
        return order;
      }
    }
  }
};
