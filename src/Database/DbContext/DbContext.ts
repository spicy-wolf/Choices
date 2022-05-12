import * as Types from '@src/Types';

export abstract class AbstractDbContext {
  public constructor() { }

  //#region Metadata
  public abstract getAllMetadata(): Promise<Types.RepoMetadataType[]>;
  public abstract getMetadata(author: string, repoName: string): Promise<Types.RepoMetadataType>;
  public abstract getMetadataFromRepoId(repoId: string): Promise<Types.RepoMetadataType>;
  public abstract addMetadata(metaData: Types.RepoMetadataType, script?: Types.ScriptType): Promise<string>; // return metaData id
  public abstract deleteMetadataFromRepoId(repoId: string): Promise<void>;
  //#endregion

  //#region Script
  public abstract getScriptFromMetadataId(metaDataId: string): Promise<Types.ScriptType>;
  public abstract updateScript(metaDataId: string, script: Types.ScriptType): Promise<void>;
  public abstract deleteScriptFromMetadataId(metaDataId: string): Promise<void>;
  //#endregion

  //#region SaveData
  public abstract getAllSaveData(): Promise<Types.SaveDataType[]>;
  public abstract getSaveDataFromId(saveDataId: string): Promise<Types.SaveDataType>;
  public abstract addSaveData(saveData: Types.SaveDataType, readLogs?: Types.ReadLogType[]): Promise<void>;
  public abstract putSaveData(saveData: Types.SaveDataType, readLogs?: Types.ReadLogType[]): Promise<void>;
  public abstract deleteSaveDataFromId(saveDataId: string): Promise<void>;
  //#endregion

  //#region ReadLog
  public abstract getReadLogsFromSaveDataId(saveDataId: string): Promise<Types.ReadLogType[]>;
  public abstract pushReadLog(saveDataId: string, readLogs: Types.ReadLogType): Promise<void>;
  public abstract deleteReadLogsFromId(saveDataId: string): Promise<void>;
  //#endregion
}
