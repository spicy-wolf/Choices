import React from 'react';
import * as StatementEngine from '@src/StatementEngine';

type AnyComponentType = StatementEngine.Types.AnyComponentType;

const ContentRow = (props: {
  data: AnyComponentType[];
  isScrolling?: boolean;
  setReadLogCursorPos?: (topScreenItemId: number) => void;
}): JSX.Element => {
  const rowRef = React.useRef<HTMLDivElement>();

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
            childDomRect.top <= 5 && // there is a slight gap between div and inner p, so use the baseline at y=5 instead if y=0
            childDomRect.bottom >= 5 &&
            order !== null
          ) {
            props.setReadLogCursorPos && props.setReadLogCursorPos(order);
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
