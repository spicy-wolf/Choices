/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';

const CHANNEL_NAME = 'singleton-checker-channel';

const checkOpenedQuestionStr = (repoName: string, authorName: string) => `has ${repoName} ${authorName} opened?`;
const checkOpenedAnswerStr = (repoName: string, authorName: string) => `${repoName} ${authorName} were opened.`;

export const useSingletonChecker = (repoName: string, authorName: string) => {
  const boardcastChannel = React.useRef<BroadcastChannel>();

  const [isSingleton, setIsSingleton] = React.useState(true);

  React.useEffect(() => {
    boardcastChannel.current = new BroadcastChannel(CHANNEL_NAME);
    boardcastChannel.current.onmessage = (event) => {
      if (event.data === checkOpenedQuestionStr(repoName, authorName)) {
        boardcastChannel.current?.postMessage(checkOpenedAnswerStr(repoName, authorName));
      }
      if (event.data === checkOpenedAnswerStr(repoName, authorName)) {
        setIsSingleton(false);
      }
    };
    boardcastChannel.current.onmessageerror = (event) => {
      console.error(event);
    };
    return () => {
      boardcastChannel.current?.close();
    };
  }, []);

  React.useEffect(() => {
    boardcastChannel.current?.postMessage(checkOpenedQuestionStr(repoName, authorName));
  }, [checkOpenedQuestionStr(repoName, authorName)]);

  return [isSingleton] as const;
};