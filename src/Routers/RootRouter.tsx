import React from 'react';
import { RouterPathStrings } from '@src/Constants';
import { Main, WelcomeModal } from '@src/Containers';
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
        <Route path={RouterPathStrings.MAIN_PAGE}>
          <Main />
        </Route>
      </Switch>

      {/* Show the modal when a background page is set */}
      {background && (
        <Route path={RouterPathStrings.WELCOME_MODAL}>
          <WelcomeModal closeModal={() => history?.goBack()} />
        </Route>
      )}
    </>
  );
};

export default RootRouter;
