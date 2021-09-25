import React, { useState } from 'react';
import './SidePanelControlBtn.scss';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

type SidePanelControlBtnProps = {
  isSidePanelOpen: boolean;
  onClick: (event: React.FormEvent<HTMLDivElement>) => void;
};
const SidePanelControlBtn = (props: SidePanelControlBtnProps) => (
  <div id="sidePanelControlBtn" className="icon" onClick={props.onClick}>
    {props.isSidePanelOpen ? (
      <IoChevronBackOutline size="2em" />
    ) : (
      <IoChevronForwardOutline size="2em" />
    )}
  </div>
);

export default SidePanelControlBtn;
