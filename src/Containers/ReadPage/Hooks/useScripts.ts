/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { useEffect, useState } from 'react';
import { useDbContext } from '@src/Context/DbContext';
import * as Database from '@src/Database';

type ScriptType = Database.Types.ScriptType;

export const useScripts = (metadataId: string) => {
  const { dbContext } = useDbContext();
  const [scripts, setScripts] = useState<ScriptType>();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    load();

    return () => {
      setScripts(null);
      setError('');
    };
  }, [metadataId, dbContext]);

  const load = async () => {
    if (!dbContext) return;

    if (metadataId) {
      const _scripts: ScriptType = await dbContext.getScriptFromMetadataId(
        metadataId
      );
      if (_scripts) {
        setScripts(_scripts);
        setError('');
      } else {
        setError(`Unknown metadata id: ${metadataId}`);
      }
    }
  };

  return [scripts, error] as const;
};

