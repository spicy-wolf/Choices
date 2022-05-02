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
import { request } from '@octokit/request';
import { Endpoints } from '@octokit/types';
import * as RenderEngine from '@src/ContentRenderEngine';
import { Base64 } from 'js-base64';
import axios from 'axios';
import JSZip from 'jszip';

type RepoRequestParam =
  Endpoints['GET /repos/{owner}/{repo}/git/trees/{tree_sha}']['parameters'];
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
      try {
        let response = await axios.get(src, {
          responseType: 'blob', // important
          // headers: {
          //   Accept: `application/octet-stream`,
          // },
        });
        let blob = new Blob([response.data]);
        let zip = new JSZip();
        let zipContents = await zip.loadAsync(blob);
      } catch (ex) {
        console.error(ex);
      }
    }
    return;

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
