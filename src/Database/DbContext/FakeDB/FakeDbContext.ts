import * as Types from '@src/Types';
import { DbContext } from '../DbContext';

export class FakeDbContext extends DbContext {
  public constructor() {
    super();
  }

  //#region MetaData
  public async getAllMetaData(): Promise<Types.RepoMetadataType[]> {
    throw 'Not Implemented';
  }
  public async getMetaData(author: string, title: string): Promise<Types.RepoMetadataType> {
    throw 'Not Implemented';
  }
  public async getMetaDataFromRepoId(repoId: string): Promise<Types.RepoMetadataType> {
    throw 'Not Implemented';
  }
  public async addMetaData(metaData: Types.RepoMetadataType, script?: Types.ScriptType): Promise<string> {
    throw 'Not Implemented';
  }
  public async deleteMetaDataFromRepoId(repoId: string): Promise<void> {
    throw 'Not Implemented';
  }
  //#endregion

  //#region Script
  public async getScriptFromMetaDataId(metaDataId: string): Promise<Types.ScriptType> {
    throw 'Not Implemented';
  }
  public async updateScript(metaDataId: string, script: Types.ScriptType): Promise<void> {
    throw 'Not Implemented';
  }
  public async deleteScriptFromMetaDataId(metaDataId: string): Promise<void> {
    throw 'Not Implemented';
  }
  //#endregion

  //#region SaveData
  public async getSaveDataAll(): Promise<Types.SaveDataType[]> {
    throw 'Not Implemented';
  }
  public async getSaveDataFromId(saveDataId: string): Promise<Types.SaveDataType> {
    throw 'Not Implemented';
  }
  public async addSaveData(saveData: Types.SaveDataType, readLogs?: Types.ReadLogType[]): Promise<void> {
    throw 'Not Implemented';
  }
  public async putSaveData(saveData: Types.SaveDataType, readLogs?: Types.ReadLogType[]): Promise<void> {
    throw 'Not Implemented';
  }
  public async deleteSaveDataFromId(saveDataId: string): Promise<void> {
    throw 'Not Implemented';
  }
  //#endregion

  //#region ReadLog
  public async getReadLogsFromSaveDataId(saveDataId: string): Promise<Types.ReadLogType[]> {
    throw 'Not Implemented';
  }
  public async pushReadLog(saveDataId: string, readLogs: Types.ReadLogType): Promise<void> {
    throw 'Not Implemented';
  }
  public async deleteReadLogsFromId(saveDataId: string): Promise<void> {
    throw 'Not Implemented';
  }
  //#endregion
}
