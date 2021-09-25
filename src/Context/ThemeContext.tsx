import React from 'react';

export type ThemeContextType = {
  contentBgColor: string;
  contentFontColor: string;
  sidePanelBgColor: string;
  sidePanelSectionColor: string;
  sidePanelFontColor: string;
} & {
  setTheme: (value: ThemeContextType) => void;
};

type ThemeContextProps = {
  children: JSX.Element;
};

export const ThemeContextDefault: ThemeContextType = {
  contentBgColor: 'rgb(29, 31, 33)',
  //contentBgColor: '#f9f9f9',
  contentFontColor: 'rgb(197, 200, 198)',
  //contentFontColor: 'rgb(51, 51, 51)',
  sidePanelBgColor: '#ebebeb',
  sidePanelSectionColor: 'rgb(248, 249, 250)',
  sidePanelFontColor: '#212529',
  setTheme: () => {},
};

const ContextInstance =
  React.createContext<ThemeContextType>(ThemeContextDefault);

export const ThemeContext = (props: ThemeContextProps) => {
  const [theme, setTheme] =
    React.useState<ThemeContextType>(ThemeContextDefault);

  return (
    <ContextInstance.Provider value={{ ...theme, setTheme: setTheme }}>
      {props.children}
    </ContextInstance.Provider>
  );
};

export const useTheme = () => {
  return React.useContext<ThemeContextType>(ContextInstance);
};
