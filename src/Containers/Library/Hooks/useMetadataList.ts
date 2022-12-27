import { useEffect, useState } from 'react';
import { useDbContext } from '@src/Context/DbContext';
import * as Database from '@src/Database';

type RepoMetadataType = Database.Types.RepoMetadataType;

const useMetadataList = () => {
  const { dbContext } = useDbContext();
  const [metadataList, setMetadataList] = useState<RepoMetadataType[]>();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    load();

    return () => {
      setMetadataList(null);
      setError('');
    };
  }, [dbContext]);

  const load = async () => {
    if (!dbContext) return;

    try {
      const _metadataList: RepoMetadataType[] =
        (await dbContext.getAllMetadata()) ?? [];
      setMetadataList(_metadataList);
    } catch (ex) {
      setError(ex);
    }
  };
  return [metadataList, error] as const;
};

export default useMetadataList;
