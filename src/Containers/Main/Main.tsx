import React from 'react';
import './Main.scss';
import { RouterPathStrings } from '@src/Constants';
import * as Utils from '@src/Utils';
import { useNavigate, useLocation } from 'react-router-dom';
import useMetadataList from './Hooks/useMetadataList';
import { AddNewRepoModal, LoadingIndicatorModal } from '../Modal';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { RepoCard } from './Components/RepoCard';
import {
  FloatingButtonEnum,
  FloatingButtonGroup,
} from './Components/FloatingButtonGroup';
import { Types } from '@src/Database';
import { useDbContext } from '@src/Context/DbContext';

const Main = () => {
  const { dbContext } = useDbContext();
  let location = useLocation();
  let navigate = useNavigate();

  //#region query param
  const query = Utils.useQuery();
  const src = query.get(RouterPathStrings.MAIN_PAGE_SRC_PARAM);
  //#endregion

  //#region state
  const [showAddModal, setShowAddModal] = React.useState<boolean>();
  const [repoLoadingMsg, setRepoLoadingMsg] = React.useState<string>();
  const [repoLoadingErrorMsg, setRepoLoadingErrorMsg] =
    React.useState<string>();
  //#endregion

  //#region hooks
  const [metadataList, metadataListLoadingError] = useMetadataList();
  //#endregion

  const loadingLabelOrErrorMsg = React.useMemo(() => {
    const errorMsg = metadataListLoadingError;
    let loadingMsg = '' || repoLoadingMsg;
    if (!metadataList) {
      loadingMsg = 'Loading reading list.';
    }

    return errorMsg || loadingMsg;
  }, [metadataList, metadataListLoadingError, repoLoadingMsg]);

  const metadataElements: JSX.Element[] = React.useMemo(() => {
    let result: JSX.Element[] = [];
    if (metadataList) {
      result = metadataList.map((item) => (
        <RepoCard key={item.id} item={item} />
      ));
    }
    return result;
  }, [metadataList]);

  const onLoadFromUrl = async (urlStr: string, urlAccessToken: string) => {
    // hide add modal
    setShowAddModal(false);

    try {
      setRepoLoadingMsg(`Download script`);
      const url = new URL(urlStr);

      if (!url) throw 'Invalid Url';

      let jsonObj: any = null;
      if (url.host === 'api.github.com') {
        // github API
        // https://docs.github.com/cn/rest/repos/contents#get-repository-content
        const httpHeader: HeadersInit = {
          Accept: 'application/vnd.github.v3.raw',
        };
        if (urlAccessToken) {
          httpHeader.Authorization = `token ${urlAccessToken}`;
        }

        const response = await fetch(urlStr, {
          method: 'GET',
          mode: 'cors',
          referrerPolicy: 'no-referrer',
          headers: httpHeader,
        });
        jsonObj = await response.json();
      } else {
        const response = await fetch(urlStr, {
          method: 'GET',
        });
        jsonObj = await response.json();
      }

      await onLoadFromJsonObj(jsonObj);
    } catch (ex) {
      setRepoLoadingErrorMsg(ex);
    } finally {
      setRepoLoadingMsg('');
    }
  };

  const onLoadFromFile = async (sourceFile: Blob) => {
    // hide add modal
    setShowAddModal(false);
    setRepoLoadingMsg(`Parse file`);

    try {
      const json = JSON.parse(await sourceFile.text());
      await onLoadFromJsonObj(json);
    } catch (ex) {
      setRepoLoadingErrorMsg(ex);
    } finally {
      setRepoLoadingMsg('');
    }
  };

  const onLoadFromJsonObj = async (jsonObj: any) => {
    const metadata = jsonObj?.metadata;
    const script = jsonObj?.script;
    if (!metadata || !script) {
      throw `Invalid data. please make sure data has 'metadata' and 'script'`;
    }

    // TODO: validation

    // insert into DB
    setRepoLoadingMsg('Update DB');
    dbContext.addMetadata(metadata, script);
  };

  const onFloatingButtonClick = (buttonName: FloatingButtonEnum) => {
    switch (buttonName) {
      case FloatingButtonEnum.AddButton:
        // show add repo modal
        setShowAddModal(true);
        break;
      case FloatingButtonEnum.SettingButton:
        // show setting modal
        break;
      default:
        break;
    }
  };

  return (
    <>
      <LoadingIndicatorModal loadingLabel={loadingLabelOrErrorMsg} />
      <AddNewRepoModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onLoadFromUrl={onLoadFromUrl}
        onLoadFromFile={onLoadFromFile}
      />
      <div id="main">
        {!loadingLabelOrErrorMsg && (
          <>
            <Container>
              <Row className="d-flex align-items-stretch">
                {metadataElements}
              </Row>
            </Container>
            <FloatingButtonGroup onClick={onFloatingButtonClick} />
          </>
        )}
      </div>
    </>
  );
};

export default Main;
