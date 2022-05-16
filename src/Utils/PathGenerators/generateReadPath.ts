import { RouterPathStrings } from '@src/Constants';

export const generateReadPath = (
  repoName?: string,
  authorName?: string
): string => {
  let result = RouterPathStrings.MAIN_PAGE;

  if (repoName || authorName) {
    result += '?';

    let paramDic: { [key: string]: string } = {};
    if (repoName) paramDic[RouterPathStrings.READ_PAGE_REPO_PARAM] = repoName;
    if (authorName)
      paramDic[RouterPathStrings.READ_PAGE_AUTHOR_PARAM] = authorName;

    result += new URLSearchParams(paramDic).toString();
  }

  return result;
};
