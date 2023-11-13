import { describe, expect, test } from '@jest/globals';
import { splitLongSentences } from './splitLongSentences';

describe('test splitLongSentences function', () => {
  const dataSet: [string | number, number, string[]][] = [
    [null, 1, ['']],
    ['', 1, ['']],
    ['a', 1, ['a']],
    ['abc', 1, ['a', 'b', 'c']],
    [1, 1, ['1']],
    [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam orci quam, suscipit eget dignissim id, sollicitudin quis arcu. Donec ullamcorper consequat lectus sit amet vulputate.',
      30,
      [
        'Lorem ipsum dolor sit amet, co',
        'nsectetur adipiscing elit. Nam',
        ' orci quam, suscipit eget dign',
        'issim id, sollicitudin quis ar',
        'cu. Donec ullamcorper consequa',
        't lectus sit amet vulputate.',
      ],
    ],
  ];

  test.each(dataSet)(
    'split long sentences %s with max length: %d, expected %o',
    (input: string, maxLength: number, expected: string[]) => {
      const result = splitLongSentences(input, maxLength);

      expect(result).toEqual(expected);
    }
  );
});
