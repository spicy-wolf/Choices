import React, { useEffect, useState } from 'react';
import './Main.scss';
import { Content, SidePanel } from '..';
import { combinePath, useQuery } from '@src/Utils';
import {
  MainContext,
  MainContextType,
  SettingContext,
  ThemeContextType,
} from '@src/Context';
import { matchPath, Redirect, useHistory, useLocation } from 'react-router-dom';
import * as RenderEngine from '@src/ContentRenderEngine';
import { Base64 } from 'js-base64';
import JSZip from 'jszip';

type StatementType = RenderEngine.Statements.AbstractStatementType;
type MainProps = {};

const MainContainer = (props: MainProps) => {
  let location = useLocation();
  let history = useHistory();

  //#region query param
  const query = useQuery();
  const globalVersion = query.get('v');
  const owner = query.get('owner');
  const repo = query.get('repo');
  const tree_sha = query.get('tree_sha');
  const src = query.get('src');
  const token = query.get('token');
  //#endregion

  if (!owner || !repo || !tree_sha) {
    return (
      <Redirect
        to={{
          pathname: '/WelcomeModal',
          state: { background: location },
        }}
      />
    );
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [scripts, setScripts] = useState<StatementType[]>([]);

  useEffect(() => {
    init();
  }, [owner, repo, tree_sha, src]);

  const init = async () => {
    setIsLoading(true);
    // TODO: load from DB, or from src
    // TODO: decorate script if first time
    // TODO: load history / save data

    if (src) {
      
    }
    return;

    setScripts(scripts);

    setIsLoading(false);
  };

  return (
    <MainContext.Provider value={{ v: globalVersion, src: src }}>
      <SettingContext>
        <div id="main">
          {!isLoading && (
            <>
              <SidePanel />
              <Content scripts={scripts} />
            </>
          )}
        </div>
        {/* // TODO: add popup to paste URL */}
      </SettingContext>
    </MainContext.Provider>
  );
};

export default MainContainer;

// TODO: remove me
// function getSrcInfo(src: string): RepoRequestParam {
//   try {
//     let url = new URL(src);

//     const match = matchPath<RepoRequestParam>(url.pathname ?? '', {
//       path: ['/:owner/:repo/tree/:tree_sha', '/:owner/:repo'],
//       exact: false,
//       strict: false,
//     });

//     const result = match.params;

//     if (!result.tree_sha) {
//       result.tree_sha = 'master'; // default to master
//     }
//     return result;
//   } catch (ex) {
//     console.error(ex);
//     return { owner: '', repo: '', tree_sha: '' };
//   }
// }
