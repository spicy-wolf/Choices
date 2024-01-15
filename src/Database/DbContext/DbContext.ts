/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import * as Types from './Types';
import * as Utils from '@src/Utils';

export abstract class AbstractDbContext {
  public constructor() { }
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
    metadata: Types.RepoMetadataType,
    statements?: Types.StatementType[]
  ): Promise<string>; // return metadata id
  public abstract putMetadata(
    metadata: Types.RepoMetadataType,
    statements?: Types.StatementType[]
  ): Promise<string>;
  public abstract deleteMetadataFromId(metadataId: string): Promise<void>;
  //#endregion

  //#region Statements
  public abstract getStatementsFromMetadataId(
    metadataId: string
  ): Promise<Types.StatementType[]>;
  //#endregion

  //#region SaveData (included ReadLogs)
  public abstract getAllSaveDataFromMetadataId(
    metadataId: string
  ): Promise<Types.SaveDataType[]>;
  public abstract getSaveDataFromId(
    saveDataId: string
  ): Promise<Types.SaveDataType>;
  public abstract addSaveData(saveData: Types.SaveDataType): Promise<string>;
  public abstract putSaveData(saveData: Types.SaveDataType): Promise<void>;
  public abstract deleteSaveDataFromId(saveDataId: string): Promise<void>;
  //#endregion

  protected async digestMetadataId(
    author: string,
    repoName: string
  ): Promise<string> {
    const str = JSON.stringify({
      author: author?.trim(),
      repoName: repoName?.trim(),
    });
    if (!str) throw 'Invalid author or repo name';

    const metadataId = await Utils.digestString(str);
    return metadataId;
  }
}

