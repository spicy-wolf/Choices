/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import * as Types from '../Types';
import { IndexedDbContext } from './IndexedDbContext';
import 'fake-indexeddb/auto';
import * as digestString from '@src/Utils/digestString';
import { IDBFactory } from 'fake-indexeddb';

const initMetadata: Types.RepoMetadataType = {
  id: '',
  author: 'Spicy Wolf',
  repoName: 'im repo name',
  description: 'im description',
};

const initStatements: Types.StatementType[] = [
  {
    id: '7bc98165-91ce-42a0-a126-e0ff16648f4b',
    metadataId: '',
    order: 0,
    type: 's',
    data: 'test data #1',
  },
  {
    id: '2d30d7c9-63d8-4254-aa48-59feb69f17d1',
    order: 1,
    metadataId: '',
    type: 'eol',
  },
  {
    id: '9b02c2bb-041b-4901-b874-4ca5a4236873',
    order: 2,
    metadataId: '',
    type: 'end',
  },
];

const altMetadata: Types.RepoMetadataType = {
  id: '',
  author: initMetadata.author,
  repoName: initMetadata.repoName,
  description: 'im description Alt',
};

const altStatements: Types.StatementType[] = [
  {
    id: '7bc98165-91ce-42a0-a126-e0ff16648f4b',
    metadataId: '',
    order: 0,
    type: 's',
    data: 'test data #1',
  },
  {
    id: '1554beff-faa8-4bd9-8721-ba0d9e06a936',
    metadataId: '',
    order: 1,
    type: 's',
    data: 'test data #2',
  },
  {
    id: '2d30d7c9-63d8-4254-aa48-59feb69f17d1',
    metadataId: '',
    order: 2,
    type: 'eol',
  },
  {
    id: '9b02c2bb-041b-4901-b874-4ca5a4236873',
    metadataId: '',
    order: 3,
    type: 'end',
  },
];

const initSaveData: Types.SaveDataType = {
  id: '',
  metadataId: 'dummy metadata id',
  description: '', // auto saved data
  saveDataType: 'default',
  createTimestamp: 1654405690298,

  statementCursorPos: '',
  logCursorPos: 0,

  context: {},
  readLogs: [],
};

describe('indexed db test', () => {
  let dbContext: IndexedDbContext = null;
  beforeAll(() => {
    const spy = jest.spyOn(digestString, 'digestString');
    spy.mockImplementation((str) => Promise.resolve(str));
  });
  beforeEach(async () => {
    global.indexedDB = new IDBFactory();
    dbContext = new IndexedDbContext();
    await dbContext.init();
  });
  describe('test metadata', () => {
    test('test metadata add and get', async () => {
      // test add
      const metadataId = await dbContext.addMetadata(initMetadata, initStatements);
      expect(metadataId?.length).toBeGreaterThan(0);

      // test get
      const allMetadata = await dbContext.getAllMetadata();
      expect(allMetadata?.length).toEqual(1);
      expect(allMetadata[0]).toEqual({ ...initMetadata, id: metadataId });

      const metadata = await dbContext.getMetadata(
        initMetadata.author,
        initMetadata.repoName
      );
      expect(metadata).toBeDefined();
      expect(metadata).toEqual({ ...initMetadata, id: metadataId });

      // test get statement
      const statement = await dbContext.getStatementsFromMetadataId(metadataId);
      expect(statement?.length).toEqual(initStatements.length);
      statement.forEach((statement, index) => {
        expect(statement.metadataId).toEqual(metadataId);
        expect(statement.order).toEqual(index);
      });
    });

    test('test metadata put and get', async () => {
      // prepare add
      const metadataId = await dbContext.addMetadata(initMetadata, initStatements);
      // test put
      await dbContext.putMetadata(altMetadata, altStatements);

      // test get
      const allMetadata = await dbContext.getAllMetadata();
      expect(allMetadata?.length).toEqual(1);
      expect(allMetadata[0]).toEqual({ ...altMetadata, id: metadataId });

      const metadata = await dbContext.getMetadata(
        altMetadata.author,
        altMetadata.repoName
      );
      expect(metadata).toBeDefined();
      expect(metadata).toEqual({ ...altMetadata, id: metadataId });

      // test get statement
      const statement = await dbContext.getStatementsFromMetadataId(metadataId);
      expect(statement?.length).toEqual(altStatements.length);
      statement.forEach((statement, index) => {
        expect(statement.metadataId).toEqual(metadataId);
        expect(statement.order).toEqual(index);
      });
    });

    test('test metadata delete with statement', async () => {
      // prepare add
      const metadataId = await dbContext.addMetadata(initMetadata, initStatements);
      let allMetadata = await dbContext.getAllMetadata();
      expect(allMetadata?.length).toEqual(1);
      let statement = await dbContext.getStatementsFromMetadataId(metadataId);
      expect(statement?.length).toEqual(initStatements.length);

      // test deletion
      await dbContext.deleteMetadataFromId(metadataId);
      allMetadata = await dbContext.getAllMetadata();
      // test statement deletion
      statement = await dbContext.getStatementsFromMetadataId(metadataId);
      expect(statement?.length).toEqual(0);
    });

    describe('metadata & statement error tests', () => {
      test('expect null metadata throw exception', async () => {
        try {
          await dbContext.addMetadata(null, initStatements);
          throw new Error('Expect fail');
        } catch (err) {
          expect(err).not.toBeNull();
        }
      });
      test('expect missing author throw exception', async () => {
        try {
          await dbContext.addMetadata(
            { ...initMetadata, author: '' }, // remove author
            initStatements
          );
          throw new Error('Expect fail');
        } catch (err) {
          expect(err).not.toBeNull();
        }
      });

      test('expect missing repoName throw exception', async () => {
        try {
          await dbContext.addMetadata(
            { ...initMetadata, repoName: '' }, // remove repoName
            initStatements
          );
          throw new Error('Expect fail');
        } catch (err) {
          expect(err).not.toBeNull();
        }
      });

      test('expect empty statement throw exception', async () => {
        try {
          await dbContext.addMetadata(initMetadata, []);
          throw new Error('Expect fail');
        } catch (err) {
          expect(err).not.toBeNull();
        }
      });

      test('expect missing statement id throw exception', async () => {
        try {
          await dbContext.addMetadata(initMetadata, [
            {
              id: '', // missing id
              metadataId: '',
              order: 0,
              type: 'end',
            },
          ]);
          throw new Error('Expect fail');
        } catch (err) {
          expect(err).not.toBeNull();
        }
      });
    });
  });

  describe('test statement and reading log', () => {
    test('test no save data at init', async () => {
      const saveDataList = await dbContext.getAllSaveDataFromMetadataId(
        initSaveData.metadataId
      );
      expect(saveDataList).toHaveLength(0);
    });

    test('test add save data', async () => {
      jest.useFakeTimers().setSystemTime(initSaveData.createTimestamp);
      const newSaveDataId = await dbContext.addSaveData(initSaveData);

      expect(newSaveDataId.length).toBeGreaterThan(0);
      const allSaveData = await dbContext.getAllSaveDataFromMetadataId(
        initSaveData.metadataId
      );
      expect(allSaveData.length).toEqual(1);

      const actualSaveData = await dbContext.getSaveDataFromId(
        allSaveData[0].id
      );
      expect(actualSaveData).toEqual({
        ...initSaveData,
        id: newSaveDataId,
      });
    });

    test('test put save data', async () => {
      jest.useFakeTimers().setSystemTime(initSaveData.createTimestamp);
      const newSaveDataId = await dbContext.addSaveData(initSaveData);
      expect(newSaveDataId.length).toBeGreaterThan(0);

      const altSaveData: Types.SaveDataType = {
        ...initSaveData,
        id: newSaveDataId,
        statementCursorPos: '2d30d7c9-63d8-4254-aa48-59feb69f17d1',
        logCursorPos: 0,

        readLogs: [
          {
            sourceStatementId: '6ff9fa61-1288-40dd-a0e3-00189218860e',
            saveDataId: newSaveDataId,
            type: 's',
            data: 'test data #1',
            order: 0,
          },
          {
            sourceStatementId: '80a9019d-22b1-4de3-8503-9f61d05ba435',
            saveDataId: newSaveDataId,
            type: 's',
            data: 'test data #2',
            order: 1,
          },
        ],
      };
      await dbContext.putSaveData(altSaveData);
      const allSaveData = await dbContext.getAllSaveDataFromMetadataId(
        initSaveData.metadataId
      );
      expect(allSaveData.length).toEqual(1);

      const actualSaveData = await dbContext.getSaveDataFromId(
        allSaveData[0].id
      );
      expect(actualSaveData).toEqual(altSaveData);
    });

    test('test put save data with read log merge', async () => {
      const saveData: Types.SaveDataType = {
        ...initSaveData,
        id: '',
        statementCursorPos: '2d30d7c9-63d8-4254-aa48-59feb69f17d1',
        logCursorPos: 0,

        readLogs: [
          {
            sourceStatementId: '6ff9fa61-1288-40dd-a0e3-00189218860e',
            saveDataId: '',
            type: 's',
            data: 'test data #1',
            order: 0,
          },
        ],
      };
      jest.useFakeTimers().setSystemTime(saveData.createTimestamp);
      const newSaveDataId = await dbContext.addSaveData(saveData);
      expect(newSaveDataId.length).toBeGreaterThan(0);

      // with extra read log
      const saveDataWithExtraReadinglog: Types.SaveDataType = {
        ...saveData,
        id: newSaveDataId,
        readLogs: [
          {
            ...saveData.readLogs[0],
            saveDataId: newSaveDataId,
          },
          // extra reading log here
          {
            sourceStatementId: '80a9019d-22b1-4de3-8503-9f61d05ba435',
            saveDataId: newSaveDataId,
            type: 's',
            data: 'test data #2',
            order: 1,
          },
        ],
      };
      await dbContext.putSaveData(saveDataWithExtraReadinglog);
      const allSaveData = await dbContext.getAllSaveDataFromMetadataId(
        initSaveData.metadataId
      );
      expect(allSaveData.length).toEqual(1);

      const actualSaveData = await dbContext.getSaveDataFromId(
        allSaveData[0].id
      );
      expect(actualSaveData).toEqual(saveDataWithExtraReadinglog);
    });

    test('test delete save data', async () => {
      const newSaveDataId = await dbContext.addSaveData(initSaveData);
      expect(newSaveDataId.length).toBeGreaterThan(0);
      let allSaveData = await dbContext.getAllSaveDataFromMetadataId(
        initSaveData.metadataId
      );
      expect(allSaveData.length).toEqual(1);

      await dbContext.deleteSaveDataFromId(newSaveDataId);
      allSaveData = await dbContext.getAllSaveDataFromMetadataId(
        initSaveData.metadataId
      );
      expect(allSaveData.length).toEqual(0);
    });

    test('test delete save data by using metadata id', async () => {
      // arrange
      const metadataId = 'dummy metadata id';
      await dbContext.addSaveData({ ...initSaveData, metadataId: metadataId });
      await dbContext.addSaveData({
        ...initSaveData,
        metadataId: metadataId,
        statementCursorPos: '2d30d7c9-63d8-4254-aa48-59feb69f17d1',
        logCursorPos: 0,
        readLogs: [
          {
            sourceStatementId: '6ff9fa61-1288-40dd-a0e3-00189218860e',
            saveDataId: '',
            type: 's',
            data: 'test data #1',
            order: 0,
          },
        ],
      });
      const allSaveData = await dbContext.getAllSaveDataFromMetadataId(
        metadataId
      );
      expect(allSaveData.length).toBe(2);

      // act
      await dbContext.deleteMetadataFromId(initSaveData.metadataId);

      // assert
      const allSaveDataAfterDeletion =
        await dbContext.getAllSaveDataFromMetadataId(metadataId);
      expect(allSaveDataAfterDeletion.length).toBe(0);
    });

    describe('save data and reading log error tests', () => {
      test('missing metadataId from saveData should throw exception', async () => {
        try {
          const saveData: Types.SaveDataType = {
            ...initSaveData,
            metadataId: '', // missing metadata id
          };
          await dbContext.addSaveData(saveData);
          throw new Error('Expect fail');
        } catch (err) {
          expect(err).not.toBeNull();
        }
      });
      test('reading log keys conflict should throw exception', async () => {
        try {
          const saveData: Types.SaveDataType = {
            ...initSaveData,
            id: 'im test id',
            statementCursorPos: '2d30d7c9-63d8-4254-aa48-59feb69f17d1',
            logCursorPos: 0,

            readLogs: [
              {
                sourceStatementId: '6ff9fa61-1288-40dd-a0e3-00189218860e',
                saveDataId: 'im test id',
                type: 's',
                data: 'test data #1',
                order: 1, // it is 1
              },
              {
                sourceStatementId: '80a9019d-22b1-4de3-8503-9f61d05ba435',
                saveDataId: 'im test id',
                type: 's',
                data: 'test data #2',
                order: 1, // it is also 1
              },
            ],
          };
          await dbContext.addSaveData(saveData);
          throw new Error('Expect fail');
        } catch (err) {
          expect(err).not.toBeNull();
        }
      });
      test('reading logs miss order conflict should throw exception', async () => {
        try {
          const saveData: Types.SaveDataType = {
            ...initSaveData,
            id: 'im test id',
            statementCursorPos: '2d30d7c9-63d8-4254-aa48-59feb69f17d1',
            logCursorPos: 0,

            readLogs: [
              {
                sourceStatementId: '6ff9fa61-1288-40dd-a0e3-00189218860e',
                saveDataId: 'im test id',
                order: null, // miss order
                type: 's',
                data: 'test data #1',
              },
            ],
          };
          await dbContext.addSaveData(saveData);
          throw new Error('Expect fail');
        } catch (err) {
          expect(err).not.toBeNull();
        }
      });
      test('missing id while doing put should throw exception', async () => {
        try {
          const saveData: Types.SaveDataType = {
            ...initSaveData,
            id: '', // missing id
          };
          await dbContext.addSaveData(saveData);
          throw new Error('Expect fail');
        } catch (err) {
          expect(err).not.toBeNull();
        }
      });
      test('missing metadataId while doing put should throw exception', async () => {
        try {
          const saveData: Types.SaveDataType = {
            ...initSaveData,
            id: 'this is id',
            metadataId: '', // missing metadata id
          };
          await dbContext.addSaveData(saveData);
          throw new Error('Expect fail');
        } catch (err) {
          expect(err).not.toBeNull();
        }
      });
    });
  });
});

