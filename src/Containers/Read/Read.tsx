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
  let location = useLocation();
  let navigate = useNavigate();

  //#region query param
  const query = useQuery();
  const repoName = query.get(RouterPathStrings.READ_PAGE_REPO_PARAM);
  const authorName = query.get(RouterPathStrings.READ_PAGE_AUTHOR_PARAM);
  //#endregion

  //#region hooks
  const { themeName, fontSize } = useSetting();
  const [metadata, metadataLoadingError] = useMetadata(repoName, authorName);
  const [scripts, scriptLoadingError] = useScripts(metadata?.id);
  const [saveData, saveDataFunc, autoSaveDataLoaderError] =
    useAutoSaveDataLoader(metadata?.id);
  //#endregion

  const loadingLabelOrErrorMsg = React.useMemo(() => {
    const errorMsg = metadataLoadingError || scriptLoadingError;
    let loadingMsg = '';
    if (!metadata) {
      loadingMsg = 'Loading metadata.';
    } else if (!scripts) {
      loadingMsg = 'Loading scripts.';
    }

    return errorMsg || loadingMsg;
  }, [scripts, scriptLoadingError]);

  return (
    <>
      <LoadingIndicatorModal loadingLabel={loadingLabelOrErrorMsg} />
      <div id="main">
        {!loadingLabelOrErrorMsg && (
          <>
            <SidePanel />
            <Content scripts={scripts} />
          </>
        )}
      </div>
    </>
  );
};

export default Read;
