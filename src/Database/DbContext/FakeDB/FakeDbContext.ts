import * as Types from '../Types';
import { AbstractDbContext } from '../DbContext';
import FakeMetadata from '@resources/FakeMetadata.json';
import FakeScript from '@resources/FakeScript.json';
import FakeSaveData from '@resources/FakeSaveData.json';
import FakeReadLog from '@resources/FakeReadLog.json';
import { generateId } from '@src/Utils';

export class FakeDbContext extends AbstractDbContext {
  private metadataDb: Types.RepoMetadataType[] = [];
  private scriptDb: Types.ScriptType = [];
  private saveDataDb: Types.SaveDataType[] = [];
  private readLogDb: Types.ReadLogType[] = [];

  public constructor() {
    super();
  }
  public async init(): Promise<void> {
    // mock read DB
    this.metadataDb = [...FakeMetadata];

    this.scriptDb = [];
    for (let i = 0; i < FakeScript.length; i++) {
      this.scriptDb.push({
        ...(FakeScript as Types.ScriptType)[i],
        order: i,
      });
    }

    this.saveDataDb = [...FakeSaveData] as Types.SaveDataType[];
    this.readLogDb = [...(FakeReadLog as Types.ReadLogType[])];
  }

  //#region Metadata
  public async getAllMetadata(): Promise<Types.RepoMetadataType[]> {
    return [...this.metadataDb];
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
  public async getMetadataFromId(id: string): Promise<Types.RepoMetadataType> {
    let result = this.metadataDb.find((value) => value?.id === id);
    return result;
  }
  public async addMetadata(
    metaData: Types.RepoMetadataType,
    script?: Types.ScriptType
  ): Promise<string> {
    // generate an id
    metaData.id = generateId();
    this.metadataDb.push(metaData);

    if (script) {
      script.forEach((statement) => (statement.metadataId = metaData.id));
      this.scriptDb = this.scriptDb.concat(script);
    }

    return metaData.id;
  }
  public async deleteMetadataFromId(metadataId: string): Promise<void> {
    // delete save data and reading logs
    const saveDataList = await this.getAllSaveDataFromMetadataId(metadataId);
    saveDataList?.forEach(
      async (saveData) => await this.deleteSaveDataFromId(saveData?.id)
    );

    // delete metadata
    this.metadataDb = this.metadataDb.filter(
      (value) => value?.id !== metadataId
    );
  }
  //#endregion

  //#region Script
  public async getScriptFromMetadataId(
    metaDataId: string
  ): Promise<Types.ScriptType> {
    return this.scriptDb
      .filter((item) => item.metadataId === metaDataId)
      .sort((item1, item2) => item1.order - item2.order);
  }
  //#endregion

  //#region SaveData (included ReadLogs)
  public async getAllSaveDataFromMetadataId(
    metadataId: string
  ): Promise<Types.SaveDataType[]> {
    const result = this.saveDataDb.filter(
      (item) => item.metadataId === metadataId
    );
    return result;
  }
  public async getSaveDataFromId(
    saveDataId: string
  ): Promise<Types.SaveDataType> {
    const saveData = this.saveDataDb.find((item) => item.id === saveDataId);
    // find related reading logs
    if (saveData && saveData.id) {
      const readLogs = this.readLogDb
        .filter((item) => item.saveDataId === saveData.id)
        .sort((item1, item2) => item1.order - item2.order);
      saveData.readLogs = readLogs;
    }
    return saveData;
  }
  public async addSaveData(saveData: Types.SaveDataType): Promise<string> {
    saveData.id = saveData.id ?? generateId();
    saveData.createTimestamp = Date.now();
    await this.putSaveData(saveData);
    return saveData.id;
  }
  public async putSaveData(saveData: Types.SaveDataType): Promise<void> {
    const { readLogs, ...otherSaveData } = saveData;

    // check if existed
    const index = this.saveDataDb.findIndex(
      (item) => item.id === otherSaveData.id
    );
    if (index === -1) {
      // Add
      this.saveDataDb.push(otherSaveData);
    } else {
      // Put
      this.saveDataDb[index] = otherSaveData;
    }
    // reading log update
    readLogs?.forEach((newLog) => {
      if (
        !this.readLogDb.find(
          (oldLog) =>
            oldLog.saveDataId === newLog.saveDataId &&
            oldLog.order === newLog.order
        )
      ) {
        this.readLogDb.push({ ...newLog, saveDataId: saveData.id });
      }
    });
  }
  public async deleteSaveDataFromId(saveDataId: string): Promise<void> {
    this.saveDataDb = this.saveDataDb?.filter((item) => item.id !== saveDataId);
    this.readLogDb = this.readLogDb?.filter(
      (item) => item.saveDataId !== saveDataId
    );
  }
  //#endregion
}
