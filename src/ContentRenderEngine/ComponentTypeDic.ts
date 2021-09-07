import { AbstractComponentType, ComponentList } from './Components';

export const ComponentTypeDic: {
  [key in keyof typeof ComponentList]: (
    props: AbstractComponentType
  ) => JSX.Element;
} = {
  EndOfLine: ComponentList.EndOfLine,
  Paragraph: ComponentList.Paragraph,
  Sentence: ComponentList.Sentence,
};
