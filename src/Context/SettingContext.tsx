import React from 'react';

type SettingContextType = {
  themeName: string; // selected theme name
  fontSize: number;
} & {
  setSetting: (fieldName: string, value: any) => Promise<void> | void;
};

const SettingContextDefault: SettingContextType = {
  themeName: 'light',
  fontSize: 20,
  setSetting: () => {},
};

const ContextInstance = React.createContext<SettingContextType>(
  SettingContextDefault
);

type SettingContextProps = {
  children: JSX.Element;
};
export const SettingContext = (props: SettingContextProps) => {
  const [setting, setSetting] = React.useState<SettingContextType>(
    SettingContextDefault
  );

  const setSettingWrapper = async (
    fieldName: keyof SettingContextType,
    value: any
  ): Promise<void> => {
    const newSetting: SettingContextType = { ...setting, [fieldName]: value };
    // TODO: update DB
    setSetting(newSetting);
  };

  return (
    <ContextInstance.Provider
      value={{ ...setting, setSetting: setSettingWrapper }}
    >
      {props.children}
    </ContextInstance.Provider>
  );
};

export const useSetting = () => {
  return React.useContext<SettingContextType>(ContextInstance);
};

//#region theme
export type ThemeContextType = {
  contentBgColor: string;
  contentFontColor: string;
  sidePanelBgColor: string;
  sidePanelSectionColor: string;
  sidePanelFontColor: string;
};

const ThemeList: { [key: string]: ThemeContextType } = {
  light: {
    contentBgColor: '#f9f9f9',
    contentFontColor: 'rgb(51, 51, 51)',
    sidePanelBgColor: '#ebebeb',
    sidePanelSectionColor: 'rgb(248, 249, 250)',
    sidePanelFontColor: '#212529',
  },
  dark: {
    contentBgColor: 'rgb(29, 31, 33)',
    contentFontColor: 'rgb(197, 200, 198)',
    sidePanelBgColor: '#121212',
    sidePanelSectionColor: '#262626',
    sidePanelFontColor: '#FFFFFF',
  },
};

export const useTheme = () => {
  const context = React.useContext<SettingContextType>(ContextInstance);
  const themeName: string = context?.themeName ?? 'light';
  const selectedTheme = ThemeList[themeName];
  return selectedTheme;
};
//#endregion
