import type { AbstractStatementType } from './AbstractComponentType.type';
import type { ErrorProps } from './Error/Error';
import type { ParagraphProps } from './Paragraph/Paragraph';

export const CompileAndCheck = (
  statement: any,
  context: { suggestId: string; scriptSha: string; scriptPath: string }
): AbstractStatementType => {
  if (statement === null || statement === undefined) {
    let error: ErrorProps = {
      id: context.suggestId,
      type: 'error',
      context: JSON.stringify(statement),
      errormsg: `Null exception at ${context.scriptPath}`,
    };
    return error;
  }

  switch (typeof statement) {
    case 'number':
    case 'string':
      let p: ParagraphProps = {
        id: context.suggestId,
        type: 'p',
        text: statement.toString(),
      };
      return p;
    case 'object':
      // TODO: syntax check
      return statement;
    default:
      let error: ErrorProps = {
        id: context.suggestId,
        type: 'error',
        context: JSON.stringify(statement),
        errormsg: `Cannot compile at ${context.scriptPath}`,
      };
      return error;
  }
};
