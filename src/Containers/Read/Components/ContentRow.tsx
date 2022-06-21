import React from 'react';
import * as StatementEngine from '@src/StatementEngine';

type LogComponentType = StatementEngine.Types.LogComponentType;
type PauseComponentType = StatementEngine.Types.PauseComponentType;

const ContentRow = (props: {
  data: LogComponentType[] | PauseComponentType[];
  index: number;
  isScrolling: boolean;
  setItemSize: (index: number, height: number) => void;
  setReadingLogCursorPos?: (topScreenItemId: number) => void;
}): JSX.Element => {
  const rowRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (rowRef.current) {
      const domRect = rowRef.current.getBoundingClientRect();
      props.setItemSize(props.index, domRect.height);
    }
  }, [props.data, props.setItemSize, props.index]);

  React.useEffect(() => {
    if (props.isScrolling) return; // still scrolling, wait unit scrolling stoped

    // search from top of the dom
    // until the one on the top of the screen
    // TODO: useDebounce
    if (rowRef.current) {
      const domRect = rowRef.current.getBoundingClientRect();
      if (domRect.top <= 0 && domRect.bottom >= 0) {
        const childElements = rowRef.current.children;
        for (const child of childElements) {
          const order = StatementEngine.getLogOrderFromElement(child);
          const childDomRect = child.getBoundingClientRect();
          if (
            childDomRect.top <= 0 &&
            childDomRect.bottom >= 0 &&
            order !== null
          ) {
            props.setReadingLogCursorPos && props.setReadingLogCursorPos(order);
            break;
          }
        }
      }
    }
  }, [props.isScrolling]);

  const theStory = React.useMemo(() => {
    const result = props.data?.map((component, index) => (
      <StatementEngine.render
        key={component.order ?? `index-${index}`}
        {...component}
      />
    ));
    return result;
  }, [props.data]);

  return <div ref={rowRef}>{theStory}</div>;
};

export { ContentRow };
