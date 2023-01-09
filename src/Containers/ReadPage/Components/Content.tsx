import React, { Dispatch, useEffect, useMemo, useState } from 'react';
import * as StatementEngine from '@src/StatementEngine';
import './Content.scss';
import * as Database from '@src/Database';
import { ContentRow } from './ContentRow';
import { useWindowSize } from '@src/Context/WindowSizeContext';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { useSetting } from '@src/Context';
import { SaveDataDispatchType } from '../Hooks/useSaveDataReducer';

type AnyStatementType = StatementEngine.Types.AnyStatementType;
type LogComponentType = StatementEngine.Types.LogComponentType;
type PauseComponentType = StatementEngine.Types.PauseComponentType;
type ContentProps = {
  scripts: AnyStatementType[];
  saveData: Database.Types.SaveDataType;
  saveDataDispatch: Dispatch<SaveDataDispatchType>;
};

const Content = (props: ContentProps) => {
  const { contentStyles } = useSetting();
  const windowSize = useWindowSize();

  // this value is a copy of initial logCursorPos, for restore prev reading position
  const initScrollToLogCursorPos = React.useRef<number>(
    props.saveData?.logCursorPos
  );
  const contentRef = React.useRef<HTMLDivElement>(null);

  const [isExecutingStatement, setIsExecutingStatement] =
    useState<boolean>(false);

  const [pauseComponent, setPauseComponent] = useState<PauseComponentType>();

  const [groupedReadingLogs, setGroupedReadingLogs] = useState<
    Database.Types.ReadLogType[][]
  >(pushGroupedReadingLogs(null, props.saveData?.readingLogs));
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  // this "+1" has two use cases
  // 1. always assume there are some more statements to execute
  // 2. if there is a pause component, then the itemCount == length of groupedReadingLogs + one pause component
  //    which means the loadMoreItem will not be triggered
  const itemCount: number = useMemo(
    () => (groupedReadingLogs?.length || 0) + 1,
    [groupedReadingLogs]
  );

  // create a script dic base on script array to speed up search by id
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

  // init react virtual
  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => contentRef.current,
    estimateSize: () => 100,
    overscan: 1,
  });

  const [virtualLastItemIndex, setVirtualLastItemIndex] = useState<number>();

  //#region scrolling to prev saved position -> get the paragraph index by sentence id -> scroll to index
  useEffect(() => {
    if (
      virtualizer &&
      initScrollToLogCursorPos.current !== null &&
      initScrollToLogCursorPos.current !== undefined
    ) {
      // find the group index which contains initScrollToLogCursorPos
      const index = groupedReadingLogs.findIndex(
        (item) =>
          !!item.find(
            (subItem) => subItem.order === initScrollToLogCursorPos.current
          )
      );
      if (index !== -1) {
        scrollToIndex(index);
      }

      // clear scroll to position as this is one off variable
      initScrollToLogCursorPos.current = null;
    }
  }, []);
  //#endregion

  // Note: virtualItems is diff everytime call "getVirtualItems"
  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();
    if (lastItem) {
      setVirtualLastItemIndex(lastItem.index);
    }
  }, [virtualizer.getVirtualItems()]);

  useEffect(() => {
    setIsScrolling(virtualizer.isScrolling);
  }, [virtualizer.isScrolling]);

  React.useEffect(() => {
    if (virtualLastItemIndex === null || virtualLastItemIndex === undefined)
      return;

    if (virtualLastItemIndex >= itemCount - 1 && !pauseComponent) {
      // execute scripts
      const scripts = props.scripts;
      if (scripts.length === 0) return;

      const currentStatementId = props.saveData?.scriptCursorPos;
      const currentStatementCursorIndex =
        scriptIdIndexDic[currentStatementId] ?? 0;
      let currentStatement: AnyStatementType =
        scripts[currentStatementCursorIndex];

      StatementEngine.execute(currentStatement, {
        addReadingLogs,
        moveScriptCursor,
        setPauseComponent: setPauseComponentWrapper,
      });
    }
  }, [
    itemCount,
    virtualLastItemIndex,
    pauseComponent,
    props.saveData?.scriptCursorPos,
  ]);

  const scrollToIndex = (index: number) => {
    if (index < 0) return; // edge case checking

    const options = { smoothScroll: false, align: 'start' } as const;
    virtualizer.scrollToIndex(index, options);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        virtualizer.scrollToIndex(index, options);
      });
    });
  };

  const getRowData = (
    index: number
  ): LogComponentType[] | PauseComponentType[] => {
    // pauseComponent is always show at the end
    if (groupedReadingLogs?.length === index && !!pauseComponent) {
      return [pauseComponent];
    } else {
      return groupedReadingLogs[index];
    }
  };

  //#region statement executor control callback methods
  const addReadingLogs = (newLogs: LogComponentType[]): void => {
    const _newLogs: Database.Types.ReadLogType[] = newLogs.map((item) => ({
      ...item,
      saveDataId: null, // the saveDataId will be assigned when store to DB
    }));
    props.saveDataDispatch &&
      props.saveDataDispatch({ type: 'pushReadingLogs', payload: _newLogs });
    // update grouped reading logs
    const _groupedReadingLogs = pushGroupedReadingLogs(
      groupedReadingLogs,
      _newLogs
    );
    setGroupedReadingLogs(_groupedReadingLogs);
  };

  const moveScriptCursor = (statementId?: string): void => {
    if (statementId) {
      props.saveDataDispatch &&
        props.saveDataDispatch({
          type: 'updateScriptCursorPos',
          payload: statementId,
        });
    } else {
      // if statementId is not given, then move to next
      const currentStatementId = props.saveData?.scriptCursorPos;
      const currentStatementCursorIndex =
        scriptIdIndexDic[currentStatementId] ?? 0;
      const nextStatementCursorIndex = currentStatementCursorIndex + 1;
      let nextStatement: AnyStatementType =
        props.scripts[nextStatementCursorIndex];
      props.saveDataDispatch &&
        props.saveDataDispatch({
          type: 'updateScriptCursorPos',
          payload: nextStatement?.id,
        });
    }
  };

  const setPauseComponentWrapper = (pauseComponent: PauseComponentType) => {
    setPauseComponent(pauseComponent);
  };
  //#endregion

  return (
    <div
      id="content"
      ref={contentRef}
      style={{
        ...contentStyles,
        height: windowSize.innerHeight,
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <div
        id="contentBody"
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ContentRow
              data={getRowData(virtualRow.index)}
              isScrolling={isScrolling}
              setReadingLogCursorPos={(topScreenItemId: number) => {
                props.saveDataDispatch &&
                  props.saveDataDispatch({
                    type: 'updateLogCursorPos',
                    payload: topScreenItemId,
                  });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const pushGroupedReadingLogs = (
  prevGroupedReadingLogs: Database.Types.ReadLogType[][],
  newReadingLogs: Database.Types.ReadLogType[]
): Database.Types.ReadLogType[][] => {
  let _groupedReadingLogs = prevGroupedReadingLogs ?? [];
  _groupedReadingLogs = _groupedReadingLogs.slice(); // prepare a copy

  if (newReadingLogs) {
    for (let log of newReadingLogs) {
      if (!log) continue;

      const prevGrouped = _groupedReadingLogs[_groupedReadingLogs.length - 1];
      if (prevGrouped) {
        const lastLogInPrevGrouped = prevGrouped[prevGrouped.length - 1];
        if (
          StatementEngine.CheckStatementType.isSentence(log) &&
          StatementEngine.CheckStatementType.isSentence(lastLogInPrevGrouped)
        ) {
          _groupedReadingLogs[_groupedReadingLogs.length - 1] = [
            ...prevGrouped,
            log,
          ];
        } else {
          _groupedReadingLogs.push([log]);
        }
      } else {
        _groupedReadingLogs.push([log]);
      }
    }
  }

  return _groupedReadingLogs;
};

export default Content;
