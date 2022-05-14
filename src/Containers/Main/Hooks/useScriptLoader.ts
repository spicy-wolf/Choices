import { useEffect, useState } from 'react';
import { useDbContext } from '@src/Context/DbContext';
import * as Types from '@src/Types';

type AnyStatementType = Types.Statements.AnyStatementType;

export const useScriptLoader = (
  src: string,
  repoName: string,
  authorName: string
) => {
  const { dbContext } = useDbContext();
  const [scripts, setScripts] = useState<AnyStatementType[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    load();

    return () => {
      setScripts([]);
      setError('');
    };
  }, [src, repoName, authorName, dbContext]);

  const load = async () => {
    if (!dbContext) return;

    let _script: AnyStatementType[] = undefined;
    if (repoName && authorName) {
      const metadata = await dbContext.getMetadata(authorName, repoName);
      if (metadata && metadata.id) {
        _script = await dbContext.getScriptFromMetadataId(metadata.id);
      }
    }

    if (_script === undefined && src) {
      // TODO: load from src
    }

    if (!_script) {
      setError(`Cannot load script from [${repoName}, ${authorName}]: ${src}.`);
    } else {
      setScripts(_script);
    }
  };

  return [scripts, error] as const;
};
