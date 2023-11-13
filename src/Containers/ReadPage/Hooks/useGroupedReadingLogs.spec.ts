import { describe, expect, test } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useGroupedReadingLogs } from './useGroupedReadingLogs';
import * as StatementEngine from '@src/StatementEngine';

type AnyComponentType = StatementEngine.Types.AnyComponentType;

describe('test useGroupedReadingLogs hook', () => {
  const dataSet: [AnyComponentType[], AnyComponentType[][]][] = [
    [null, []],
    [[], []],
    [
      [{ order: 0, type: 'eol', sourceStatementId: '' }],
      [[{ order: 0, type: 'eol', sourceStatementId: '' }]],
    ],
    [
      [
        { order: 0, type: 'eol', sourceStatementId: '' },
        { order: 1, type: 'eol', sourceStatementId: '' },
      ],
      [
        [{ order: 0, type: 'eol', sourceStatementId: '' }],
        [{ order: 1, type: 'eol', sourceStatementId: '' }],
      ],
    ],
    [
      [
        { order: 0, type: 's', sourceStatementId: '', data: 'a' },
        { order: 1, type: 's', sourceStatementId: '', data: 'a' },
      ],
      [
        [
          { order: 0, type: 's', sourceStatementId: '', data: 'a' },
          { order: 1, type: 's', sourceStatementId: '', data: 'a' },
        ],
      ],
    ],
    [
      [
        { order: 0, type: 's', sourceStatementId: '', data: 'a' },
        { order: 1, type: 'eol', sourceStatementId: '' },
        { order: 2, type: 's', sourceStatementId: '', data: 'a' },
      ],
      [
        [{ order: 0, type: 's', sourceStatementId: '', data: 'a' }],
        [{ order: 1, type: 'eol', sourceStatementId: '' }],
        [{ order: 2, type: 's', sourceStatementId: '', data: 'a' }],
      ],
    ],
  ];
  test.each(dataSet)('test convert reading log %o to %o', (input, expected) => {
    const { result } = renderHook(() => useGroupedReadingLogs(input));
    expect(result.current.groupedReadingLogs).toEqual(expected);
  });
});
