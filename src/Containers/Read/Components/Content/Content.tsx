import React, { useEffect, useMemo, useState } from 'react';
import * as StatementEngine from '@src/StatementEngine';
import './Content.scss';
import { useSetting, useTheme } from '@src/Context';
import * as Types from '@src/Types';
import { VariableSizeList as List } from 'react-window';
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
  const windowSize = useWindowSize();

  const contentRef = React.useRef<HTMLDivElement>();
  const infiniteLoaderRef = React.useRef<InfiniteLoader>();
  const listRef = React.useRef<List<any>>();

  const rowHeights = React.useRef<number[]>([]);

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

  // init to a very large height 100, otherwise too many logs will be render as squished together
  const getItemSize = (index: number) => rowHeights.current[index] || 100;
  const setItemSize = (index: number, newHeight: number) => {
    rowHeights.current[index] = newHeight;
    if (listRef.current) listRef.current.resetAfterIndex(index);
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
            <List
              height={windowSize.innerHeight}
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
              {({ index, style }) => (
                <div style={style}>
                  <ContentRow
                    data={props.groupedReadingLogs[index]}
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
