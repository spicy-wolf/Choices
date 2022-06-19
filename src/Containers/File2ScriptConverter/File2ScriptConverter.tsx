import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Types } from '@src/StatementEngine';

const File2ScriptConverter = () => {
  const inputRef = React.useRef<HTMLTextAreaElement>();
  const ouputRef = React.useRef<HTMLTextAreaElement>();

  const onClick = async () => {
    if (inputRef.current && inputRef.current.value && ouputRef.current) {
      const rawValue = inputRef.current.value;
      const paragraphList = rawValue.split(/\n/g);

      const statements: Types.AnyStatementType[] = paragraphList.map(
        (item, index) => ({
          id: uuidv4(),
          order: index,
          type: 'p',
          data: item,
        })
      );
      statements.push({
        id: uuidv4(),
        order: statements.length,
        type: 'fin',
      } as Types.FinStatementType);

      const statementsStr = JSON.stringify(statements);

      ouputRef.current.value = statementsStr;
      await navigator.clipboard.writeText(statementsStr);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ width: '100vw' }}>
      <textarea ref={inputRef} rows={4} className="w-100" />
      <button type="button" onClick={onClick}>
        Convert and Copy
      </button>
      <textarea ref={ouputRef} rows={4} readOnly className="w-100" />
    </div>
  );
};

export default File2ScriptConverter;
