/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { describe, expect, test } from '@jest/globals';
import { AnyComponentType } from '../Types';
import { getLastReadLogOrder } from './getLastReadLogOrder';

describe('test getLastReadLogOrder function', () => {
  const dataSet: [AnyComponentType[][], number][] = [
    [null, null],
    [
      [
        [
          { order: 0, type: 'eol', sourceStatementId: '' },
          { order: 1, type: 'eol', sourceStatementId: '' },
        ],
      ],
      1,
    ],
    [
      [
        [{ order: 0, type: 'eol', sourceStatementId: '' }],
        [{ order: 1, type: 'eol', sourceStatementId: '' }],
      ],
      1,
    ],
    [
      [
        [
          { order: 0, type: 'eol', sourceStatementId: '' },
          { order: null, type: 'eol', sourceStatementId: '' },
        ],
      ],
      0,
    ],
    [
      [
        [{ order: 0, type: 'eol', sourceStatementId: '' }],
        [{ order: null, type: 'eol', sourceStatementId: '' }],
      ],
      0,
    ],
    [[[{ order: 0, type: 'eol', sourceStatementId: '' }, null]], 0],
    [[[{ order: 0, type: 'eol', sourceStatementId: '' }], [null]], 0],
  ];

  test.each(dataSet)(
    'get last readLog order %o, expected %d',
    (input: AnyComponentType[][], expected: number) => {
      const result = getLastReadLogOrder(input);

      expect(result).toEqual(expected);
    }
  );
});

