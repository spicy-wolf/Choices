import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import './SidePanel.scss';
import 'bootstrap/scss/bootstrap.scss';
import { IoGitBranch, IoSettingsOutline } from 'react-icons/io5';
import SidePanelControlBtn from './SidePanelControlBtn/SidePanelControlBtn';
import { useTheme } from '@src/Context';
import { SettingPanel } from './SettingPanel';

type SidePanelProps = {};

const SidePanel = (props: SidePanelProps) => {
  const { sidePanelBgColor, sidePanelSectionColor, sidePanelFontColor } =
    useTheme();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const toggleSidebar = (event: React.FormEvent<HTMLDivElement>) => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const sidePanelClassName = isSidePanelOpen ? 'open' : 'closed';

  return (
    <div
      id="sidePanel"
      className={sidePanelClassName}
      style={{ color: sidePanelFontColor }}
    >
      <div id="sidePanelBody" className={sidePanelClassName}>
        <SidePanelControlBtn
          bgColor={sidePanelBgColor}
          isSidePanelOpen={isSidePanelOpen}
          onClick={toggleSidebar}
        />
        <div
          className="h-100 p-1 d-flex flex-column"
          style={{ backgroundColor: sidePanelBgColor }}
        >
          <div
            className="flex-grow-1"
            style={{ backgroundColor: sidePanelSectionColor }}
          >
            <SettingPanel />
          </div>
          <div
            className="d-flex align-items-center justify-content-around"
            style={{ height: '50px', backgroundColor: sidePanelSectionColor }}
          >
            <div>
              <IoGitBranch size="2em" />
            </div>
            <div>
              <IoSettingsOutline size="2em" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
