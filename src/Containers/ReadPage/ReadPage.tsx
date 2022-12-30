import React, { useEffect } from 'react';
import { RouterPathStrings } from '@src/Constants';
import { useQuery } from '@src/Utils';
import LoadingIndicatorModal from '@src/Containers/LoadingIndicatorModal/LoadingIndicatorModal';
import SidePanel from './Components/SidePanel';
import Content from './Components/Content';
import { useMetadata } from './Hooks/useMetadata';
import { useScripts } from './Hooks/useScripts';
import { useAutoSaveDataLoader } from './Hooks/useAutoSaveDataLoader';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { useSetting } from '@src/Context';

const ReadPage = () => {
  //#region query param
  const query = useQuery();
  const repoName = query.get(RouterPathStrings.READ_PAGE_REPO_PARAM);
  const authorName = query.get(RouterPathStrings.READ_PAGE_AUTHOR_PARAM);
  //#endregion

  //#region hooks
  const [showLoadingModal, setShowLoadingModal] =
    React.useState<boolean>(false);
  const [metadata, metadataLoadingError] = useMetadata(repoName, authorName);
  const [scripts, scriptLoadingError] = useScripts(metadata?.id);
  const [
    saveData,
    saveDataFunc,
    isAutoSaveDataLoaded,
    autoSaveDataLoaderError,
  ] = useAutoSaveDataLoader(metadata?.id);
  const { contentStyles } = useSetting();
  //#endregion

  const loadingLabel = React.useMemo(() => {
    let loadingMsg = '';
    if (!metadata) {
      loadingMsg = 'Loading metadata.';
    } else if (!scripts) {
      loadingMsg = 'Loading scripts.';
    } else if (!isAutoSaveDataLoaded) {
      loadingMsg = 'Loading save data.';
    }

    return loadingMsg;
  }, [metadata, scripts, isAutoSaveDataLoaded]);

  const loadingError = React.useMemo(() => {
    const errorMsg =
      metadataLoadingError || scriptLoadingError || autoSaveDataLoaderError;
    return errorMsg;
  }, [metadataLoadingError, scriptLoadingError, autoSaveDataLoaderError]);

  useEffect(() => {
    if (!!loadingLabel || !!loadingError) {
      setShowLoadingModal(true);
    } else {
      setShowLoadingModal(false);
    }
  }, [loadingLabel, loadingError]);

  return (
    <div style={{ backgroundColor: contentStyles.backgroundColor }}>
      <CssBaseline />
      <LoadingIndicatorModal
        open={showLoadingModal}
        handleClose={() => setShowLoadingModal(false)}
        loadingLabel={loadingLabel}
        error={loadingError}
      />
      <Container>
        {!loadingLabel && !loadingError && (
          <>
            <SidePanel />
            <Content {...{ ...saveData, ...saveDataFunc }} scripts={scripts} />
          </>
        )}
      </Container>
    </div>
  );
};

export default ReadPage;
