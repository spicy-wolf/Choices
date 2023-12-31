/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
import Switch from '@mui/material/Switch';
import { useSetting } from '@src/Context';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Avatar from '@mui/material/Avatar';
import CheckIcon from '@mui/icons-material/Check';
import {
  ContentThemePalette,
  ContentThemePaletteNames,
  ThemeModes,
  UiThemePalette,
} from '@src/Constants';
import { SimplePaletteColorOptions } from '@mui/material/styles/createPalette';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Trans, useTranslation } from 'react-i18next';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type SettingProps = {
  showDarkModeSwitch?: boolean;
  showUiThemeSelector?: boolean;
  showContentThemeSelector?: boolean;
  showFontSizeSlider?: boolean;
  showLineHeightSlider?: boolean;
  showLanguageSelector?: boolean;
};

const Setting = (props: SettingProps) => {
  const { i18n } = useTranslation();
  const { setting, setSetting } = useSetting();

  const handleThemeModeSwitch = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setSetting('themeMode', checked ? ThemeModes.Dark : ThemeModes.Light);
  };

  const handleFontSizeChange = (event: Event, value: number) => {
    setSetting('fontSize', value);
  };

  const handleLineHeightChange = (event: Event, value: number) => {
    setSetting('lineHeight', value);
  };

  const isDarkMode = setting.themeMode === ThemeModes.Dark;

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setSetting('language', event.target.value);
  };

  const darkModeSwitch = (
    <FormControl fullWidth>
      <FormLabel focused={false}>
        <Trans i18nKey="setting.darkMode.label" />
      </FormLabel>
      <Switch checked={isDarkMode} onChange={handleThemeModeSwitch} />
    </FormControl>
  );

  const uiThemeSelector = (
    <FormControl fullWidth>
      <FormLabel focused={false}>
        <Trans i18nKey="setting.uiTheme.label" />
      </FormLabel>
      <Stack direction="row" spacing={2}>
        {Object.keys(UiThemePalette).map(
          (uiThemeName: keyof typeof UiThemePalette) => (
            <IconButton
              key={uiThemeName}
              aria-label={uiThemeName}
              sx={{
                bgcolor: (
                  UiThemePalette[uiThemeName]
                    .primary as SimplePaletteColorOptions
                ).main,
                width: '2em',
                height: '2em',
              }}
              onClick={() => setSetting('uiThemeName', uiThemeName)}
            >
              <Avatar
                sx={{
                  bgcolor: (
                    UiThemePalette[uiThemeName]
                      .primary as SimplePaletteColorOptions
                  ).main,
                }}
              >
                {uiThemeName === setting.uiThemeName && <CheckIcon />}
              </Avatar>
            </IconButton>
          )
        )}
      </Stack>
    </FormControl>
  );

  const contentThemeSelector = (
    <FormControl fullWidth>
      <FormLabel focused={false}>
        <Trans i18nKey="setting.contentTheme.label" />
      </FormLabel>
      <Stack direction="row" spacing={2}>
        {Object.keys(ContentThemePalette)
          .filter(
            (contentThemeName) =>
              contentThemeName !== ContentThemePaletteNames.Dark
          )
          .map((contentThemeName: keyof typeof ContentThemePalette) => (
            <IconButton
              key={contentThemeName}
              aria-label={contentThemeName}
              sx={{
                bgcolor: ContentThemePalette[contentThemeName].backgroundColor,
                width: '2em',
                height: '2em',
                border: 4,
                borderColor: '#0000000f',
              }}
              onClick={() => setSetting('contentThemeName', contentThemeName)}
            >
              <Avatar
                sx={{
                  bgcolor:
                    ContentThemePalette[contentThemeName].backgroundColor,
                }}
              >
                {contentThemeName === setting.contentThemeName && (
                  <CheckIcon
                    sx={{
                      color: ContentThemePalette[contentThemeName].color,
                    }}
                  />
                )}
              </Avatar>
            </IconButton>
          ))}
      </Stack>
    </FormControl>
  );

  const fontSizeSlider = (
    <FormControl fullWidth>
      <FormLabel focused={false}>
        <Trans i18nKey="setting.fontSize.label" />
      </FormLabel>
      <Slider
        aria-label="Font size"
        step={0.1}
        min={1}
        max={2.5}
        value={setting.fontSize}
        onChange={handleFontSizeChange}
      />
    </FormControl>
  );

  const lineHeightSlider = (
    <FormControl fullWidth>
      <FormLabel focused={false}>
        <Trans i18nKey="setting.lineHeight.label" />
      </FormLabel>
      <Slider
        aria-label="Line Height"
        step={10}
        min={100}
        max={250}
        value={setting.lineHeight}
        onChange={handleLineHeightChange}
      />
    </FormControl>
  );

  const languageSelector = (
    <FormControl fullWidth>
      <InputLabel>
        <Trans i18nKey="setting.language.label" />
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={setting?.language}
        label={<Trans i18nKey="setting.language.label" />}
        onChange={handleLanguageChange}
      >
        {i18n.languages?.map((languageCode) => (
          <MenuItem key={languageCode} value={languageCode}>
            <Trans i18nKey={`setting.language.languageDic.${languageCode}`} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <>
      <Typography variant="h4" sx={{ py: 3, px: 3 }}>
        <Trans i18nKey="setting.label" />
      </Typography>
      <Stack spacing={2} sx={{ px: 4 }}>
        {props.showLanguageSelector && languageSelector}
        {props.showDarkModeSwitch && darkModeSwitch}
        {props.showUiThemeSelector && uiThemeSelector}
        {props.showContentThemeSelector && !isDarkMode && contentThemeSelector}
        {props.showFontSizeSlider && fontSizeSlider}
        {props.showLineHeightSlider && lineHeightSlider}
      </Stack>
    </>
  );
};

export { Setting };

