import React from 'react';
import Switch from '@mui/material/Switch';
import { useSetting } from '@src/Context';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Avatar from '@mui/material/Avatar';
import CheckIcon from '@mui/icons-material/Check';
import { ContentThemePalette, UiThemePalette } from '@src/Constants';
import { SimplePaletteColorOptions } from '@mui/material/styles/createPalette';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const Setting = () => {
  const { setting, setSetting } = useSetting();

  const handleThemeModeSwitch = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setSetting('themeMode', checked ? 'dark' : 'light');
  };

  const handleFontSizeSwitch = (event: Event, value: number) => {
    setSetting('fontSize', value);
  };

  const handleLineHeightSwitch = (event: Event, value: number) => {
    setSetting('lineHeight', value);
  };

  const isDarkMode = setting.themeMode === 'dark';

  const darkModeSwitch = (
    <FormControl fullWidth>
      <FormLabel focused={false}>Dark Mode</FormLabel>
      <Switch checked={isDarkMode} onChange={handleThemeModeSwitch} />
    </FormControl>
  );

  const uiThemeSelector = (
    <FormControl fullWidth>
      <FormLabel focused={false}>UI Theme</FormLabel>
      <Stack direction="row" spacing={2}>
        {Object.keys(UiThemePalette).map((uiThemeName) => (
          <IconButton
            key={uiThemeName}
            aria-label={uiThemeName}
            sx={{
              bgcolor: (
                UiThemePalette[uiThemeName].primary as SimplePaletteColorOptions
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
        ))}
      </Stack>
    </FormControl>
  );

  const contentThemeSelector = (
    <FormControl fullWidth>
      <FormLabel focused={false}>Content Theme</FormLabel>
      <Stack direction="row" spacing={2}>
        {Object.keys(ContentThemePalette)
          .filter((contentThemeName) => contentThemeName !== 'dark')
          .map((contentThemeName) => (
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
      <FormLabel focused={false}>Font Size</FormLabel>
      <Slider
        aria-label="Font size"
        step={0.1}
        min={1}
        max={2.5}
        value={setting.fontSize}
        onChange={handleFontSizeSwitch}
      />
    </FormControl>
  );

  const lineHeightSlider = (
    <FormControl fullWidth>
      <FormLabel focused={false}>Line Height</FormLabel>
      <Slider
        aria-label="Line Height"
        step={10}
        min={100}
        max={250}
        value={setting.lineHeight}
        onChange={handleLineHeightSwitch}
      />
    </FormControl>
  );

  return (
    <>
      <Typography variant="h4" sx={{ py: 3, px: 3 }}>
        Settings
      </Typography>
      <Stack spacing={2} sx={{ px: 4 }}>
        {darkModeSwitch}
        {uiThemeSelector}
        {!isDarkMode && contentThemeSelector}
        {fontSizeSlider}
        {lineHeightSlider}
      </Stack>
    </>
  );
};

export { Setting };
