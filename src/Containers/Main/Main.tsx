import React from 'react';
import './Main.scss';
import { RouterPathStrings } from '@src/Constants';
import { useQuery } from '@src/Utils';
import { useHistory, useLocation } from 'react-router-dom';
import useMetadataList from './Hooks/useMetadataList';
import { AddNewRepoModal, LoadingIndicatorModal } from '../Modal';
import { Card, Col, Container, Row } from 'react-bootstrap';

const Main = () => {
  let location = useLocation();
  let history = useHistory();

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
        <Col key={item.id} className="pb-3 d-flex">
          <Card className="w-100">
            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
            <Card.Body>
              <Card.Title>{item.repoName}</Card.Title>
              <Card.Text className="text-muted">{item.author}</Card.Text>
              <Card.Text className="max-three-lines py-1">
                {item.description}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ));
    }
    // add "Add button"
    result.push(
      <Col className="pb-3 d-flex">
        <Card className="w-100 align-content-center align-items-center text-center">
          <Card.Body>
            <Card.Title>Add New</Card.Title>
            <span>&#43;</span>
          </Card.Body>
        </Card>
      </Col>
    );
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
            <Row
              xxl={5}
              lg={4}
              md={3}
              xs={1}
              className="d-flex flex-wrap align-items-stretch"
            >
              {metadataElements}
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default Main;
