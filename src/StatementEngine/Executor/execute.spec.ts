import { describe, expect, test } from '@jest/globals';
import { execute } from './execute';
import { CheckStatementType } from '../Helper';
import * as ExecuteEndOfLine from './executeEndOfLine';
import * as ExecuteFin from './executeFin';
import * as ExecuteParagraph from './executeParagraph';
import * as ExecuteSentence from './executeSentence';
import * as ExecuteJump from './executeJump';
import type { AnyStatementType } from '../Types';

describe('test execute function', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should immediately return when giving null statement', () => {
    const mockCheckStatementType = jest.spyOn(CheckStatementType, 'isEndOfLine').mockReturnValue(false);
    execute(null, null);
    expect(mockCheckStatementType).not.toBeCalled();
  });

  const dataSet = [
    { name: 'end of line', checkerMock: jest.spyOn(CheckStatementType, 'isEndOfLine'), executorMock: jest.spyOn(ExecuteEndOfLine, 'executeEndOfLine') },
    { name: 'fin', checkerMock: jest.spyOn(CheckStatementType, 'isFin'), executorMock: jest.spyOn(ExecuteFin, 'executeFin') },
    { name: 'paragraph', checkerMock: jest.spyOn(CheckStatementType, 'isParagraph'), executorMock: jest.spyOn(ExecuteParagraph, 'executeParagraph') },
    { name: 'sentence', checkerMock: jest.spyOn(CheckStatementType, 'isSentence'), executorMock: jest.spyOn(ExecuteSentence, 'executeSentence') },
    { name: 'jump', checkerMock: jest.spyOn(CheckStatementType, 'isJump'), executorMock: jest.spyOn(ExecuteJump, 'executeJump') },
  ];

  test.each(dataSet)('should execute $name return when giving $name statement', (arg) => {
    arg.checkerMock.mockReturnValue(true);
    execute({} as AnyStatementType, null);
    expect(arg.executorMock).toBeCalledTimes(1);
  });
});
