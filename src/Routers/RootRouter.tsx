import React from 'react';
import { RouterPathStrings } from '@src/Constants';
import { File2ScriptConverter, Library, Read } from '@src/Containers';
import {
  Routes,
  Route,
  Location,
  useLocation,
  Navigate,
} from 'react-router-dom';

const RootRouter = () => {
  let location = useLocation();

  // https://reactrouter.com/docs/en/v6/examples/modal
  let state = location.state as {
    backgroundLocation?: Location;
  };

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path={RouterPathStrings.READ_PAGE} element={<Read />} />
        <Route
          path={RouterPathStrings.FILE_2_SCRIPT_PAGE}
          element={<File2ScriptConverter />}
        />
        <Route path={RouterPathStrings.LIBRARY_PAGE} element={<Library />} />
        <Route
          path=""
          element={<Navigate to={RouterPathStrings.LIBRARY_PAGE} />}
        />
      </Routes>

      {/* Show the modal when a background page is set */}
      {state?.backgroundLocation && (
        <Routes>{/* place modal route here */}</Routes>
      )}
    </>
  );
};

export default RootRouter;
