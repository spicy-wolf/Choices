import { AnyStatementType } from '../Types';
import { StatementTypeNames } from '../Constants';

export const isEndOfLine = (statement: AnyStatementType) => {
  return (StatementTypeNames.END_OF_LINE as readonly string[]).includes(
    statement?.type?.toLowerCase()
  );
};
export const isFin = (statement: AnyStatementType) => {
  return (StatementTypeNames.FIN as readonly string[]).includes(
    statement?.type?.toString().toLowerCase()
  );
};
export const isParagraph = (statement: AnyStatementType) => {
  return (StatementTypeNames.PARAGRAPH as readonly string[]).includes(
    statement?.type?.toLowerCase()
  );
};
export const isSentence = (statement: AnyStatementType) => {
  return (StatementTypeNames.SENTENCE as readonly string[]).includes(
    statement?.type?.toLowerCase()
  );
};
