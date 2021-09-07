import React, { useState } from 'react';
import './SidePanel.scss';

type SidePanelProps = { isOpen: boolean };

const SidePanel = (props: SidePanelProps) => {
  const sidePanelClassName = props.isOpen ? 'open' : 'closed';

  return (
    <div id="sidePanel" className={sidePanelClassName}>
      <div id="sidePanelBody" className={sidePanelClassName}></div>
    </div>
  );
};

export default SidePanel;
