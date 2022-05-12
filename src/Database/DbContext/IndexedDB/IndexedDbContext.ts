import * as Types from '@src/Types';
import { AbstractDbContext } from '../DbContext';

export class IndexedDbContext extends AbstractDbContext {
  public constructor() {
    super();
  }

  //#region Metadata
  public async getAllMetadata(): Promise<Types.RepoMetadataType[]> {
    throw 'Not Implemented';
  }
  public async getMetadata(author: string, repoName: string): Promise<Types.RepoMetadataType> {
    throw 'Not Implemented';
  }
  public async getMetadataFromRepoId(repoId: string): Promise<Types.RepoMetadataType> {
    throw 'Not Implemented';
  }
  public async addMetadata(metaData: Types.RepoMetadataType, script?: Types.ScriptType): Promise<string> {
    throw 'Not Implemented';
  }
  public async deleteMetadataFromRepoId(repoId: string): Promise<void> {
    throw 'Not Implemented';
  }
  //#endregion

  //#region Script
  public async getScriptFromMetadataId(metaDataId: string): Promise<Types.ScriptType> {
    throw 'Not Implemented';
  }
  public async updateScript(metaDataId: string, script: Types.ScriptType): Promise<void> {
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
