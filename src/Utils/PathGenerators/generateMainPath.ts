import { RouterPathStrings } from '@src/Constants';

export const generateLibraryPath = (src?: string): string => {
  let result = RouterPathStrings.LIBRARY_PAGE;

  if (src) {
    result += '?';

    const paramDic: { [key: string]: string } = {};
    if (src) paramDic[RouterPathStrings.LIBRARY_PAGE_SRC_PARAM] = src;

    result += new URLSearchParams(paramDic).toString();
  }

  return result;
};
