/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
// import { RouterPathStrings } from '@src/Constants';
// import * as Utils from '@src/Utils';
import useMetadataList from './Hooks/useMetadataList';
import { RepoCard } from './Components/RepoCard';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import Container from '@mui/material/Container/Container';
import Grid from '@mui/material/Grid/Grid';
import Fab from '@mui/material/Fab/Fab';
import AddIcon from '@mui/icons-material/Add';
import { LoadingIndicatorModal } from '@src/Containers/components';
import { AddNewRepo } from './Components/AddNewRepoModal';
import { useTranslation } from 'react-i18next';
import {
  MainPageSidebar,
  MainPageSidebarButtonEnum,
} from '../components/MainPageSidebar';

const LibraryPage = () => {
  const { t } = useTranslation();

  //#region query param
  // TODO: load src from URL
  // const query = Utils.useQuery();
  // const src = query.get(RouterPathStrings.LIBRARY_PAGE_SRC_PARAM);
  //#endregion

  //#region state
  const [showAddModal, setShowAddModal] = React.useState<boolean>();
  //#endregion

  //#region hooks
  const metadataListLoader = useMetadataList();
  //#endregion

  const metadataElements: JSX.Element[] = React.useMemo(() => {
    let result: JSX.Element[] = [];
    if (metadataListLoader?.metadataList) {
      result = metadataListLoader?.metadataList.map((item) => (
        <Grid key={item.id} item xs={12} md={4}>
          <RepoCard
            item={item}
            deleteMetadata={metadataListLoader?.deleteMetadata}
          />
        </Grid>
      ));
    }
    return result;
  }, [metadataListLoader?.metadataList]);

  return (
    <>
      <CssBaseline />
      <LoadingIndicatorModal
        open={!metadataListLoader?.metadataList || !!metadataListLoader?.error}
        loadingLabel={t('loadingStatus.loadReadingList')}
        error={metadataListLoader?.error}
        handleClose={() => { }}
      />
      <AddNewRepo
        openInputModal={showAddModal}
        closeInputModal={() => setShowAddModal(false)}
        metadataListLoader={metadataListLoader}
      />
      <Container sx={{ display: 'flex' }}>
        <MainPageSidebar selected={MainPageSidebarButtonEnum.Library} />
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="stretch"
          sx={{ pt: 1 }}
        >
          {metadataElements}
        </Grid>
      </Container>
      <Fab
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
        size="small"
        color="secondary"
        aria-label="add"
        onClick={() => setShowAddModal(true)}
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default LibraryPage;

