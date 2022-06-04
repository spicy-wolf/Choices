import * as Types from './Types';

export abstract class AbstractDbContext {
  public constructor() {}
  public abstract init(): Promise<void>;

  //#region Metadata
  public abstract getAllMetadata(): Promise<Types.RepoMetadataType[]>;
  public abstract getMetadata(
    author: string,
    repoName: string
  ): Promise<Types.RepoMetadataType>;
  public abstract getMetadataFromId(
    repoId: string
  ): Promise<Types.RepoMetadataType>;
  public abstract addMetadata(
    metaData: Types.RepoMetadataType,
    script?: Types.ScriptType
  ): Promise<string>; // return metaData id
  public abstract deleteMetadataFromId(metadataId: string): Promise<void>;
  //#endregion

  //#region Script
  public abstract getScriptFromMetadataId(
    metaDataId: string
  ): Promise<Types.ScriptType>;
  //#endregion

  //#region SaveData (included ReadLogs)
  public abstract getAllSaveDataFromMetadataId(
    metadataId: string
  ): Promise<Types.SaveDataType[]>;
  public abstract getAutoSaveDataFromMetadataId(
    metadataId: string
  ): Promise<Types.SaveDataType>;
  public abstract addSaveData(saveData: Types.SaveDataType): Promise<string>;
  public abstract putSaveData(saveData: Types.SaveDataType): Promise<void>;
  public abstract deleteSaveDataFromId(saveDataId: string): Promise<void>;
  //#endregion
}
