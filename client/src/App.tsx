import React, { Fragment, useEffect } from 'react';
import './index.css';
import Pages from './Pages';
import { devtools } from 'valtio/utils';
import { actions, state } from './states';
import { useSnapshot } from 'valtio';
import Loader from './components/ui/Loader';
import { getTokenPayload } from './util';
import SnackBar from './components/ui/SnackBar';

devtools(state, 'app state');
const App: React.FC = () => {
  const { isLoading, wsErrors } = useSnapshot(state);

  useEffect(() => {
    console.log(
      `🚀 App useEffect - check token and send to proper page for Reconnecting`,
    );
    actions.startLoading();

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      actions.stopLoading();
      return;
    }

    const { exp: tokenExp } = getTokenPayload(accessToken);
    const currentTimeInSeconds = Date.now() / 1000;

    // Remove old token
    // if token is within 10 seconds, we will prevent
    // them from connection (poll will amost be over)
    if (tokenExp < currentTimeInSeconds - 10) {
      localStorage.removeItem('accessToken');
      actions.stopLoading();
      return;
    }

    // reconnect to poll
    actions.setPollAccessToken(accessToken); // needed for socket.io connection

    // socket initialization on server sends updated poll to the client
    actions.initializedSocket();
  }, []);

  return (
    <Fragment>
      <Loader isLoading={isLoading} color="orange" width={120} />
      {wsErrors?.map((error) => (
        <SnackBar
          key={error.id}
          type="error"
          title={error.type}
          message={error.mesage}
          show
          onClose={() => actions.removeError(error.id)}
          autoCloseDuration={5000}
        />
      ))}
      <Pages />
    </Fragment>
  );
};

export default App;
