/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';

export type MainContextType = {
  src: string;
};

export const MainContextDefault: MainContextType = {
  src: '',
};

export const MainContext =
  React.createContext<MainContextType>(MainContextDefault);

