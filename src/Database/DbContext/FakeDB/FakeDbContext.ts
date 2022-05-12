import { v4 as uuid } from 'uuid';
import * as Types from '@src/Types';
import { AbstractDbContext } from '../DbContext';
import FakeMetadata from '@resources/FakeMetadata.json';
import FakeScript from '@resources/FakeScript.json';
import FakeSaveData from '@resources/FakeSaveData.json';
import FakeReadLog from '@resources/FakeReadLog.json';

export class FakeDbContext extends AbstractDbContext {
  private metadataDb: Types.RepoMetadataType[] = [];
  private scriptDb: Types.ScriptType = [];
  private saveDataDb: Types.SaveDataType[] = [];
  private readLogDb: Types.ReadLogType[] = [];

  public constructor() {
    super();

    // mock read DB
    this.metadataDb = [...FakeMetadata];

    this.scriptDb = [];
    for (let i = 0; i < FakeScript.length; i++) {
      this.scriptDb.push({
        ...FakeScript[i],
        order: i,
      });
    }

    this.saveDataDb = [...FakeSaveData];
    this.readLogDb = [...FakeReadLog];
  }

  //#region Metadata
  public async getAllMetadata(): Promise<Types.RepoMetadataType[]> {
    return this.metadataDb;
  }
  public async getMetadata(
    author: string,
    repoName: string
  ): Promise<Types.RepoMetadataType> {
    let result = this.metadataDb.find(
      (value) => value?.author === author && value?.repoName === repoName
    );
    return result;
  }
  public async getMetadataFromRepoId(
    repoId: string
  ): Promise<Types.RepoMetadataType> {
    let result = this.metadataDb.find((value) => value?.id === repoId);
    return result;
  }
  public async addMetadata(
    metaData: Types.RepoMetadataType,
    script?: Types.ScriptType
  ): Promise<string> {
    if (script) {
      this.scriptDb = this.scriptDb.concat(script);
    }
    // generate an id
    metaData.id = uuid();
    this.metadataDb.push(metaData);

    return metaData.id;
  }
  public async deleteMetadataFromRepoId(repoId: string): Promise<void> {
    throw 'Not Implemented';
  }
  //#endregion

  //#region Script
  public async getScriptFromMetadataId(
    metaDataId: string
  ): Promise<Types.ScriptType> {
    return this.scriptDb
      .filter((item) => item.scriptId === metaDataId)
      .sort((item1, item2) => item1.order - item2.order);
  }
  public async updateScript(
    metaDataId: string,
    script: Types.ScriptType
  ): Promise<void> {
    throw 'Not Implemented';
  }
  public async deleteScriptFromMetadataId(metaDataId: string): Promise<void> {
    throw 'Not Implemented';
  }
  //#endregion

  //#region SaveData
  public async getAllSaveData(): Promise<Types.SaveDataType[]> {
    throw 'Not Implemented';
  }
  public async getSaveDataFromId(
    saveDataId: string
  ): Promise<Types.SaveDataType> {
    throw 'Not Implemented';
  }
  public async addSaveData(
    saveData: Types.SaveDataType,
    readLogs?: Types.ReadLogType[]
  ): Promise<void> {
    throw 'Not Implemented';
  }
  public async putSaveData(
    saveData: Types.SaveDataType,
    readLogs?: Types.ReadLogType[]
  ): Promise<void> {
    throw 'Not Implemented';
  }
  public async deleteSaveDataFromId(saveDataId: string): Promise<void> {
    throw 'Not Implemented';
  }
  //#endregion

  //#region ReadLog
  public async getReadLogsFromSaveDataId(
    saveDataId: string
  ): Promise<Types.ReadLogType[]> {
    throw 'Not Implemented';
  }
  public async pushReadLog(
    saveDataId: string,
    readLogs: Types.ReadLogType
  ): Promise<void> {
    throw 'Not Implemented';
  }
  public async deleteReadLogsFromId(saveDataId: string): Promise<void> {
    throw 'Not Implemented';
  }
  //#endregion
}
