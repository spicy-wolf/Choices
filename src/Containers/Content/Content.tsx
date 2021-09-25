import React, { useState } from 'react';
import * as RenderEngine from '@src/ContentRenderEngine';
import './Content.scss';

type StatementType = RenderEngine.Statements.AbstractStatementType;
type ContentProps = { scripts: StatementType[] };

const Content = (props: ContentProps) => {
  const [statementCounter, setStatementCounter] = React.useState<number>(0);
  const [executeMore, setExecuteMore] = React.useState<boolean>(false);
  const [readingLogs, setReadingLogs] = React.useState<StatementType[]>([]); // TODO: load history

  const [distanceToBottom, setDistanceToBottom] = React.useState<number>(0);

  const contentRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (!executeMore) {
      // TODO: more features on this condition
      // pre-load some. TODO: hard code 100?
      if (statementCounter < props.scripts.length && distanceToBottom < 100) {
        /**
         * The whole Content render is similar to a CPU instruction cycle.
         * so, to avoid React "maximum update depth exceeded" error
         * we use settimeout to push setExecuteMore into the macrotask queue.
         * This can move the next React render cycle outside of the current "state update stack" (like a call stack)
         */
        setTimeout(() => setExecuteMore(true), 0);
      }
    }
  }, [executeMore, distanceToBottom]);

  React.useEffect(() => {
    if (!executeMore) return;

    /**
     * Execute one statement
     */
    const currentScripts = props.scripts;
    RenderEngine.Statements.Executor(currentScripts[statementCounter], {
      addReadingLogs,
    });
    setStatementCounter(statementCounter + 1);
    setExecuteMore(false);
  }, [executeMore]);

  React.useEffect(() => {
    if (!contentRef.current) return;

    const element = contentRef.current;
    const _distanceToBottom = getDistanceToBottom(element);
    setDistanceToBottom(_distanceToBottom);
  }, [readingLogs]);

  const theStory = React.useMemo(() => {
    const result = readingLogs.map((statement, index) => (
      <React.Fragment key={index}>
        <RenderEngine.Statements.RenderContent statement={statement} />
      </React.Fragment>
    ));
    return result;
  }, [readingLogs]);

  const addReadingLogs = (statements: StatementType[]): void => {
    let newLogs = [...readingLogs, ...statements];
    setReadingLogs(newLogs);
  };

  const onScrollWrapper = (e: React.UIEvent<HTMLDivElement>) => {
    let element = e.target as HTMLDivElement;
    const _distanceToBottom = getDistanceToBottom(element);
    setDistanceToBottom(_distanceToBottom);
  };

  return (
    <div id="content" onScroll={onScrollWrapper} ref={contentRef}>
      <div id="contentBody">{theStory}</div>
    </div>
  );
};

export default Content;

//
// helper functions
//
function getDistanceToBottom(element: HTMLElement): number {
  if (!element) return 0;
  const _distanceToBottom =
    element.scrollHeight - element.scrollTop - element.clientHeight;
  return _distanceToBottom;
}
