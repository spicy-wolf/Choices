import React, { useEffect, useMemo, useState } from 'react';
import * as StatementEngine from '@src/StatementEngine';
import './Content.scss';
import { useSetting, useTheme } from '@src/Context';
import * as Types from '@src/Types';
import {
  ListOnItemsRenderedProps,
  VariableSizeList as List,
} from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { ContentRow } from '../ContentRow/ContentRow';
import { useWindowSize } from '@src/Context/WindowSizeContext';

type AnyStatementType = Types.Statements.AnyStatementType;
type ContentProps = {
  scripts: AnyStatementType[];
  scriptCursorPos: string;
  updateScriptCursorPos: (_scriptCursorPos: string) => Promise<void>;
  logCursorPos: string;
  updateLogCursorPos: (_logCursorPos: string) => Promise<void>;
  saveDataContext: Types.SaveDataContext;
  updateSaveDataContext: (
    _saveDataContext: Types.SaveDataContext
  ) => Promise<void>;
  groupedReadingLogs: Types.ReadLogType[][];
  pushReadingLogs: (newLogs: Types.ReadLogType[]) => Promise<void>;
};

const Content = (props: ContentProps) => {
  const { contentBgColor, contentFontColor } = useTheme();
  const { fontSize } = useSetting();

  const contentRef = React.useRef<HTMLDivElement>();
  const infiniteLoaderRef = React.useRef<InfiniteLoader>();

  // TODO: move me to a better place
  const scriptIdIndexDic: { [key: string]: number } = useMemo(() => {
    let result = {};
    if (props.scripts && props.scripts.length > 0) {
      result = props.scripts.reduce<{ [key: string]: number }>(
        (dic, current, index) => {
          dic[current.id] = index;
          return dic;
        },
        {}
      );
    }
    return result;
  }, [props.scripts]);

  const itemCount: number = useMemo(
    () => (props.groupedReadingLogs?.length || 0) + 1,
    [props.groupedReadingLogs]
  );

  const isItemLoaded = (index: number): boolean => {
    const isLoaded = !!props.groupedReadingLogs?.[index];
    return isLoaded;
  };

  const addReadingLogs = (pendingLogs: AnyStatementType[]): void => {
    props.pushReadingLogs(pendingLogs);
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
    // execute one script each time / or execute to load at least 100 words
    const currentScripts = props.scripts;
    if (currentScripts.length === 0) return;

    let currentScript: AnyStatementType = null;
    if (props.scriptCursorPos) {
      const currentScriptCursorIndex =
        scriptIdIndexDic[props.scriptCursorPos] + 1; // move to next script
      currentScript = currentScripts[currentScriptCursorIndex];
    }
    currentScript = currentScript ?? currentScripts[0];

    StatementEngine.Executor(currentScript, {
      addReadingLogs,
      //setNextStatementById,
    });
    props.updateScriptCursorPos(currentScript.id);
  };

  return (
    <div
      id="content"
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
            <ContextInnerList
              itemData={props.groupedReadingLogs}
              itemCount={itemCount}
              onItemsRendered={onItemsRendered}
              listRef={ref}
            />
          )}
        </InfiniteLoader>
      </div>
    </div>
  );
};

const ContextInnerList = (props: {
  onItemsRendered: (props: ListOnItemsRenderedProps) => any;
  listRef: (ref: any) => void;
  itemData: Types.ReadLogType[][];
  itemCount: number;
}) => {
  const windowSize = useWindowSize();
  const listRef = React.useRef<List<any>>();
  const listInnerRef = React.useRef<HTMLDivElement>();
  const rowHeights = React.useRef<number[]>([]);

  useEffect(() => {
    if (listRef.current) {
      console.log(listRef.current);
      listRef.current.scrollToItem(5, 'start');
    }
  }, []);

  const onScroll = () => {
    // find the sentence which is on the top
    if (listInnerRef.current) {
    }
  };

  // init to a very large height 100, otherwise too many logs will be render as squished together
  const getItemSize = (index: number) => rowHeights.current[index] || 100;
  const setItemSize = (index: number, newHeight: number) => {
    rowHeights.current[index] = newHeight;
    if (listRef.current) listRef.current.resetAfterIndex(index);
  };

  return (
    <List
      height={windowSize.innerHeight}
      width="100%"
      itemCount={props.itemCount}
      itemSize={getItemSize}
      onItemsRendered={props.onItemsRendered}
      onScroll={onScroll}
      innerRef={listInnerRef}
      itemData={props.itemData}
      ref={(list) => {
        props.listRef(list);
        listRef.current = list;
      }}
    >
      {({ index, style, data }) => (
        <div style={style}>
          <ContentRow
            data={data[index]}
            index={index}
            setItemSize={setItemSize}
          />
        </div>
      )}
    </List>
  );
};

export default Content;
