import * as Types from '@src/Types';

export abstract class DbContext {
  public constructor() { }

  //#region MetaData
  public abstract getAllMetaData(): Promise<Types.RepoMetadataType[]>;
  public abstract getMetaData(author: string, title: string): Promise<Types.RepoMetadataType>;
  public abstract getMetaDataFromRepoId(repoId: string): Promise<Types.RepoMetadataType>;
  public abstract addMetaData(metaData: Types.RepoMetadataType, script?: Types.ScriptType): Promise<string>; // return metaData id
  public abstract deleteMetaDataFromRepoId(repoId: string): Promise<void>;
  //#endregion

  //#region Script
  public abstract getScriptFromMetaDataId(metaDataId: string): Promise<Types.ScriptType>;
  public abstract updateScript(metaDataId: string, script: Types.ScriptType): Promise<void>;
  public abstract deleteScriptFromMetaDataId(metaDataId: string): Promise<void>;
  //#endregion

  //#region SaveData
  public abstract getSaveDataAll(): Promise<Types.SaveDataType[]>;
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
