import { RouterPathStrings } from '@src/Constants';

export const generateMainPath = (
  src?: string,
  repoName?: string,
  authorName?: string
): string => {
  let result = RouterPathStrings.MAIN_PAGE;

  if (src || repoName || authorName) {
    result += '?';

    let paramDic: { [key: string]: string } = {};
    if (src) paramDic[RouterPathStrings.MAIN_PAGE_SRC_PARAM] = src;
    if (repoName) paramDic[RouterPathStrings.MAIN_PAGE_REPO_PARAM] = repoName;
    if (authorName)
      paramDic[RouterPathStrings.MAIN_PAGE_AUTHOR_PARAM] = authorName;

    result += new URLSearchParams(paramDic).toString();
  }

  return result;
};
