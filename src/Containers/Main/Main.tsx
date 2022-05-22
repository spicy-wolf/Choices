import React from 'react';
import './Main.scss';
import { RouterPathStrings } from '@src/Constants';
import { useQuery } from '@src/Utils';
import { useNavigate, useLocation } from 'react-router-dom';
import useMetadataList from './Hooks/useMetadataList';
import { AddNewRepoModal, LoadingIndicatorModal } from '../Modal';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { RepoCard } from './Components/RepoCard';

const Main = () => {
  let location = useLocation();
  let navigate = useNavigate();

  //#region query param
  const query = useQuery();
  const src = query.get(RouterPathStrings.MAIN_PAGE_SRC_PARAM);
  //#endregion

  //#region state
  const [showAddModal, setShowAddModal] = React.useState<boolean>();
  //#endregion

  //#region hooks
  const [metadataList, metadataListLoadingError] = useMetadataList();
  //#endregion

  const loadingLabelOrErrorMsg = React.useMemo(() => {
    const errorMsg = metadataListLoadingError;
    let loadingMsg = '';
    if (!metadataList) {
      loadingMsg = 'Loading reading list.';
    }

    return errorMsg || loadingMsg;
  }, [metadataList, metadataListLoadingError]);

  const metadataElements: JSX.Element[] = React.useMemo(() => {
    let result: JSX.Element[] = [];
    if (metadataList) {
      result = metadataList.map((item) => (
        <RepoCard key={item.id} item={item} />
      ));
    }
    return result;
  }, [metadataList]);

  const onLoadScript = async () => {
    // TODO: loading indicator
    // TODO: load from source
    // TODO: update DB
    // TODO: done, jump to url
  };

  return (
    <>
      <LoadingIndicatorModal loadingLabel={loadingLabelOrErrorMsg} />
      {showAddModal && <AddNewRepoModal onLoad={onLoadScript} />}
      <div id="main">
        {!loadingLabelOrErrorMsg && (
          <Container>
            <Row className="d-flex align-items-stretch">{metadataElements}</Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default Main;
