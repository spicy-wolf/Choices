import React from 'react';
import * as Types from '@src/Types';
import * as StatementEngine from '@src/StatementEngine';

type AnyStatementType = Types.Statements.AnyStatementType;

const ContentRow = (props: {
  data: AnyStatementType[];
  index: number;
  isScrolling: boolean;
  setItemSize: (index: number, height: number) => void;
  setReadingLogCursorPos?: (topScreenItemId: string) => void;
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
          const childDomRect = child.getBoundingClientRect();
          if (childDomRect.top <= 0 && childDomRect.bottom >= 0) {
            props.setReadingLogCursorPos &&
              props.setReadingLogCursorPos(child.id);
            break;
          }
        }
      }
    }
  }, [props.isScrolling]);

  const theStory = React.useMemo(() => {
    const result = props.data?.map((statement) => (
      <StatementEngine.RenderContent key={statement.id} {...statement} />
    ));
    return result;
  }, [props.data]);

  return <div ref={rowRef}>{theStory}</div>;
};

export { ContentRow };
