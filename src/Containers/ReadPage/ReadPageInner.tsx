import React, { useEffect, useState } from 'react';
import { LoadingIndicatorModal } from '@src/Containers/components';
import SidePanel from './Components/SidePanel';
import Content from './Components/Content';
import { useMetadata } from './Hooks/useMetadata';
import { useStatements } from './Hooks/useStatements';
import { useSaveData } from './Hooks/useSaveData';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { useSetting } from '@src/Context';

type ReadPageInnerProps = {
  repoName: string;
  authorName: string;
};
export const ReadPageInner = (props: ReadPageInnerProps) => {

  //#region hooks
  const [showLoadingModal, setShowLoadingModal] = React.useState<boolean>(false);
  const [metadata, metadataLoadingError] = useMetadata(props.repoName, props.authorName);
  const [statements, statementLoadingError] = useStatements(metadata?.id);
  const [
    {
      saveDataList, createSaveData, loadSaveData, deleteSaveData, defaultSaveData, setDefaultSaveData,
    }, saveDataLoadingError,
  ] = useSaveData(metadata?.id);
  const { contentStyles } = useSetting();
  //#endregion
  const [loadingMsg, setLoadingMsg] = useState<string>();

  const loadingLabel = React.useMemo(() => {
    let _loadingMsg = '';
    if (!metadata) {
      _loadingMsg = 'Loading metadata.';
    } else if (!statements) {
      _loadingMsg = 'Loading statements.';
    } else if (!saveDataList || saveDataList.length === 0 || !defaultSaveData) {
      _loadingMsg = 'Loading save data.';
    }

    return _loadingMsg || loadingMsg;
  }, [metadata, statements, saveDataList, defaultSaveData, loadingMsg]);

  const loadingError = React.useMemo(() => {
    return metadataLoadingError || statementLoadingError || saveDataLoadingError;
  }, [metadataLoadingError, statementLoadingError, saveDataLoadingError]);

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
        error={loadingError} />
      <Container>
        {!loadingLabel && !loadingError && (
          <>
            <SidePanel
              defaultSaveData={defaultSaveData}
              loadSaveData={loadSaveData}
              createSaveData={createSaveData}
              deleteSaveData={deleteSaveData}
              saveDataList={saveDataList}
              setLoadingMsg={setLoadingMsg} />
            <Content
              key={defaultSaveData?.id}
              statements={statements}
              saveData={defaultSaveData}
              setSaveData={setDefaultSaveData} />
          </>
        )}
      </Container>
    </div>
  );
};
