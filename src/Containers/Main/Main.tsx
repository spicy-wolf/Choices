import React, { useEffect, useState } from 'react';
import './Main.scss';
import { Content, SidePanel } from '..';
import { combinePath, useQuery } from '@src/Utils';
import { MainContext, MainContextType } from '@src/Context';
import axios from 'axios';

type MainProps = {};

const MainContainer = (props: MainProps) => {
  //#region query param
  const query = useQuery();
  const globalVersion = query.get('v');
  const src = query.get('src');
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
    // TODO: maybe https://github.com/octokit/octokit.js

    let srcUrl = new URL(src);
    let host = srcUrl.host;
    if (host === 'github.com') {
      const apiHost = 'https://api.github.com/';
      let pathname = srcUrl.pathname;

      const getTreeUrl =
        apiHost + combinePath('repos', pathname, 'git/trees', 'master');

      let response = await axios.get(getTreeUrl, {
        params: {
          recursive: 1,
        },
      });

      let data = response.data as {
        sha: string;
        url: string;
        tree: Array<{
          path: string;
          mode: string;
          type: string;
          sha: string;
          size: number;
          url: string;
        }>;
      };

      let fileList = data.tree.map((item) =>
        axios.get(item.url, {
          headers: {
            Accept: 'application/vnd.github.v3.raw',
          },
        })
      );

      let fileContentRaw = await Promise.all(fileList);

      console.log(fileContentRaw);

      setScripts(fileContentRaw[0].data);
    }

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
    </MainContext.Provider>
  );
};

export default MainContainer;
