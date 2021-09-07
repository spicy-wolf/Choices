import React from 'react';
import { AbstractComponentType, ComponentVersions } from './Components';
import { ComponentTypeDic } from './ComponentTypeDic';

export type ScriptStatementType = AbstractComponentType | number | string;

export const RenderContentElement = (
  props: ScriptStatementType
): JSX.Element => {
  const preferedVersion: ComponentVersions = 'v1'; // TODO: get me from context

  if (props === null || props === undefined) return <></>;

  let ComponentToRender = null;

  switch (typeof props) {
    // case 'number':
    // case 'string':
    //   const paragraphProps = {
    //     type: 'Paragraph' as const, // https://stackoverflow.com/questions/37978528/typescript-type-string-is-not-assignable-to-type
    //     v: preferedVersion,
    //     text: props.toString(),
    //   };

    //   ComponentToRender = ComponentTypeDic['Paragraph'];
    //   return ComponentToRender(paragraphProps);
    case 'object':
      let statement = props as AbstractComponentType;
      ComponentToRender = ComponentTypeDic[statement.type];
      if (!ComponentToRender) return <></>;

      return ComponentToRender(props);
    default:
      return <></>;
  }
};
