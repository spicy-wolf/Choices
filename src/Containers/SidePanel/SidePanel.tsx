import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import './SidePanel.scss';
import 'bootstrap/scss/bootstrap.scss';
import { IoGitBranch, IoSettingsOutline } from 'react-icons/io5';
import SidePanelControlBtn from './SidePanelControlBtn/SidePanelControlBtn';

type SidePanelProps = {};

const SidePanel = (props: SidePanelProps) => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const toggleSidebar = (event: React.FormEvent<HTMLDivElement>) => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const sidePanelClassName = isSidePanelOpen ? 'open' : 'closed';

  return (
    <div id="sidePanel" className={sidePanelClassName}>
      <div id="sidePanelBody" className={sidePanelClassName}>
        <SidePanelControlBtn
          isSidePanelOpen={isSidePanelOpen}
          onClick={toggleSidebar}
        />
        <div className="h-100 p-1 d-flex flex-column" style={{ rowGap: '5px' }}>
          <div className="border rounded flex-grow-1 bg-light"></div>
          <div
            className="d-flex align-items-center justify-content-around border rounded bg-light"
            style={{ height: '50px' }}
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
