import * as Types from '../Types';
import * as Utils from '@src/Utils';
import { AbstractDbContext } from '../DbContext';
import { v4 as uuidv4 } from 'uuid';

export class IndexedDbContext extends AbstractDbContext {
  private readonly DB_NAME: string = 'choices';
  private readonly METADATA_TB_NAME: string = 'metadata';
  private readonly SCRIPT_TB_NAME: string = 'script';
  private readonly SAVE_DATA_TB_NAME: string = 'savedata';
  private readonly READ_LOG_TB_NAME: string = 'readlog';

  //#region Field names
  private readonly METADATA_ID_NAME: string =
    Utils.propertyOf<Types.RepoMetadataType>('id');
  private readonly METADATA_AUTHOR_NAME: string =
    Utils.propertyOf<Types.RepoMetadataType>('author');
  private readonly METADATA_REPONAME_NAME: string =
    Utils.propertyOf<Types.RepoMetadataType>('repoName');
  private readonly SCRIPT_ID_NAME: string =
    Utils.propertyOf<Types.ScriptType extends (infer U)[] ? U : never>('id');
  private readonly SCRIPT_METADATAID_NAME: string =
    Utils.propertyOf<Types.ScriptType extends (infer U)[] ? U : never>(
      'metadataId'
    );
  private readonly SCRIPT_ORDER_NAME: string =
    Utils.propertyOf<Types.ScriptType extends (infer U)[] ? U : never>('order');
  private readonly SAVE_DATA_ID_NAME: string =
    Utils.propertyOf<Types.SaveDataType>('id');
  private readonly SAVE_DATA_METADATAID_NAME: string =
    Utils.propertyOf<Types.SaveDataType>('metadataId');
  private readonly READ_LOG_SAVEDATAID_NAME: string =
    Utils.propertyOf<Types.ReadLogType>('saveDataId');
  private readonly READ_LOG_ORDER_NAME: string =
    Utils.propertyOf<Types.ReadLogType>('order');
  //#endregion

  private db: IDBDatabase = null;

  public constructor() {
    super();

    this.db = null;
  }

  public async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      let request = window.indexedDB.open(this.DB_NAME, 1);

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

          //#region script table
          const scriptObjectStore = db.createObjectStore(this.SCRIPT_TB_NAME, {
            keyPath: this.SCRIPT_ID_NAME,
          });
          scriptObjectStore.createIndex(
            `${this.SCRIPT_METADATAID_NAME}_${this.SCRIPT_ORDER_NAME}`,
            [this.SCRIPT_METADATAID_NAME, this.SCRIPT_ORDER_NAME],
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
      request.onsuccess = (event: any) => {
        this.db = request.result;
        resolve();
      };
      request.onerror = (event: any) => {
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
      request.onsuccess = (event: any) => {
        const result = event.target.result as Types.RepoMetadataType[];
        resolve(result);
      };
      transaction.onerror = (event: any) => {
        reject();
      };
    });
  }
  public async getMetadata(
    author: string,
    repoName: string
  ): Promise<Types.RepoMetadataType> {
    // generate metadata id base on author and repo name
    const metadataId = await this.computeMetadataId(author, repoName);
    return await this.getMetadataFromId(metadataId);
  }
  public async getMetadataFromId(id: string): Promise<Types.RepoMetadataType> {
    const transaction = this.db.transaction(
      [this.METADATA_TB_NAME],
      'readonly'
    );
    const request = transaction.objectStore(this.METADATA_TB_NAME).get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event: any) => {
        const result = event.target.result;
        resolve(result);
      };
      transaction.onerror = (event) => {
        reject();
      };
    });
  }
  public async addMetadata(
    metadata: Types.RepoMetadataType,
    script: Types.ScriptType
  ): Promise<string> {
    if (!metadata) throw 'null metadata';
    if (!metadata?.author || !metadata?.repoName) throw 'metadata incomplete';

    // generate metadata id base on author and repo name
    const metadataId = await this.computeMetadataId(
      metadata?.author,
      metadata?.repoName
    );

    const transaction = this.db.transaction(
      [this.METADATA_TB_NAME, this.SCRIPT_TB_NAME],
      'readwrite'
    );

    // add metadata
    transaction
      .objectStore(this.METADATA_TB_NAME)
      .add({ ...metadata, id: metadataId });
    // remove old scripts, then insert new ones
    this.replaceScriptsHelper(transaction, metadataId, script);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = (event: any) => {
        resolve(metadataId);
      };
      transaction.onerror = (event: any) => {
        reject();
      };
      transaction.onabort = (event: any) => {
        reject();
      };
    });
  }
  public async putMetadata(
    metadata: Types.RepoMetadataType,
    script: Types.ScriptType
  ): Promise<string> {
    if (!metadata) throw 'null metadata';

    // generate metadata id base on author and repo name
    const metadataId = await this.computeMetadataId(
      metadata?.author,
      metadata?.repoName
    );

    const transaction = this.db.transaction(
      [this.METADATA_TB_NAME, this.SCRIPT_TB_NAME],
      'readwrite'
    );

    // add metadata
    transaction
      .objectStore(this.METADATA_TB_NAME)
      .put({ ...metadata, id: metadataId });
    // remove old scripts, then insert new ones
    this.replaceScriptsHelper(transaction, metadataId, script);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = (event: any) => {
        resolve(metadataId);
      };
      transaction.onerror = (event: any) => {
        reject();
      };
      transaction.onabort = (event: any) => {
        reject();
      };
    });
  }
  private replaceScriptsHelper(
    transaction: IDBTransaction,
    metadataId: string,
    script: Types.ScriptType
  ) {
    if (!script || script.length === 0) {
      transaction.abort();
      return;
    }

    for (const statement of script) {
      if (!statement.id) {
        transaction.abort();
        return;
      }
    }
    // remove all existed script first
    const oldScriptRequest = transaction
      .objectStore(this.SCRIPT_TB_NAME)
      .index(`${this.SCRIPT_METADATAID_NAME}_${this.SCRIPT_ORDER_NAME}`)
      .openCursor(IDBKeyRange.bound([metadataId, 0], [metadataId, '']), 'next');
    oldScriptRequest.onsuccess = (event: any) => {
      const deletionPromiseList: Promise<void>[] = [];
      const cursor = event.target.result as IDBCursorWithValue;
      if (cursor) {
        deletionPromiseList.push(
          new Promise((resolve, reject) => {
            const cursorDeletion = cursor.delete();
            cursorDeletion.onsuccess = (event) => resolve();
            cursorDeletion.onerror = (event) => reject();
          })
        );
        cursor.continue();
      } else {
        // when all delete done, then add script
        Promise.all(deletionPromiseList)
          .then(() => {
            script?.forEach((item, index) => {
              const scriptRequest = transaction
                .objectStore(this.SCRIPT_TB_NAME)
                .add({ ...item, metadataId: metadataId, order: index });
            });
          })
          .catch((err) => {
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
        this.SCRIPT_TB_NAME,
        this.METADATA_TB_NAME,
      ],
      'readwrite'
    );
    //#region delete save data & reading logs
    const saveDataRequest = transaction
      .objectStore(this.SAVE_DATA_TB_NAME)
      .index(this.SAVE_DATA_METADATAID_NAME)
      .openCursor(IDBKeyRange.only(metadataId));
    saveDataRequest.onsuccess = (event: any) => {
      const saveDataCursor = event.target.result as IDBCursorWithValue;
      if (saveDataCursor) {
        // delete reading logs
        const saveDataId = saveDataCursor.value.id;
        const readlogRequest = transaction
          .objectStore(this.READ_LOG_TB_NAME)
          .openCursor(IDBKeyRange.bound([saveDataId, 0], [saveDataId, '']));

        readlogRequest.onsuccess = (event: any) => {
          const readlogCursor = event.target.result as IDBCursorWithValue;
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
    saveDataRequest.onerror = (event: any) => {};
    //#endregion

    //#region delete scripts
    const scriptRequest = transaction
      .objectStore(this.SCRIPT_TB_NAME)
      .index(`${this.SCRIPT_METADATAID_NAME}_${this.SCRIPT_ORDER_NAME}`)
      .openCursor(IDBKeyRange.bound([metadataId, 0], [metadataId, '']));
    scriptRequest.onsuccess = (event: any) => {
      const cursor = event.target.result as IDBCursorWithValue;

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
      transaction.oncomplete = (event: any) => {
        resolve();
      };
      transaction.onerror = (event: any) => {
        reject();
      };
      transaction.onabort = (event: any) => {
        reject();
      };
    });
  }
  //#endregion

  //#region Script
  public async getScriptFromMetadataId(
    metadataId: string
  ): Promise<Types.ScriptType> {
    const transaction = this.db.transaction([this.SCRIPT_TB_NAME], 'readonly');

    const scriptRequest = transaction
      .objectStore(this.SCRIPT_TB_NAME)
      .index(`${this.SCRIPT_METADATAID_NAME}_${this.SCRIPT_ORDER_NAME}`)
      .getAll(IDBKeyRange.bound([metadataId, 0], [metadataId, '']));

    return new Promise((resolve, reject) => {
      scriptRequest.onsuccess = (event: any) => {
        let result = event.target.result as Types.ScriptType;
        result = result.sort((item) => item.order - item.order);
        resolve(result);
      };
      transaction.onerror = (event: any) => {
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
      saveDataRequest.onsuccess = (event: any) => {
        let result = event.target.result as Types.SaveDataType[];
        result = result.sort((item) => item.timestamp - item.timestamp);
        resolve(result);
      };
      transaction.onerror = (event: any) => {
        reject();
      };
    });
  }
  public async getAutoSaveDataFromMetadataId(
    metadataId: string
  ): Promise<Types.SaveDataType> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        [this.SAVE_DATA_TB_NAME, this.READ_LOG_TB_NAME],
        'readonly'
      );

      const saveDataRequest = transaction
        .objectStore(this.SAVE_DATA_TB_NAME)
        .index(this.SAVE_DATA_METADATAID_NAME)
        .openCursor(IDBKeyRange.only(metadataId));
      saveDataRequest.onsuccess = (event: any) => {
        const cursor = event.target.result as IDBCursorWithValue;
        if (cursor) {
          if (cursor.value.description === '') {
            const autoSaveData = cursor.value as Types.SaveDataType;
            const readlogRequest = transaction
              .objectStore(this.READ_LOG_TB_NAME)
              .getAll(
                IDBKeyRange.bound([autoSaveData.id, 0], [autoSaveData.id, ''])
              );
            readlogRequest.onsuccess = (event: any) => {
              const readingLogs = event.target.result as Types.ReadLogType[];
              autoSaveData.readingLogs = readingLogs;
              resolve(autoSaveData);
            };
          }
          cursor.continue();
        } else {
          // did not find auto save, then return null
          resolve(null);
        }
      };
      transaction.oncomplete = (event: any) => {};
      transaction.onerror = (event: any) => {
        reject();
      };
    });
  }
  public async addSaveData(saveData: Types.SaveDataType): Promise<string> {
    if (!saveData?.metadataId) {
      throw 'invalid metadata id';
    }

    const { readingLogs, ...restSaveData } = saveData;
    const newSaveDataId = uuidv4();

    const transaction = this.db.transaction(
      [this.SAVE_DATA_TB_NAME, this.READ_LOG_TB_NAME],
      'readwrite'
    );
    const saveDataRequest = transaction
      .objectStore(this.SAVE_DATA_TB_NAME)
      .add({ ...restSaveData, id: newSaveDataId, timestamp: Date.now() });

    for (const readingLog of readingLogs) {
      const readingLogRequest = transaction
        .objectStore(this.READ_LOG_TB_NAME)
        // note: we should not give a new id since the readLogIndicator in savedata should match reading log
        .add({ ...readingLog, /* id: uuidv4(),*/ saveDataId: newSaveDataId });
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = (event) => {
        resolve(newSaveDataId);
      };
      transaction.onerror = (event) => {
        reject();
      };
      transaction.onabort = (event) => {
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

    const { readingLogs, ...restSaveData } = saveData;

    const transaction = this.db.transaction(
      [this.SAVE_DATA_TB_NAME, this.READ_LOG_TB_NAME],
      'readwrite'
    );
    const saveDataRequest = transaction
      .objectStore(this.SAVE_DATA_TB_NAME)
      .put({ ...restSaveData, id: saveData.id, timestamp: Date.now() });

    // insert extra reading log
    const readlogRequest = transaction
      .objectStore(this.READ_LOG_TB_NAME)
      .openCursor(
        IDBKeyRange.bound([saveData.id, 0], [saveData.id, '']),
        'prev'
      );
    readlogRequest.onsuccess = (event: any) => {
      const cursor = event.target.result as IDBCursorWithValue;
      const lastOrderNumber = cursor?.value?.order;
      let newReadingLogs = readingLogs;

      if (lastOrderNumber >= 0) {
        newReadingLogs = readingLogs.filter(
          (item) => item.order > lastOrderNumber
        );
      }
      for (const readingLog of newReadingLogs) {
        const readingLogRequest = transaction
          .objectStore(this.READ_LOG_TB_NAME)
          // note: we should not give a new id since the readLogIndicator in savedata should match reading log
          .add({ ...readingLog, /*id: uuidv4(),*/ saveDataId: saveData.id });
      }
    };

    return new Promise((resolve, reject) => {
      transaction.oncomplete = (event) => {
        resolve();
      };
      transaction.onerror = (event) => {
        reject();
      };
      transaction.onabort = (event) => {
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
    saveDataRequest.onsuccess = (event: any) => {
      let saveData = event.target.result as Types.SaveDataType;

      if (saveData) {
        // delete reading logs
        const saveDataId = saveData.id;
        const readlogRequest = transaction
          .objectStore(this.READ_LOG_TB_NAME)
          .openCursor(IDBKeyRange.bound([saveDataId, 0], [saveDataId, '']));

        readlogRequest.onsuccess = (event: any) => {
          let readlogCursor = event.target.result;

          if (readlogCursor) {
            readlogCursor.delete();
            readlogCursor.continue();
          }
        };
      }
    };
    transaction.objectStore(this.SAVE_DATA_TB_NAME).delete(saveDataId);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = (event) => {
        resolve();
      };
      transaction.onerror = (event) => {
        reject();
      };
    });
  }
  //#endregion

  private async computeMetadataId(
    author: string,
    repoName: string
  ): Promise<string> {
    const str = author?.trim() + repoName?.trim();
    if (!str) throw 'Invalid author or repo name';

    const metadataId = await Utils.digeststring(str);
    return metadataId;
  }
}
