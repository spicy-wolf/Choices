/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import * as Types from '../Types';
import * as Utils from '@src/Utils';
import { AbstractDbContext } from '../DbContext';

declare interface DbResultEvent<T> extends Event {
  target: IDBRequest<T>
}

export class IndexedDbContext extends AbstractDbContext {
  private readonly DB_NAME: string = 'choices';
  private readonly METADATA_TB_NAME: string = 'metadata';
  private readonly STATEMENT_TB_NAME: string = 'statement';
  private readonly SAVE_DATA_TB_NAME: string = 'savedata';
  private readonly READ_LOG_TB_NAME: string = 'readlog';

  //#region Field names
  private readonly METADATA_ID_NAME: string =
    Utils.propertyOf<Types.RepoMetadataType>('id');
  private readonly METADATA_AUTHOR_NAME: string =
    Utils.propertyOf<Types.RepoMetadataType>('author');
  private readonly METADATA_REPONAME_NAME: string =
    Utils.propertyOf<Types.RepoMetadataType>('repoName');
  private readonly STATEMENT_ID_NAME: string =
    Utils.propertyOf<Types.StatementType>('id');
  private readonly STATEMENT_METADATAID_NAME: string =
    Utils.propertyOf<Types.StatementType>('metadataId');
  private readonly STATEMENT_ORDER_NAME: string =
    Utils.propertyOf<Types.StatementType>('order');
  private readonly SAVE_DATA_ID_NAME: string =
    Utils.propertyOf<Types.SaveDataType>('id');
  private readonly SAVE_DATA_METADATAID_NAME: string =
    Utils.propertyOf<Types.SaveDataType>('metadataId');
  private readonly READ_LOG_SAVEDATAID_NAME: string = 'saveDataId'; // TODO:
  private readonly READ_LOG_ORDER_NAME: string = 'order'; // TODO: remove me
  //#endregion

  private db: IDBDatabase = null;

  public constructor() {
    super();

    this.db = null;
  }

  public async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.DB_NAME, 1);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db: IDBDatabase = request.result;
        if (event.oldVersion < 1) {
          //#region metadata table
          const metadataObjectStore = db.createObjectStore(
            this.METADATA_TB_NAME,
            {
              keyPath: this.METADATA_ID_NAME,
            }
          );
          metadataObjectStore.createIndex(
            `${this.METADATA_AUTHOR_NAME}_${this.METADATA_REPONAME_NAME}`,
            [this.METADATA_AUTHOR_NAME, this.METADATA_REPONAME_NAME],
            { unique: true }
          );
          //#endregion

          //#region statement table
          const statementObjectStore = db.createObjectStore(this.STATEMENT_TB_NAME, {
            keyPath: this.STATEMENT_ID_NAME,
          });
          statementObjectStore.createIndex(
            `${this.STATEMENT_METADATAID_NAME}_${this.STATEMENT_ORDER_NAME}`,
            [this.STATEMENT_METADATAID_NAME, this.STATEMENT_ORDER_NAME],
            {
              unique: true,
            }
          );
          //#endregion

          //#region save data table
          const saveDataObjectStore = db.createObjectStore(
            this.SAVE_DATA_TB_NAME,
            {
              keyPath: this.SAVE_DATA_ID_NAME,
            }
          );
          saveDataObjectStore.createIndex(
            `${this.SAVE_DATA_METADATAID_NAME}`,
            this.SAVE_DATA_METADATAID_NAME,
            {
              unique: false,
            }
          );
          //#endregion

          //#region read log table
          const readLogObjectStore = db.createObjectStore(
            this.READ_LOG_TB_NAME,
            {
              keyPath: [
                this.READ_LOG_SAVEDATAID_NAME,
                this.READ_LOG_ORDER_NAME,
              ],
            }
          );
          //#endregion
        }
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onerror = () => {
        reject();
      };
    });
  }

  //#region Metadata
  public async getAllMetadata(): Promise<Types.RepoMetadataType[]> {
    const transaction = this.db.transaction(
      [this.METADATA_TB_NAME],
      'readonly'
    );
    const request = transaction.objectStore(this.METADATA_TB_NAME).getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = (event: DbResultEvent<Types.RepoMetadataType[]>) => {
        const result = event.target.result;
        resolve(result);
      };
      transaction.onerror = () => {
        reject();
      };
    });
  }
  public async getMetadata(
    author: string,
    repoName: string
  ): Promise<Types.RepoMetadataType> {
    // generate metadata id base on author and repo name
    const metadataId = await this.digestMetadataId(author, repoName);
    return await this.getMetadataFromId(metadataId);
  }
  public async getMetadataFromId(id: string): Promise<Types.RepoMetadataType> {
    const transaction = this.db.transaction(
      [this.METADATA_TB_NAME],
      'readonly'
    );
    const request = transaction.objectStore(this.METADATA_TB_NAME).get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event: DbResultEvent<Types.RepoMetadataType>) => {
        const result = event.target.result;
        resolve(result);
      };
      transaction.onerror = () => {
        reject();
      };
    });
  }
  public async addMetadata(
    metadata: Types.RepoMetadataType,
    statement: Types.StatementType[]
  ): Promise<string> {
    if (!metadata) throw 'null metadata';
    if (!metadata?.author || !metadata?.repoName) throw 'metadata incomplete';

    // generate metadata id base on author and repo name
    const metadataId = await this.digestMetadataId(
      metadata?.author,
      metadata?.repoName
    );

    const transaction = this.db.transaction(
      [this.METADATA_TB_NAME, this.STATEMENT_TB_NAME],
      'readwrite'
    );

    // add metadata
    transaction
      .objectStore(this.METADATA_TB_NAME)
      .add({ ...metadata, id: metadataId });
    // remove old statements, then insert new ones
    this.replaceStatementsHelper(transaction, metadataId, statement);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve(metadataId);
      };
      transaction.onerror = () => {
        reject();
      };
      transaction.onabort = () => {
        reject();
      };
    });
  }
  public async putMetadata(
    metadata: Types.RepoMetadataType,
    statements: Types.StatementType[]
  ): Promise<string> {
    if (!metadata) throw 'null metadata';

    // generate metadata id base on author and repo name
    const metadataId = await this.digestMetadataId(
      metadata?.author,
      metadata?.repoName
    );

    const transaction = this.db.transaction(
      [this.METADATA_TB_NAME, this.STATEMENT_TB_NAME],
      'readwrite'
    );

    // add metadata
    transaction
      .objectStore(this.METADATA_TB_NAME)
      .put({ ...metadata, id: metadataId });
    // remove old statements, then insert new ones
    this.replaceStatementsHelper(transaction, metadataId, statements);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve(metadataId);
      };
      transaction.onerror = () => {
        reject();
      };
      transaction.onabort = () => {
        reject();
      };
    });
  }
  private replaceStatementsHelper(
    transaction: IDBTransaction,
    metadataId: string,
    statements: Types.StatementType[]
  ) {
    if (!statements || statements.length === 0) {
      transaction.abort();
      return;
    }

    for (const statement of statements) {
      if (!statement.id) {
        transaction.abort();
        return;
      }
    }
    // remove all existed statement first
    const oldStatementRequest = transaction
      .objectStore(this.STATEMENT_TB_NAME)
      .index(`${this.STATEMENT_METADATAID_NAME}_${this.STATEMENT_ORDER_NAME}`)
      .openCursor(IDBKeyRange.bound([metadataId, 0], [metadataId, '']), 'next');
    oldStatementRequest.onsuccess = (event: DbResultEvent<IDBCursorWithValue>) => {
      const deletionPromiseList: Promise<void>[] = [];
      const cursor = event.target.result;
      if (cursor) {
        deletionPromiseList.push(
          new Promise((resolve, reject) => {
            const cursorDeletion = cursor.delete();
            cursorDeletion.onsuccess = () => resolve();
            cursorDeletion.onerror = () => reject();
          })
        );
        cursor.continue();
      } else {
        // when all delete done, then add statement
        Promise.all(deletionPromiseList)
          .then(() => {
            statements?.forEach((item, index) => {
              transaction
                .objectStore(this.STATEMENT_TB_NAME)
                .add({ ...item, metadataId: metadataId, order: index });
            });
          })
          .catch(() => {
            transaction.abort();
          });
      }
    };
    //TODO: race condition here, we cannot remove all and then add all
    // find a better way
  }
  public async deleteMetadataFromId(metadataId: string): Promise<void> {
    const transaction = this.db.transaction(
      [
        this.SAVE_DATA_TB_NAME,
        this.READ_LOG_TB_NAME,
        this.STATEMENT_TB_NAME,
        this.METADATA_TB_NAME,
      ],
      'readwrite'
    );
    //#region delete save data & reading logs
    const saveDataRequest = transaction
      .objectStore(this.SAVE_DATA_TB_NAME)
      .index(this.SAVE_DATA_METADATAID_NAME)
      .openCursor(IDBKeyRange.only(metadataId));
    saveDataRequest.onsuccess = (event: DbResultEvent<IDBCursorWithValue>) => {
      const saveDataCursor = event.target.result;
      if (saveDataCursor) {
        // delete reading logs
        const saveDataId = saveDataCursor.value.id;
        const readlogRequest = transaction
          .objectStore(this.READ_LOG_TB_NAME)
          .openCursor(IDBKeyRange.bound([saveDataId, 0], [saveDataId, '']));

        readlogRequest.onsuccess = (event: DbResultEvent<IDBCursorWithValue>) => {
          const readlogCursor = event.target.result;
          if (readlogCursor) {
            readlogCursor.delete();
            readlogCursor.continue();
          }
        };

        // delete save data
        saveDataCursor.delete();
        saveDataCursor.continue();
      }
    };
    saveDataRequest.onerror = () => { };
    //#endregion

    //#region delete statements
    const statementRequest = transaction
      .objectStore(this.STATEMENT_TB_NAME)
      .index(`${this.STATEMENT_METADATAID_NAME}_${this.STATEMENT_ORDER_NAME}`)
      .openCursor(IDBKeyRange.bound([metadataId, 0], [metadataId, '']));
    statementRequest.onsuccess = (event: DbResultEvent<IDBCursorWithValue>) => {
      const cursor = event.target.result;

      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
    //#endregion

    //#region delete metadata
    const metadataRequest = transaction
      .objectStore(this.METADATA_TB_NAME)
      .delete(metadataId);
    //#endregion

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = (event: DbResultEvent<void>) => {
        reject((event.target as IDBRequest).error);
      };
      transaction.onabort = () => {
        reject();
      };
    });
  }
  //#endregion

  //#region Statement
  public async getStatementsFromMetadataId(
    metadataId: string
  ): Promise<Types.StatementType[]> {
    const transaction = this.db.transaction([this.STATEMENT_TB_NAME], 'readonly');

    const statementRequest = transaction
      .objectStore(this.STATEMENT_TB_NAME)
      .index(`${this.STATEMENT_METADATAID_NAME}_${this.STATEMENT_ORDER_NAME}`)
      .getAll(IDBKeyRange.bound([metadataId, 0], [metadataId, '']));

    return new Promise((resolve, reject) => {
      statementRequest.onsuccess = (event: DbResultEvent<Types.StatementType[]>) => {
        let result = event.target.result;
        result = result.sort((item) => item.order - item.order);
        resolve(result);
      };
      transaction.onerror = () => {
        reject();
      };
    });
  }
  //#endregion

  //#region SaveData (included ReadLogs)
  public async getAllSaveDataFromMetadataId(
    metadataId: string
  ): Promise<Types.SaveDataType[]> {
    const transaction = this.db.transaction(
      [this.SAVE_DATA_TB_NAME],
      'readonly'
    );

    const saveDataRequest = transaction
      .objectStore(this.SAVE_DATA_TB_NAME)
      .index(this.SAVE_DATA_METADATAID_NAME)
      .getAll(IDBKeyRange.only(metadataId));

    return new Promise((resolve, reject) => {
      saveDataRequest.onsuccess = (event: DbResultEvent<Types.SaveDataType[]>) => {
        let result = event.target.result;
        result = result.sort(
          (item) => item.createTimestamp - item.createTimestamp
        );
        resolve(result);
      };
      transaction.onerror = () => {
        reject();
      };
    });
  }
  public async getSaveDataFromId(
    saveDataId: string
  ): Promise<Types.SaveDataType> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        [this.SAVE_DATA_TB_NAME, this.READ_LOG_TB_NAME],
        'readonly'
      );

      const saveDataRequest = transaction
        .objectStore(this.SAVE_DATA_TB_NAME)
        .get(saveDataId);
      saveDataRequest.onsuccess = (event: DbResultEvent<Types.SaveDataType>) => {
        const saveData = event.target.result as Types.SaveDataType;
        if (saveData) {
          const readlogRequest = transaction
            .objectStore(this.READ_LOG_TB_NAME)
            .getAll(IDBKeyRange.bound([saveData.id, 0], [saveData.id, '']));
          readlogRequest.onsuccess = (event: DbResultEvent<Types.ReadLogType[]>) => {
            const readLogs = event.target.result as Types.ReadLogType[];
            saveData.readLogs = readLogs;
            resolve(saveData);
          };
        } else {
          // did not find auto save, then return null
          resolve(null);
        }
      };
      transaction.oncomplete = () => { };
      transaction.onerror = () => {
        reject();
      };
    });
  }
  public async addSaveData(saveData: Types.SaveDataType): Promise<string> {
    if (!saveData?.metadataId) {
      throw 'invalid metadata id';
    }

    const { readLogs, ...restSaveData } = saveData;
    const newSaveDataId = saveData.id || Utils.generateId();

    const transaction = this.db.transaction(
      [this.SAVE_DATA_TB_NAME, this.READ_LOG_TB_NAME],
      'readwrite'
    );
    const saveDataRequest = transaction
      .objectStore(this.SAVE_DATA_TB_NAME)
      .add({ ...restSaveData, id: newSaveDataId, createTimestamp: Date.now() });

    for (const readLog of readLogs) {
      const readLogRequest = transaction
        .objectStore(this.READ_LOG_TB_NAME)
        // note: we should not give a new id since the readLogIndicator in savedata should match reading log
        .add({ ...readLog, /* id: uuidv4(),*/ saveDataId: newSaveDataId });
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve(newSaveDataId);
      };
      transaction.onerror = (event: DbResultEvent<void>) => {
        reject((event.target as IDBRequest).error);
      };
      transaction.onabort = () => {
        reject();
      };
    });
  }
  public async putSaveData(saveData: Types.SaveDataType): Promise<void> {
    if (!saveData?.id) {
      throw 'invalid save data id';
    }
    if (!saveData?.metadataId) {
      throw 'invalid metadata id';
    }

    const { readLogs, ...restSaveData } = saveData;

    const transaction = this.db.transaction(
      [this.SAVE_DATA_TB_NAME, this.READ_LOG_TB_NAME],
      'readwrite'
    );
    const saveDataRequest = transaction
      .objectStore(this.SAVE_DATA_TB_NAME)
      .put({ ...restSaveData, id: saveData.id, createTimestamp: Date.now() });

    // insert extra reading log
    const readlogRequest = transaction
      .objectStore(this.READ_LOG_TB_NAME)
      .openCursor(
        IDBKeyRange.bound([saveData.id, 0], [saveData.id, '']),
        'prev'
      );
    readlogRequest.onsuccess = (event: DbResultEvent<IDBCursorWithValue>) => {
      const cursor = event.target.result as IDBCursorWithValue;
      const lastOrderNumber = cursor?.value?.order;
      let newReadLogs = readLogs;

      if (lastOrderNumber >= 0) {
        newReadLogs = readLogs.filter((item) => item.order > lastOrderNumber);
      }
      for (const readLog of newReadLogs) {
        const readLogRequest = transaction
          .objectStore(this.READ_LOG_TB_NAME)
          // note: we should not give a new id since the readLogIndicator in savedata should match reading log
          .add({ ...readLog, /*id: uuidv4(),*/ saveDataId: saveData.id });
      }
    };

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => {
        reject();
      };
      transaction.onabort = () => {
        reject();
      };
    });
  }
  public async deleteSaveDataFromId(saveDataId: string): Promise<void> {
    const transaction = this.db.transaction(
      [this.SAVE_DATA_TB_NAME, this.READ_LOG_TB_NAME],
      'readwrite'
    );
    const saveDataRequest = transaction
      .objectStore(this.SAVE_DATA_TB_NAME)
      .get(saveDataId);
    saveDataRequest.onsuccess = (event: DbResultEvent<Types.SaveDataType>) => {
      const saveData = event.target.result as Types.SaveDataType;

      if (saveData) {
        // delete reading logs
        const saveDataId = saveData.id;
        const readlogRequest = transaction
          .objectStore(this.READ_LOG_TB_NAME)
          .openCursor(IDBKeyRange.bound([saveDataId, 0], [saveDataId, '']));

        readlogRequest.onsuccess = (event: DbResultEvent<IDBCursorWithValue>) => {
          const readlogCursor = event.target.result;

          if (readlogCursor) {
            readlogCursor.delete();
            readlogCursor.continue();
          }
        };
      }
    };
    transaction.objectStore(this.SAVE_DATA_TB_NAME).delete(saveDataId);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => {
        reject();
      };
    });
  }
  //#endregion
}

