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
    if (!dbContext) {
      const _dbContext: DB.AbstractDbContext = new DB.DbContext();
      setDbContext(_dbContext);
    }
  }, []);

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
