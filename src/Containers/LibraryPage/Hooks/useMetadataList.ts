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
type StatementType = Database.Types.StatementType;

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

  const addMetadata = async (
    metaData: RepoMetadataType,
    statements?: StatementType[]
  ): Promise<string> => {
    if (!dbContext) return;
    try {
      const result = await dbContext.addMetadata(metaData, statements);
      await loadMetadataList();

      return result;
    } catch (ex) {
      setError(ex);
    }
  };

  const putMetadata = async (
    metaData: RepoMetadataType,
    statements?: StatementType[]
  ): Promise<string> => {
    if (!dbContext) return;
    try {
      const result = await dbContext.putMetadata(metaData, statements);
      await loadMetadataList();

      return result;
    } catch (ex) {
      setError(ex);
    }
  };

  const deleteMetadata = async (metaDataId: string): Promise<void> => {
    if (!dbContext) return;
    try {
      await dbContext.deleteMetadataFromId(metaDataId);
      await loadMetadataList();
    } catch (ex) {
      setError(ex);
    }
  };

  return { metadataList, addMetadata, putMetadata, deleteMetadata, error };
};

export default useMetadataList;

