/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
import { Types } from '@src/StatementEngine';
import { generateId } from '@src/Utils';

const File2ScriptConverter = () => {
  const inputRef = React.useRef<HTMLTextAreaElement>();
  const ouputRef = React.useRef<HTMLTextAreaElement>();

  const onClick = async () => {
    if (inputRef.current && inputRef.current.value && ouputRef.current) {
      const rawValue = inputRef.current.value;
      const paragraphList = rawValue.split(/\n/g);

      const statements: Types.AnyStatementType[] = paragraphList.map(
        (item, index) => ({
          id: generateId(),
          order: index,
          type: 'p',
          data: item,
        })
      );
      statements.push({
        id: generateId(),
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

