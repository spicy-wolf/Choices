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
type PendingStatementType = Types.Statements.PendingStatementType;
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

  const [pendingStatement, setPendingStatement] =
    useState<PendingStatementType>();

  const contentRef = React.useRef<HTMLDivElement>();
  const infiniteLoaderRef = React.useRef<InfiniteLoader>();
  const listRef = React.useRef<List<any>>();
  const listInnerRef = React.useRef<HTMLDivElement>();

  const rowHeights = React.useRef<number[]>([]);

  // this value is a copy of initial logCursorPos, for restore prev reading position
  const initScrollToLogCursorPos = React.useRef<string>(props.logCursorPos);

  useEffect(() => {
    //#region scrolling to prev saved position -> 1st step -> scroll to the paragraph
    if (
      listRef.current &&
      listInnerRef.current &&
      initScrollToLogCursorPos.current
    ) {
      // find the group index which contains initScrollToLogCursorPos
      const index = props.groupedReadingLogs.findIndex(
        (item) =>
          !!item.find(
            (subItem) => subItem.id === initScrollToLogCursorPos.current
          )
      );
      if (index === -1) {
        // edge case, if cannot find the position, discard the value due to broken data
        initScrollToLogCursorPos.current = null;
      } else {
        listRef.current.scrollToItem(index, 'start');
        // Note: onScroll will be invoked next
      }
    }
    //#endregion
  }, []);

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

  // this "+1" has two use cases
  // 1. always assume there are some more statements to execute
  // 2. if there is a pending statement, then the itemCount == length of groupedReadingLogs + one pending statement
  //    which means the loadMoreItem will not be triggered
  const itemCount: number = useMemo(
    () => (props.groupedReadingLogs?.length || 0) + 1,
    [props.groupedReadingLogs]
  );

  const isItemLoaded = (index: number): boolean => {
    let isLoaded = !!props.groupedReadingLogs?.[index];
    if (props.groupedReadingLogs?.length === index && !!pendingStatement) {
      isLoaded = true;
    }
    return isLoaded;
  };

  const getRowData = (index: number): AnyStatementType[] => {
    // pendingStatement is always show at the end
    if (props.groupedReadingLogs?.length === index && !!pendingStatement) {
      return [pendingStatement];
    } else {
      return props.groupedReadingLogs[index];
    }
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
    const scripts = props.scripts;
    if (scripts.length === 0) return;

    const currentStatementId = props.scriptCursorPos;
    const currentStatementCursorIndex =
      scriptIdIndexDic[currentStatementId] ?? 0;
    let currentStatement: AnyStatementType =
      scripts[currentStatementCursorIndex];

    StatementEngine.Executor(currentStatement, {
      addReadingLogs,
      moveScriptCursor,
      setPendingStatement: setPendingStatementWrapper,
    });
  };

  // init to one line height, otherwise too many logs will be render as squished together
  const getItemSize = (index: number) => rowHeights.current[index] || 30;
  const setItemSize = (index: number, newHeight: number) => {
    const oldHeight = rowHeights.current[index];
    rowHeights.current[index] = newHeight;
    if (listRef.current && oldHeight !== newHeight)
      listRef.current.resetAfterIndex(index);
  };

  const onScroll = () => {
    //#region scrolling to prev saved position -> 2nd step -> scroll to sub sentense
    if (
      listInnerRef.current &&
      listRef.current &&
      initScrollToLogCursorPos.current
    ) {
      const targetElement = document.getElementById(
        initScrollToLogCursorPos.current
      );
      if (targetElement) {
        const offset = targetElement.getBoundingClientRect().top;
        const domRect = listInnerRef.current.getBoundingClientRect();
        listRef.current.scrollTo(Math.abs(domRect.y) + offset);
        // scrolling done, clear the value
        initScrollToLogCursorPos.current = null;
      }
    }
    //#endregion
  };

  //#region statement executor control callback methods
  const addReadingLogs = (pendingLogs: AnyStatementType[]): void => {
    props.pushReadingLogs(pendingLogs);
  };

  const moveScriptCursor = (statementId?: string): void => {
    if (statementId) {
      props.updateScriptCursorPos(statementId);
    } else {
      // if statementId is not given, then move to next
      const currentStatementId = props.scriptCursorPos;
      const nextStatementCursorIndex =
        scriptIdIndexDic[currentStatementId] >= 0
          ? scriptIdIndexDic[currentStatementId] + 1
          : 0;
      let nextStatement: AnyStatementType =
        props.scripts[nextStatementCursorIndex];
      props.updateScriptCursorPos(nextStatement?.id);
    }
  };

  const setPendingStatementWrapper = (
    pendingStatement: PendingStatementType
  ) => {
    setPendingStatement(pendingStatement);
  };
  //#endregion

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
              onScroll={onScroll}
              useIsScrolling={true}
              innerRef={listInnerRef}
              ref={(list) => {
                ref(list);
                listRef.current = list;
              }}
            >
              {({ index, style, isScrolling }) => (
                <div style={style}>
                  <ContentRow
                    data={getRowData(index)}
                    index={index}
                    isScrolling={isScrolling}
                    setItemSize={setItemSize}
                    setReadingLogCursorPos={props.updateLogCursorPos}
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
