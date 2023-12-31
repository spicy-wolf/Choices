/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { RouterPathStrings } from '@src/Constants';

export const generateReadPath = (
  repoName?: string,
  authorName?: string
): string => {
  let result = RouterPathStrings.READ_PAGE;

  if (repoName || authorName) {
    result += '?';

    const paramDic: { [key: string]: string } = {};
    if (repoName) paramDic[RouterPathStrings.READ_PAGE_REPO_PARAM] = repoName;
    if (authorName)
      paramDic[RouterPathStrings.READ_PAGE_AUTHOR_PARAM] = authorName;

    result += new URLSearchParams(paramDic).toString();
  }

  return result;
};

