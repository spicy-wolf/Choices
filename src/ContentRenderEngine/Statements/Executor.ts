import { AbstractStatementType } from '.';
import { ParagraphProps } from './Paragraph/Paragraph';
import { SentenceProps } from './Sentence/Sentence';
import { v4 as uuidv4 } from 'uuid';
import { EndOfLineProps } from './EndOfLine/EndOfLine';

export const Executor = (
  statement: AbstractStatementType,
  hooks: { addReadingLogs: (statements: AbstractStatementType[]) => void }
) => {
  // TODO: check condition

  const componentType = statement?.type?.toLowerCase() ?? '';
  switch (componentType) {
    case 'endofline':
    case 'eol':
      break;
    case 'paragraph':
    case 'p':
      /**
       * Split a big paragraph into small pieces
       */
      let pStatement = statement as ParagraphProps;
      // TODO: replace inline variables
      let sentences =
        pStatement.text.replace(/\n/g, '\\n').match(/.{1,30}/g) ?? []; // TODO: is 30 good?
      let pResult: Array<EndOfLineProps | SentenceProps> = [
        {
          type: 'eol',
          id: uuidv4(),
        },
      ];
      pResult = pResult.concat(
        sentences.map((sentence) => ({
          type: 's',
          id: uuidv4(),
          text: sentence,
        }))
      );
      hooks.addReadingLogs && hooks.addReadingLogs(pResult);
      break;
    case 'sentence':
    case 's':
      // TODO: replace inline variables
      break;
    case 'selection':
      // TODO: replace options' inline variables
      break;
    case 'jump':
    case 'j':
      // TODO: replace next statement
      break;
    case 'setter':
      // TODO: compute values
      break;
    default:
      break;
  }
};
