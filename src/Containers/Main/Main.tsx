import React, { useEffect, useState } from 'react';
import './Main.scss';
import { Content, SidePanel } from '..';
import { combinePath, useQuery } from '@src/Utils';
import { MainContext, MainContextType } from '@src/Context';
import axios from 'axios';
import { matchPath } from 'react-router-dom';
import { request } from '@octokit/request';
import { Endpoints } from '@octokit/types';
import { ScriptStatementType } from '@src/ContentRenderEngine';
import {
  AbstractComponentType,
  ComponentList,
} from '@src/ContentRenderEngine/Components';

type RepoRequestParam =
  Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}']['parameters'];
type MainProps = {};

const MainContainer = (props: MainProps) => {
  //#region query param
  const query = useQuery();
  const globalVersion = query.get('v');
  const src = query.get('src');
  const { owner, repo, tree_sha } = getSrcInfo(src);

  if (!owner || !repo || !tree_sha) return <div>Error</div>;
  //#endregion

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);

  const [scripts, setScripts] = useState([]);

  useEffect(() => {
    init(src);
  }, [src]);

  const init = async (_src: string) => {
    setIsLoading(true);
    // TODO: load from DB, or from src
    // TODO: decorate script if first time
    // TODO: load history / save data

    const response = await request(
      'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
      {
        repo: repo,
        owner: owner,
        tree_sha: tree_sha,
      }
    );

    let fileListPromises = response.data.tree.map((item) =>
      request('GET /repos/{owner}/{repo}/git/blobs/{file_sha}', {
        repo: repo,
        owner: owner,
        file_sha: item.sha,
      })
    );

    const fileBlobsResponse = await Promise.all(fileListPromises);

    console.log(fileBlobsResponse);

    const scripts: any[] = [];
    fileBlobsResponse.forEach((resp, idx) => {
      const encoding = resp.data.content;
      if (encoding === 'base64') {
        const raw = Buffer.from(resp.data.content as string, encoding).toString(
          'utf-8'
        );
        const jsonArray = JSON.parse(raw);
        if (jsonArray instanceof Array) {
          const statements = jsonArray as Array<ScriptStatementType>;
          for (const statement of statements) {
            // decorate and check raw statement, like compiler checking
            // e.g. assign id
          }
        } else {
          // throw exception
        }
      }
    });

    setScripts([]);

    setIsLoading(false);
  };

  const toggleSidebar = (event: React.FormEvent<HTMLDivElement>) => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const SidePanelControlBtn = () => (
    <div id="sidePanelControlBtn" className="icon" onClick={toggleSidebar}>
      &equiv;
    </div>
  );

  return (
    <MainContext.Provider value={{ v: globalVersion, src: src }}>
      <div id="main">
        <SidePanelControlBtn />
        <SidePanel isOpen={isSidePanelOpen} />
        <Content scripts={scripts} />
      </div>
      {/* // TODO: add popup to paste URL */}
    </MainContext.Provider>
  );
};

export default MainContainer;

function getSrcInfo(src: string): RepoRequestParam {
  try {
    let url = new URL(src);

    const match = matchPath<RepoRequestParam>(url.pathname ?? '', {
      path: ['/:owner/:repo/tree/:tree_sha', '/:owner/:repo'],
      exact: false,
      strict: false,
    });

    const result = match.params;

    if (!result.tree_sha) {
      result.tree_sha = 'master'; // default to master
    }
    return result;
  } catch (ex) {
    console.error(ex);
    return { owner: '', repo: '', tree_sha: '' };
  }
}

function decorateAndCheck(
  statement: ScriptStatementType
): AbstractComponentType {
  let result: AbstractComponentType = null;
  switch (typeof statement) {
    case 'string':
    case 'number':
    case 'object':
    default:
    // throw exception
  }
  return result;
}
