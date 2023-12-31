/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { StatementTypeNames } from '../Constants';
import { AnyComponentType, AnyStatementType } from '../Types';

export const isEndOfLine = (statement: AnyStatementType | AnyComponentType) => {
  return (StatementTypeNames.END_OF_LINE as readonly string[]).includes(
    statement?.type?.toLowerCase()
  );
};
export const isFin = (statement: AnyStatementType | AnyComponentType) => {
  return (StatementTypeNames.FIN as readonly string[]).includes(
    statement?.type?.toString().toLowerCase()
  );
};
export const isParagraph = (statement: AnyStatementType | AnyComponentType) => {
  return (StatementTypeNames.PARAGRAPH as readonly string[]).includes(
    statement?.type?.toLowerCase()
  );
};
export const isSentence = (statement: AnyStatementType | AnyComponentType) => {
  return (StatementTypeNames.SENTENCE as readonly string[]).includes(
    statement?.type?.toLowerCase()
  );
};
export const isJump = (statement: AnyStatementType | AnyComponentType) => {
  return (StatementTypeNames.JUMP as readonly string[]).includes(
    statement?.type?.toLowerCase()
  );
};

