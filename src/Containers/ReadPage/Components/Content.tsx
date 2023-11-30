import React, { Dispatch, useEffect, useMemo, useState } from 'react';
import * as StatementEngine from '@src/StatementEngine';
import './Content.scss';
import * as Database from '@src/Database';
import { ContentRow } from './ContentRow';
import { useWindowSize } from '@src/Context/WindowSizeContext';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useSetting } from '@src/Context';
import { useGroupedReadLogs } from '../Hooks/useGroupedReadLogs';

type AnyStatementType = StatementEngine.Types.AnyStatementType;
type AnyComponentType = StatementEngine.Types.AnyComponentType;
type PauseComponentType = StatementEngine.Types.PauseComponentType;
type ContentProps = {
  scripts: AnyStatementType[];
  saveData: Database.Types.SaveDataType;
  setSaveData: React.Dispatch<React.SetStateAction<Database.Types.SaveDataType>>;
};

const Content = (props: ContentProps) => {
  const { contentStyles } = useSetting();
  const windowSize = useWindowSize();

  // this value is a copy of initial logCursorPos, for restore prev reading position
  const initScrollToLogCursorPos = React.useRef<number>(
    props.saveData?.logCursorPos
  );
  const contentRef = React.useRef<HTMLDivElement>(null);

  const [pauseComponent, setPauseComponent] = useState<PauseComponentType>();
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  const { doExecution } = StatementEngine.useExecutor(
    props.scripts,
    props.saveData as StatementEngine.Types.SaveDataType,
    props.setSaveData,
    setPauseComponent
  );

  const { groupedReadLogs } = useGroupedReadLogs(
    props.saveData?.readLogs as AnyComponentType[]
  );

  // this "+1" has two use cases
  // 1. always assume there are some more statements to execute
  // 2. if there is a pause component, then the itemCount == length of groupedReadLogs + one pause component
  //    which means the loadMoreItem will not be triggered
  const readLogCount: number = useMemo(
    () => (groupedReadLogs?.length || 0) + 1,
    [groupedReadLogs]
  );

  // init react virtual
  const virtualizer = useVirtualizer({
    count: readLogCount,
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
      initScrollToLogCursorPos.current !== undefined &&
      !!groupedReadLogs // groupedReadLogs must be init and computed at least once
    ) {
      // find the group index which contains initScrollToLogCursorPos
      const index = groupedReadLogs?.findIndex((item) =>
        item.find(
          (subItem) => subItem.order === initScrollToLogCursorPos.current
        )
      );
      if (index !== -1) {
        scrollToIndex(index);
      }

      // clear scroll to position as this is one off variable
      initScrollToLogCursorPos.current = null;
    }
  }, [groupedReadLogs]);
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

    if (virtualLastItemIndex >= readLogCount - 1 && !pauseComponent) {
      doExecution();
    }
  }, [
    readLogCount,
    virtualLastItemIndex,
    pauseComponent,
    props.saveData?.scriptCursorPos,
    // props.saveData // TODO: what if no updates in scriptCursorPos???
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

  const getRowData = (index: number): AnyComponentType[] => {
    // pauseComponent is always show at the end
    if (groupedReadLogs?.length === index && !!pauseComponent) {
      return [pauseComponent];
    } else {
      return groupedReadLogs?.[index];
    }
  };

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
        {!!groupedReadLogs && virtualizer.getVirtualItems().map((virtualRow) => (
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
              setReadLogCursorPos={(topScreenItemId: number) => {
                props.setSaveData((_saveData) => ({
                  ..._saveData,
                  logCursorPos: topScreenItemId,
                }));
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Content;
