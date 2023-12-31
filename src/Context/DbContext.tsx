/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import * as DB from '@src/Database';
import React, { useContext, useEffect, useState } from 'react';

export type DbContextType = {
  dbContext: DB.AbstractDbContext;
};

export const DbContextDefault: DbContextType = {
  dbContext: null,
};

export const DbReactContext =
  React.createContext<DbContextType>(DbContextDefault);

// component
export const DbContextProvider = (props: { children: React.ReactNode }) => {
  const [dbContext, setDbContext] = useState<DB.AbstractDbContext>();

  // init
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (!dbContext) {
      const _dbContext: DB.AbstractDbContext = new DB.DbContext();
      await _dbContext.init();
      setDbContext(_dbContext);
    }
  };

  return (
    <>
      <DbReactContext.Provider value={{ dbContext }}>
        {props.children}
      </DbReactContext.Provider>
    </>
  );
};

// hooks
export const useDbContext = () => {
  const { dbContext } = useContext(DbReactContext);
  return { dbContext } as const;
};

