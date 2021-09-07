import type { ScriptStatementType } from '@src/ContentRenderEngine';
import { RenderContentElement } from '@src/ContentRenderEngine';
import React, { useState } from 'react';
import './Content.scss';

type ContentProps = { scripts: Array<ScriptStatementType> };

const Content = (props: ContentProps) => {
  return (
    <div id="content">
      <div id="contentBody">
        {props.scripts.map((script, index) => {
          return (
            <React.Fragment key={index}>
              {RenderContentElement(script)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Content;
