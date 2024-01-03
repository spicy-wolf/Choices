/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { useEffect, useState } from 'react';
import { useDbContext } from '@src/Context/DbContext';
import * as Database from '@src/Database';

type RepoMetadataType = Database.Types.RepoMetadataType;
type ScriptType = Database.Types.ScriptType;

const useMetadataList = () => {
  const { dbContext } = useDbContext();
  const [metadataList, setMetadataList] = useState<RepoMetadataType[]>();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadMetadataList();

    return () => {
      setMetadataList(null);
      setError('');
    };
  }, [dbContext]);

  const loadMetadataList = async () => {
    if (!dbContext) return;

    try {
      const _metadataList: RepoMetadataType[] =
        (await dbContext.getAllMetadata()) ?? [];
      setMetadataList([..._metadataList]);
    } catch (ex) {
      setError(ex);
    }
  };

  const addMetadataWithScript = async (
    metaData: RepoMetadataType,
    script?: ScriptType
  ): Promise<string> => {
    if (!dbContext) return;
    try {
      const result = await dbContext.addMetadata(metaData, script);
      await loadMetadataList();

      return result;
    } catch (ex) {
      setError(ex);
    }
  };

  const putMetadataWithScript = async (
    metaData: RepoMetadataType,
    script?: ScriptType
  ): Promise<string> => {
    if (!dbContext) return;
    try {
      const result = await dbContext.putMetadata(metaData, script);
      await loadMetadataList();

      return result;
    } catch (ex) {
      setError(ex);
    }
  };

  const deleteMetadataWithScript = async (metaDataId: string): Promise<void> => {
    if (!dbContext) return;
    try {
      await dbContext.deleteMetadataFromId(metaDataId);
      await loadMetadataList();
    } catch (ex) {
      setError(ex);
    }
  };

  return { metadataList, addMetadataWithScript, putMetadataWithScript, deleteMetadataWithScript, error };
};

export default useMetadataList;

