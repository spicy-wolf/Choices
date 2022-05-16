import { RouterPathStrings } from '@src/Constants';

export const generateMainPath = (src?: string): string => {
  let result = RouterPathStrings.MAIN_PAGE;

  if (src) {
    result += '?';

    let paramDic: { [key: string]: string } = {};
    if (src) paramDic[RouterPathStrings.MAIN_PAGE_SRC_PARAM] = src;

    result += new URLSearchParams(paramDic).toString();
  }

  return result;
};
