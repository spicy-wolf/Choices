import * as DB from '@src/Database';
import React, { useContext, useEffect, useState } from 'react';

export type DbContextType = {
  context: DB.Interfaces.IDbContext;
};

export const DbContextDefault: DbContextType = {
  context: null,
};

export const DbReactContext =
  React.createContext<DbContextType>(DbContextDefault);

// component
export const DbContextProvider = (props: { children: React.ReactNode }) => {
  const [dbContext, setDbContext] = useState<DbContextType>();

  // init
  useEffect(() => {
    if (!dbContext) {
      const _dbContext = new DB.DbContext();
      setDbContext(_dbContext);
    }
  }, []);

  return (
    <>
      <DbReactContext.Provider value={dbContext}>
        {props.children}
      </DbReactContext.Provider>
    </>
  );
};

// hooks
export const useDbContext = () => {
  const DbContext = useContext(DbReactContext);
  return DbContext;
};
