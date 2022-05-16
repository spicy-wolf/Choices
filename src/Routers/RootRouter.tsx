import React from 'react';
import { RouterPathStrings } from '@src/Constants';
import { Main, Read } from '@src/Containers';
import {
  Switch,
  Route,
  useLocation,
  useHistory,
  Redirect,
} from 'react-router-dom';

const RootRouter = () => {
  let history = useHistory();
  let location = useLocation<{ background: ReturnType<typeof useLocation> }>();

  // https://reactrouter.com/web/example/modal-gallery
  let background = location.state?.background;

  return (
    <>
      <Switch location={background || location}>
        <Route path={RouterPathStrings.READ_PAGE}>
          <Read />
        </Route>
        <Route path={RouterPathStrings.MAIN_PAGE}>
          <Main />
        </Route>
      </Switch>

      {/* Show the modal when a background page is set */}
      {background && <></>}
    </>
  );
};

export default RootRouter;
