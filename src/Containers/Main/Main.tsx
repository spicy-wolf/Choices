import React, { useEffect, useState } from 'react';
import './Main.scss';
import { Content, SidePanel } from '..';
import { useQuery } from '@src/Utils';
import type { MainContextType } from '@src/Context';
import { MainContextDefault } from '@src/Context';

type MainProps = {};

const MainContainer = (props: MainProps) => {
  //#region query param
  const query = useQuery();
  const globalVersion = query.get('v');
  const src = query.get('src');
  //#endregion

  //#region Context
  const MainContext = React.createContext<MainContextType>(MainContextDefault);
  //#endregion

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);

  const [scripts, setScripts] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    // TODO: load from DB, or from src
    // TODO: decorate script if first time
    // TODO: load history / save data
    setIsLoading(false);
  }, [src]);

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
