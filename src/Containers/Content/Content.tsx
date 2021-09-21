import React, { useState } from 'react';
import * as RenderEngine from '@src/ContentRenderEngine';
import './Content.scss';

type StatementType = RenderEngine.Statements.AbstractStatementType;
type ContentProps = { scripts: StatementType[] };

const Content = (props: ContentProps) => {
  const [statementCounter, setStatementCounter] = React.useState<number>(0);
  const [executeMore, setExecuteMore] = React.useState<boolean>(false);
  const [readingLogs, setReadingLogs] = React.useState<StatementType[]>([]); // TODO: load history

  const addReadingLogs = (statements: StatementType[]): void => {
    let newLogs = [...readingLogs, ...statements];
    setReadingLogs(newLogs);
  };

  React.useEffect(() => {
    if (!executeMore) {
      // TODO: more features on this confition
      if (statementCounter < props.scripts.length) {
        setExecuteMore(true);
      }
    }
  }, [executeMore]);

  React.useEffect(() => {
    if (!executeMore) return;

    const currentScripts = props.scripts;
    RenderEngine.Statements.Executor(currentScripts[statementCounter], {
      addReadingLogs,
    });
    setStatementCounter(statementCounter + 1);
    setExecuteMore(false);
  }, [executeMore]);

  const theStory = React.useMemo(() => {
    const result = readingLogs.map((statement, index) => (
      <React.Fragment key={index}>
        <RenderEngine.Statements.RenderContent statement={statement} />
      </React.Fragment>
    ));
    return result;
  }, [readingLogs]);

  return (
    <div id="content">
      <div id="contentBody">{theStory}</div>
    </div>
  );
};

export default Content;
