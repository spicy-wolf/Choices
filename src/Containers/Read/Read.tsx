import React from 'react';
import './Read.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { RouterPathStrings } from '@src/Constants';
import { useQuery } from '@src/Utils';
import { useSetting } from '@src/Context';
import { LoadingIndicatorModal } from '@src/Containers/Modal';
import SidePanel from './Components/SidePanel/SidePanel';
import Content from './Components/Content/Content';
import { useMetadata } from './Hooks/useMetadata';
import { useScripts } from './Hooks/useScripts';
import { useAutoSaveDataLoader } from './Hooks/useAutoSaveDataLoader';

type ReadProps = {};

const Read = (props: ReadProps) => {
  //#region query param
  const query = useQuery();
  const repoName = query.get(RouterPathStrings.READ_PAGE_REPO_PARAM);
  const authorName = query.get(RouterPathStrings.READ_PAGE_AUTHOR_PARAM);
  //#endregion

  //#region hooks
  const [metadata, metadataLoadingError] = useMetadata(repoName, authorName);
  const [scripts, scriptLoadingError] = useScripts(metadata?.id);
  const [
    saveData,
    saveDataFunc,
    isAutoSaveDataLoaded,
    autoSaveDataLoaderError,
  ] = useAutoSaveDataLoader(metadata?.id);
  //#endregion

  const loadingLabelOrErrorMsg = React.useMemo(() => {
    const errorMsg =
      metadataLoadingError || scriptLoadingError || autoSaveDataLoaderError;
    let loadingMsg = '';
    if (!metadata) {
      loadingMsg = 'Loading metadata.';
    } else if (!scripts) {
      loadingMsg = 'Loading scripts.';
    } else if (!isAutoSaveDataLoaded) {
      loadingMsg = 'Loading save data.';
    }

    return errorMsg || loadingMsg;
  }, [
    metadata,
    scripts,
    isAutoSaveDataLoaded,
    metadataLoadingError,
    scriptLoadingError,
    autoSaveDataLoaderError,
  ]);

  return (
    <>
      <LoadingIndicatorModal loadingLabel={loadingLabelOrErrorMsg} />
      <div id="main">
        {!loadingLabelOrErrorMsg && (
          <>
            <SidePanel />
            <Content {...{ ...saveData, ...saveDataFunc }} scripts={scripts} />
          </>
        )}
      </div>
    </>
  );
};

export default Read;
