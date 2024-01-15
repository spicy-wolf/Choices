/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { useEffect, useState } from 'react';
import { useDbContext } from '@src/Context/DbContext';
import * as Database from '@src/Database';

type StatementType = Database.Types.StatementType;

export const useStatements = (metadataId: string) => {
  const { dbContext } = useDbContext();
  const [statements, setStatements] = useState<StatementType[]>();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    load();

    return () => {
      setStatements(null);
      setError('');
    };
  }, [metadataId, dbContext]);

  const load = async () => {
    if (!dbContext) return;

    if (metadataId) {
      const _statements: StatementType[] = await dbContext.getStatementsFromMetadataId(
        metadataId
      );
      if (_statements) {
        setStatements(_statements);
        setError('');
      } else {
        setError(`Unknown metadata id: ${metadataId}`);
      }
    }
  };

  return [statements, error] as const;
};

