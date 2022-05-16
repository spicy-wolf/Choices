import React, { useState } from 'react';
import './SidePanelControlBtn.scss';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

type SidePanelControlBtnProps = {
  bgColor: string;
  isSidePanelOpen: boolean;
  onClick: (event: React.FormEvent<HTMLDivElement>) => void;
};
const SidePanelControlBtn = (props: SidePanelControlBtnProps) => (
  <div
    id="sidePanelControlBtn"
    className="icon"
    onClick={props.onClick}
    style={{ backgroundColor: props.bgColor }}
  >
    {props.isSidePanelOpen ? (
      <IoChevronBackOutline size="2em" />
    ) : (
      <IoChevronForwardOutline size="2em" />
    )}
  </div>
);

export default SidePanelControlBtn;
