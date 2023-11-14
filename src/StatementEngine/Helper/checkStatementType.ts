import { StatementTypeNames } from '../Constants';

export const isEndOfLine = (statement: any) => {
  return (StatementTypeNames.END_OF_LINE as readonly string[]).includes(
    statement?.type?.toLowerCase()
  );
};
export const isFin = (statement: any) => {
  return (StatementTypeNames.FIN as readonly string[]).includes(
    statement?.type?.toString().toLowerCase()
  );
};
export const isParagraph = (statement: any) => {
  return (StatementTypeNames.PARAGRAPH as readonly string[]).includes(
    statement?.type?.toLowerCase()
  );
};
export const isSentence = (statement: any) => {
  return (StatementTypeNames.SENTENCE as readonly string[]).includes(
    statement?.type?.toLowerCase()
  );
};
