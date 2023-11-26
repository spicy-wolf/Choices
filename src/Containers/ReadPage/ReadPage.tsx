import React, { useEffect, useState } from 'react';
import { RouterPathStrings } from '@src/Constants';
import { useQuery } from '@src/Utils';
import { LoadingIndicatorModal } from '@src/Containers/components';
import SidePanel from './Components/SidePanel';
import Content from './Components/Content';
import { useMetadata } from './Hooks/useMetadata';
import { useScripts } from './Hooks/useScripts';
import { useSaveData } from './Hooks/useSaveData';
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
    {
      saveDataList,
      createSaveData,
      loadSaveData,
      deleteSaveData,
      defaultSaveData,
      setDefaultSaveData,
    },
    saveDataLoadingError,
  ] = useSaveData(metadata?.id);
  const { contentStyles } = useSetting();
  //#endregion

  const [loadingMsg, setLoadingMsg] = useState<string>();

  const loadingLabel = React.useMemo(() => {
    let _loadingMsg = '';
    if (!metadata) {
      _loadingMsg = 'Loading metadata.';
    } else if (!scripts) {
      _loadingMsg = 'Loading scripts.';
    } else if (!saveDataList || saveDataList.length === 0 || !defaultSaveData) {
      _loadingMsg = 'Loading save data.';
    }

    return _loadingMsg || loadingMsg;
  }, [metadata, scripts, saveDataList, defaultSaveData, loadingMsg]);

  const loadingError = React.useMemo(() => {
    return metadataLoadingError || scriptLoadingError || saveDataLoadingError;
  }, [metadataLoadingError, scriptLoadingError, saveDataLoadingError]);

  useEffect(() => {
    if (!!loadingLabel || !!loadingError) {
      setShowLoadingModal(true);
    } else {
      setShowLoadingModal(false);
    }
  }, [loadingLabel, loadingError]);

  useEffect(() => {
    if (!saveDataList || saveDataList.length === 0) return;
  }, [saveDataList]);

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
            <SidePanel
              defaultSaveData={defaultSaveData}
              loadSaveData={loadSaveData}
              createSaveData={createSaveData}
              deleteSaveData={deleteSaveData}
              saveDataList={saveDataList}
              setLoadingMsg={setLoadingMsg}
            />
            <Content
              key={defaultSaveData?.id}
              scripts={scripts}
              saveData={defaultSaveData}
              setSaveData={setDefaultSaveData}
            />
          </>
        )}
      </Container>
    </div>
  );
};

export default ReadPage;
