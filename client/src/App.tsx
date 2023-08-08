import React, { Fragment } from 'react';
import './index.css';
import Pages from './Pages';
import { devtools } from 'valtio/utils';
import { state } from './states';
import { useSnapshot } from 'valtio';
import Loader from './components/ui/Loader';

devtools(state, 'app state');
const App: React.FC = () => {
  const currentState = useSnapshot(state);
  return (
    <Fragment>
      <Loader isLoading={currentState.isLoading} color="orange" width={120} />
      <Pages />
    </Fragment>
  );
};

export default App;
