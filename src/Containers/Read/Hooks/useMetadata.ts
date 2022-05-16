import { useEffect, useState } from 'react';
import { useDbContext } from '@src/Context/DbContext';
import * as Types from '@src/Types';

type RepoMetadataType = Types.RepoMetadataType;

export const useMetadata = (repoName: string, authorName: string) => {
  const { dbContext } = useDbContext();
  const [metadata, setMetadata] = useState<RepoMetadataType>();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    load();

    return () => {
      setMetadata(null);
      setError('');
    };
  }, [repoName, authorName, dbContext]);

  const load = async () => {
    if (!dbContext) return;

    if (repoName && authorName) {
      const _metadata: RepoMetadataType = await dbContext.getMetadata(
        authorName,
        repoName
      );
      if (_metadata) {
        setMetadata(_metadata);
      } else {
        setError(`Unknown repoName: ${repoName} or authorName: ${authorName}`);
      }
    } else {
      setError(`Missing repoName: ${repoName} or authorName: ${authorName}`);
    }
  };

  return [metadata, error] as const;
};
