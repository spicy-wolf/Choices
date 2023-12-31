/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import {
  MainPageSidebar,
  MainPageSidebarButtonEnum,
} from '../components/MainPageSidebar';
import Grid from '@mui/material/Grid';
import { Setting } from '../components';

const SettingPage = () => {
  return (
    <>
      <CssBaseline />
      <Container sx={{ display: 'flex' }}>
        <MainPageSidebar selected={MainPageSidebarButtonEnum.Setting} />
        <Grid container direction="column" alignItems="stretch" sx={{ pt: 1 }}>
          <Setting
            showLanguageSelector
            showDarkModeSwitch
            showUiThemeSelector
          />
        </Grid>
      </Container>
    </>
  );
};

export default SettingPage;

