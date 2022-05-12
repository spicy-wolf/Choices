import React, { useEffect, useState } from 'react';
import './Main.scss';
import { RouterPathStrings } from '@src/Constants';
import { Content, SidePanel } from '..';
import { combinePath, useQuery } from '@src/Utils';
import {
  MainContext,
  MainContextType,
  SettingContext,
  ThemeContextType,
} from '@src/Context';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import * as RenderEngine from '@src/ContentRenderEngine';
import { useScriptLoader } from './Hooks/useScriptLoader';
import { Modal, Spinner } from 'react-bootstrap';

type StatementType = RenderEngine.Statements.AbstractStatementType;
type MainProps = {};

const MainContainer = (props: MainProps) => {
  let location = useLocation();
  let history = useHistory();

  //#region query param
  const query = useQuery();
  const src = query.get(RouterPathStrings.MAIN_PAGE_SRC_PARAM);
  const repoName = query.get(RouterPathStrings.MAIN_PAGE_REPO_PARAM);
  const authorName = query.get(RouterPathStrings.MAIN_PAGE_AUTHOR_PARAM);
  //#endregion

  //#region hooks
  let [scripts, scriptLoadingError] = useScriptLoader(src, repoName, authorName);
  //#endregion

  const loadingLabelOrErrorMsg = React.useMemo(() => {
    const errorMsg = scriptLoadingError;
    let loadingMsg = '';
    if (!scripts) {
      loadingMsg = 'Loading script.'
    }

    return loadingMsg || errorMsg;
  }, [scripts, scriptLoadingError]);

  if (!src && !repoName && !authorName) {
    return (
      <Redirect
        to={{
          pathname: RouterPathStrings.WELCOME_MODAL,
          state: { background: location },
        }}
      />
    );
  }

  return (
    <SettingContext>
      <LoadingIndicatorModal loadingLabel={loadingLabelOrErrorMsg} />
      <div id="main">
        {!loadingLabelOrErrorMsg && (
          <>
            <SidePanel />
            <Content scripts={scripts} />
          </>
        )}
      </div>
      {/* // TODO: add popup to paste URL */}
    </SettingContext>
  );
};

export default MainContainer;

const LoadingIndicatorModal = (props: { loadingLabel: string }) => {
  return (
    <Modal show={!!props.loadingLabel} backdrop="static" size="lg" centered>
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Loading</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>{props.loadingLabel}</p>
        </Modal.Body>

      </Modal.Dialog>
    </Modal>
  );
}
