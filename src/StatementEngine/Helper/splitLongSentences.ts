export const splitLongSentences = (
  sentence: string | number,
  maxLength: number = 30
) => {
  const result: string[] = [];
  if (sentence === null || sentence === undefined || sentence === '')
    return [''];

  const regex = new RegExp('.{1,' + maxLength + '}', 'g');
  let shorterSentences = sentence.toString().match(regex);
  for (let ss of shorterSentences) {
    result.push(ss ?? '');
  }

  return result;
};
