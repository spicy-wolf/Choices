import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme, { ThemeOptions } from '@mui/material/styles/createTheme';
import { PaletteMode, Theme } from '@mui/material';
import {
  ContentThemePalette,
  ContentThemePaletteNames,
  ThemeModes,
  UiThemePalette,
  UiThemePaletteNames,
} from '@src/Constants';

const USER_SETTINGS_LOCALSTORAGE_NAME = 'user_settings';

type UserSettingType = {
  themeMode: PaletteMode;
  uiThemeName: `${UiThemePaletteNames}`;
  contentThemeName: `${ContentThemePaletteNames}`;
  /**
   * unit in rem, e.g. 1.5rem
   */
  fontSize: number;
  /**
   * unit in scale, e.g. 150%
   */
  lineHeight: number;
  language: string;
};

type ContentStyles = React.CSSProperties;
type SettingContextType = {
  contentStyles: ContentStyles;
  setting: UserSettingType;
  setSetting: (
    fieldName: keyof UserSettingType,
    value: unknown
  ) => Promise<void> | void;
};

const DefaultSettingContext: SettingContextType = {
  contentStyles: {},
  setting: {
    themeMode: ThemeModes.Light,
    uiThemeName: UiThemePaletteNames.Brown,
    contentThemeName: ContentThemePaletteNames.LightGrey,
    fontSize: 1.5,
    lineHeight: 150,
    language: 'en',
  },
  setSetting: () => {},
};

const SettingContext = React.createContext<SettingContextType>(
  DefaultSettingContext
);

type SettingContextProps = {
  children: React.ReactNode;
};
export const SettingContextProvider = (props: SettingContextProps) => {
  const { i18n } = useTranslation();
  const [setting, setSetting] = React.useState<UserSettingType>(
    DefaultSettingContext.setting
  );

  useEffect(() => {
    if (typeof Storage === 'undefined') {
      console.error('localstorage no supported');
    }
    try {
      const _settings = localStorage.getItem(USER_SETTINGS_LOCALSTORAGE_NAME);
      if (_settings) {
        setSetting(JSON.parse(_settings) as UserSettingType);
      }
    } catch (ex) {
      // parse failed
      console.error('cannot load settings from localstorage');
    }
  }, []);

  const setSettingWrapper = async (
    fieldName: keyof UserSettingType,
    value: unknown
  ): Promise<void> => {
    const newSetting: UserSettingType = { ...setting, [fieldName]: value };
    setSetting(newSetting);

    // update localstorage to store user setting while updating
    if (newSetting) {
      localStorage.setItem(
        USER_SETTINGS_LOCALSTORAGE_NAME,
        JSON.stringify(newSetting)
      );
    }
  };

  // UI theme
  const uiTheme: Theme = React.useMemo(() => {
    const uiThemePalette =
      UiThemePalette[setting?.uiThemeName] ?? UiThemePalette.brown;
    const uiThemeOptions: ThemeOptions = {
      palette: {
        mode: setting?.themeMode,
        ...uiThemePalette,
      },
    };

    return createTheme(uiThemeOptions);
  }, [setting?.uiThemeName, setting?.themeMode]);

  // content theme / reading page theme
  const contentStyles: ContentStyles = React.useMemo(() => {
    const baseStyles = {
      fontSize: `${setting.fontSize ?? 1.5}rem`,
      lineHeight: `${setting.lineHeight ?? 150}%`,
    };

    if (setting?.themeMode === ThemeModes.Dark) {
      return {
        ...ContentThemePalette.dark,
        ...baseStyles,
      };
    } else {
      const contentThemePalette =
        ContentThemePalette[setting?.contentThemeName] ??
        ContentThemePalette.lightGrey;
      return {
        ...contentThemePalette,
        ...baseStyles,
      };
    }
  }, [
    setting?.contentThemeName,
    setting?.themeMode,
    setting?.fontSize,
    setting?.lineHeight,
  ]);

  // on language change
  React.useEffect(() => {
    i18n.changeLanguage && i18n.changeLanguage(setting?.language);
  }, [setting?.language]);

  return (
    <SettingContext.Provider
      value={{
        contentStyles: contentStyles,
        setting: setting,
        setSetting: setSettingWrapper,
      }}
    >
      <ThemeProvider theme={uiTheme}>{props.children}</ThemeProvider>
    </SettingContext.Provider>
  );
};

export const useSetting = () => {
  return React.useContext<SettingContextType>(SettingContext);
};
