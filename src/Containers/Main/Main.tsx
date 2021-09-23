import React, { useEffect, useState } from 'react';
import './Main.scss';
import { Content, SidePanel } from '..';
import { combinePath, useQuery } from '@src/Utils';
import { MainContext, MainContextType } from '@src/Context';
import { matchPath } from 'react-router-dom';
import { request } from '@octokit/request';
import { Endpoints } from '@octokit/types';
import * as RenderEngine from '@src/ContentRenderEngine';
import { Base64 } from 'js-base64';

type RepoRequestParam =
  Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}']['parameters'];
type StatementType = RenderEngine.Statements.AbstractStatementType;
type MainProps = {};

const MainContainer = (props: MainProps) => {
  //#region query param
  const query = useQuery();
  const globalVersion = query.get('v');
  const src = query.get('src');
  const token = query.get('token');
  const { owner, repo, tree_sha } = getSrcInfo(src);

  if (!owner || !repo || !tree_sha) return <div>Error</div>;
  //#endregion

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);

  const [scripts, setScripts] = useState<StatementType[]>([]);

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
        headers: {
          authorization: token ? `token ${token}` : '',
        },
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

    const scripts: StatementType[] = [];
    fileBlobsResponse.forEach((file, idx) => {
      const encoding = file.data.encoding;
      if (encoding === 'base64') {
        const raw = Base64.decode(file.data.content as string);
        const jsonArray = JSON.parse(raw);
        if (jsonArray instanceof Array) {
          const statements = jsonArray as Array<any>;
          statements.forEach((rawStatement, index) => {
            // decorate and check raw statement
            const statement = RenderEngine.Statements.CompileAndCheck(
              rawStatement,
              {
                suggestId: `${file.data.sha}:${index}`,
                scriptPath: file.data.url,
                scriptSha: file.data.sha,
              }
            );
            scripts.push(statement);
          });
        } else {
          // throw exception
        }
      }
    });
    setScripts(scripts);

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
        {!isLoading && (
          <>
            <SidePanelControlBtn />
            <SidePanel isOpen={isSidePanelOpen} />
            <Content scripts={scripts} />
          </>
        )}
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
