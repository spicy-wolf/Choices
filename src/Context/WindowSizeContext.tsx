import React, { useLayoutEffect } from 'react';
import { useState } from 'react';

type WindowSizeContextType = {
  innerWidth: number;
  innerHeight: number;
};
const WindowSizeContextDefault: WindowSizeContextType = {
  innerWidth: 0,
  innerHeight: 0,
};

const ContextInstance = React.createContext<WindowSizeContextType>(
  WindowSizeContextDefault
);

type WindowSizeContextProps = {
  children: React.ReactNode;
};
export const WindowSizeContextProvider = (props: WindowSizeContextProps) => {
  const [size, setSize] = useState<WindowSizeContextType>(
    WindowSizeContextDefault
  );

  useLayoutEffect(() => {
    function updateSize() {
      setSize({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <ContextInstance.Provider
      value={{ innerWidth: size.innerWidth, innerHeight: size.innerHeight }}
    >
      {props.children}
    </ContextInstance.Provider>
  );
};

export const useWindowSize = () => {
  return React.useContext<WindowSizeContextType>(ContextInstance);
};
