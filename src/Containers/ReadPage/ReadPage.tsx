/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
import { RouterPathStrings } from '@src/Constants';
import { generateLibraryPath, useQuery } from '@src/Utils';
import { YesNoModal } from '@src/Containers/components';
import { useSingletonChecker } from './Hooks/useSingletonChecker';
import { useNavigate } from 'react-router-dom';
import { ReadPageInner } from './ReadPageInner';

const ReadPage = () => {
  //#region query param
  const query = useQuery();
  const repoName = query.get(RouterPathStrings.READ_PAGE_REPO_PARAM);
  const authorName = query.get(RouterPathStrings.READ_PAGE_AUTHOR_PARAM);
  //#endregion

  const navigate = useNavigate();
  const [isSingleton] = useSingletonChecker(repoName, authorName);

  if (!isSingleton) {
    return (<YesNoModal
      open={true}
      title="read.singletonCheckModal.title"
      body="read.singletonCheckModal.body"
      onClose={() => window.close()}
      onConfirm={() => navigate(generateLibraryPath())} />);
  }

  return <ReadPageInner repoName={repoName} authorName={authorName} />;
};

export default ReadPage;

