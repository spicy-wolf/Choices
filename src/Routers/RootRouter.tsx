import React from 'react';
import { Main } from '@src/Containers';
import { WelcomeModal } from '@src/Containers';
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
        <Route path="/">
          <Main />
        </Route>
      </Switch>

      {/* Show the modal when a background page is set */}
      {background && (
        <Route path="/WelcomeModal">
          <WelcomeModal closeModal={() => history?.goBack()} />
        </Route>
      )}
    </>
  );
};

export default RootRouter;
