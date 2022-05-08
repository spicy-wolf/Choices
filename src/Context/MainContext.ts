import React from 'react';

export type MainContextType = {
  src: string;
};

export const MainContextDefault: MainContextType = {
  src: '',
};

export const MainContext =
  React.createContext<MainContextType>(MainContextDefault);
