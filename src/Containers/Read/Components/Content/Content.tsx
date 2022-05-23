import React, { useMemo, useState } from 'react';
import * as StatementEngine from '@src/StatementEngine';
import './Content.scss';
import { useSetting, useTheme } from '@src/Context';
import * as Types from '@src/Types';
import { VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

type AnyStatementType = Types.Statements.AnyStatementType;
type ContentProps = { scripts: AnyStatementType[] };

const Content = (props: ContentProps) => {
  const [statementCounter, setStatementCounter] = React.useState<number>(0);
  const [executeMore, setExecuteMore] = React.useState<boolean>(false);
  const [readingLogs, setReadingLogs] = React.useState<AnyStatementType[]>([]); // TODO: load history

  const [distanceToBottom, setDistanceToBottom] = React.useState<number>(0);

  const { contentBgColor, contentFontColor } = useTheme();
  const { fontSize } = useSetting();

  const contentRef = React.useRef<HTMLDivElement>();

  const rowHeights = React.useRef<number[]>([]);

  const readingLogsForRender = useMemo(() => {
    const _groupedReadingLogs = [];
    let group: Types.Statements.AnyStatementType[] = [];
    for (let log of readingLogs) {
      if (log.type === 'sentence' || log.type === 's') {
        // group sentences together
        group.push(log);
      } else {
        if (group.length > 0) {
          _groupedReadingLogs.push(group.slice());
          group = [];
        }
        _groupedReadingLogs.push([log]);
      }
    }
    console.log(_groupedReadingLogs);
    return _groupedReadingLogs;
  }, [readingLogs]);

  const itemCount: number = useMemo(
    () => (readingLogsForRender?.length || 0) + 1,
    [readingLogsForRender]
  );
  console.log(itemCount);

  const isItemLoaded = (index: number): boolean => {
    return !!readingLogsForRender?.[index];
  };

  const addReadingLogs = (pendingLogs: AnyStatementType[]): void => {
    let newLogs = [...readingLogs, ...pendingLogs];
    console.log(newLogs);
    setReadingLogs(newLogs);
  };

  const loadMoreItems = async (
    startIndex: number,
    stopIndex: number
  ): Promise<void> => {
    const currentScripts = props.scripts;
    for (let i = startIndex; i <= stopIndex && i < currentScripts.length; i++) {
      StatementEngine.Executor(currentScripts[i], {
        addReadingLogs,
        //setNextStatementById,
      });
    }
  };

  const listRef = React.useRef<List<any>>();
  const getItemSize = (index: number) => rowHeights.current[index] || 10;
  const setItemSize = (index: number, newHeight: number) => {
    const oldHeight = rowHeights.current[index];
    rowHeights.current[index] = newHeight;
    if (oldHeight !== newHeight) {
      if (listRef.current) listRef.current.resetAfterIndex(index);
    }
  };

  return (
    <div
      id="content"
      //onScroll={onScrollWrapper}
      ref={contentRef}
      style={{
        backgroundColor: contentBgColor,
        color: contentFontColor,
        fontSize: fontSize,
      }}
    >
      <div id="contentBody">
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <List
              height={600}
              width="100%"
              itemCount={itemCount}
              itemSize={getItemSize}
              onItemsRendered={onItemsRendered}
              ref={(list) => {
                ref(list);
                listRef.current = list;
              }}
            >
              {({ data, index, style }) => (
                <div style={style}>
                  <Row
                    data={readingLogsForRender[index]}
                    index={index}
                    setItemSize={setItemSize}
                  />
                </div>
              )}
            </List>
          )}
        </InfiniteLoader>
      </div>
    </div>
  );
};

const Row = (props: {
  data: AnyStatementType[];
  index: number;
  //style: React.CSSProperties;
  setItemSize: (index: number, height: number) => void;
}): JSX.Element => {
  const theStory = React.useMemo(() => {
    const result = props.data?.map((statement) => (
      <StatementEngine.RenderContent key={statement.id} {...statement} />
    ));
    return result;
  }, [props.data]);
  return (
    <div
      ref={(ref) => {
        if (ref) {
          console.log(ref);
          props.setItemSize(props.index, ref.getBoundingClientRect().height);
        }
      }}
      //style={styles.row}
    >
      {theStory}
    </div>
  );
};

export default Content;
