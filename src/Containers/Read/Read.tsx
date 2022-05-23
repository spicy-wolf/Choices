import React from 'react';
import './Read.scss';
import { RouterPathStrings } from '@src/Constants';
import { useQuery } from '@src/Utils';
import { useSetting } from '@src/Context';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Spinner } from 'react-bootstrap';
import { useMetadata } from './Hooks/useMetadata';
import { useScripts } from './Hooks/useScripts';
import { LoadingIndicatorModal } from '../Modal';
import SidePanel from './Components/SidePanel/SidePanel';
import Content from './Components/Content/Content';

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
  // const [readingLogs, readingLogsLoadingError] = useReadingLogsLoader(
  //   repoName,
  //   authorName
  // );
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
            {scripts && scripts.length > 0 && <Content scripts={scripts} />}
          </>
        )}
      </div>
    </>
  );
};

export default Read;
