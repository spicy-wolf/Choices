import React from 'react';
import * as Types from '@src/Types';
import * as StatementEngine from '@src/StatementEngine';

type AnyStatementType = Types.Statements.AnyStatementType;

const ContentRow = (props: {
  data: AnyStatementType[];
  index: number;
  setItemSize: (index: number, height: number) => void;
}): JSX.Element => {
  const rowRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (rowRef.current) {
      props.setItemSize(
        props.index,
        rowRef.current.getBoundingClientRect().height
      );
    }
  }, [props.data, props.setItemSize, props.index]);

  const theStory = React.useMemo(() => {
    const result = props.data?.map((statement) => (
      <StatementEngine.RenderContent key={statement.id} {...statement} />
    ));
    return result;
  }, [props.data]);

  return <div ref={rowRef}>{theStory}</div>;
};

export { ContentRow };
