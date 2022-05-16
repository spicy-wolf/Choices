import { useEffect, useState } from 'react';
import { useDbContext } from '@src/Context/DbContext';
import * as Types from '@src/Types';

type ScriptType = Types.ScriptType;

export const useScripts = (metadataId: string) => {
  const { dbContext } = useDbContext();
  const [scripts, setScripts] = useState<ScriptType>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    load();

    return () => {
      setScripts([]);
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
      } else {
        setError(`Unknown metadata id: ${metadataId}`);
      }
    } else {
      setError(`Missing metadata id: ${metadataId}`);
    }
  };

  return [scripts, error] as const;
};
