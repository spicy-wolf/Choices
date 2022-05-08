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

type StatementType = RenderEngine.Statements.AbstractStatementType;
type MainProps = {};

const MainContainer = (props: MainProps) => {
  let location = useLocation();
  let history = useHistory();

  //#region query param
  const query = useQuery();
  const src = query.get(RouterPathStrings.MAIN_PAGE_SRC_PARAM);
  //#endregion

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scripts, setScripts] = useState<StatementType[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setIsLoading(true);
    // TODO: load from DB, prev reading; or from src
    // TODO: decorate script if first time
    // TODO: load history / save data

    setScripts(scripts);
    setIsLoading(false);
  };

  if (!src) {
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
