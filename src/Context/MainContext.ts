import React from 'react';

export type MainContextType = {
  v: string;
  src: string;
};

export const MainContextDefault: MainContextType = {
  v: '',
  src: '',
};

export const MainContext =
  React.createContext<MainContextType>(MainContextDefault);
