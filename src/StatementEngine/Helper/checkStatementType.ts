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
