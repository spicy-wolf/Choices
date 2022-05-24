import React, { useEffect, useMemo, useState } from 'react';
import * as StatementEngine from '@src/StatementEngine';
import './Content.scss';
import { useSetting, useTheme } from '@src/Context';
import * as Types from '@src/Types';
import { VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { ContentRow } from '../ContentRow/ContentRow';

type AnyStatementType = Types.Statements.AnyStatementType;
type ContentProps = { scripts: AnyStatementType[] };

const Content = (props: ContentProps) => {
  const [statementCounter, setStatementCounter] = React.useState<number>(0);
  const [readingLogs, setReadingLogs] = React.useState<AnyStatementType[]>([]); // TODO: load history

  const { contentBgColor, contentFontColor } = useTheme();
  const { fontSize } = useSetting();

  const contentRef = React.useRef<HTMLDivElement>();
  const infiniteLoaderRef = React.useRef<InfiniteLoader>();
  const listRef = React.useRef<List<any>>();

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
    // flush what is reminded in the group
    if (group.length > 0) {
      _groupedReadingLogs.push(group.slice());
      group = [];
    }

    return _groupedReadingLogs;
  }, [readingLogs]);

  const itemCount: number = (readingLogsForRender?.length || 0) + 1;

  const isItemLoaded = (index: number): boolean => {
    const isLoaded = !!readingLogsForRender?.[index];
    return isLoaded;
  };

  useEffect(() => {}, []);

  const addReadingLogs = (pendingLogs: AnyStatementType[]): void => {
    let newLogs = [...readingLogs, ...pendingLogs];
    setReadingLogs(newLogs);
  };

  /**
   * startIndex & stopIndex are useless in this function because each log of readingLogsForRender
   * is not one to one mapped to the scripts.
   * Therefore, if this function is invoked, then execute scripts until at least
   * on log is pushed to the readingLog
   *
   * @param startIndex useless in this case
   * @param stopIndex useless in this case
   */
  const loadMoreItems = async (
    startIndex: number,
    stopIndex: number
  ): Promise<void> => {
    // execute one script each time
    const currentScripts = props.scripts;
    StatementEngine.Executor(currentScripts[statementCounter], {
      addReadingLogs,
      //setNextStatementById,
    });
    setStatementCounter(statementCounter + 1);
  };

  // init to a very large height 100, otherwise too many logs will be render as squished together
  const getItemSize = (index: number) => rowHeights.current[index] || 100;
  const setItemSize = (index: number, newHeight: number) => {
    rowHeights.current[index] = newHeight;
    if (listRef.current) listRef.current.resetAfterIndex(index);
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
          ref={infiniteLoaderRef}
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
          minimumBatchSize={1}
          threshold={1} // increase retry bottom times
        >
          {({ onItemsRendered, ref }) => (
            <List
              height={600}
              width="100%"
              itemCount={itemCount}
              itemSize={getItemSize}
              onItemsRendered={onItemsRendered}
              onScroll={() => {}}
              ref={(list) => {
                ref(list);
                listRef.current = list;
              }}
            >
              {({ data, index, style }) => (
                <div style={style}>
                  <ContentRow
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

export default Content;
