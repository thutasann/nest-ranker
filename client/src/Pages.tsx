import React, { Fragment, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useSnapshot } from 'valtio';
import Create from './pages/Create';
import Join from './pages/Join';
import Results from './pages/Results';
import Voting from './pages/Voting';
import WaitingRoom from './pages/WaitingRoom';
import Welcome from './pages/Welcome';
import { actions, state } from './states';
import { AppPage } from './states/types';

const routesConfig = {
  [AppPage.Welcome]: Welcome,
  [AppPage.Create]: Create,
  [AppPage.Join]: Join,
  [AppPage.WaitingRoom]: WaitingRoom,
  [AppPage.Voting]: Voting,
  [AppPage.Results]: Results,
};

const Pages = () => {
  const currentState = useSnapshot(state);
  console.log('currentState', currentState.hasVoted);

  const nodeRef = useRef(null);

  useEffect(() => {
    if (
      currentState.me?.id &&
      currentState.poll &&
      !currentState.poll?.hasStarted
    ) {
      actions.setPage(AppPage.WaitingRoom);
    }

    if (currentState.me?.id && currentState.poll?.hasStarted) {
      actions.setPage(AppPage.Voting);
    }

    if (currentState.me?.id && currentState.hasVoted) {
      actions.setPage(AppPage.Results);
    }
  }, [
    currentState.me?.id,
    currentState.poll?.hasStarted,
    currentState.hasVoted,
  ]);

  return (
    <Fragment>
      {Object.entries(routesConfig).map(([page, Component]) => (
        <CSSTransition
          nodeRef={nodeRef}
          in={page === currentState.currentPage}
          key={page}
          timeout={300}
          classNames="page"
          unmountOnExit
        >
          <div
            ref={nodeRef}
            className="page mobile-height max-w-screen-sm mx-auto py-8 px-4 overflow-y-auto"
          >
            <Component />
          </div>
        </CSSTransition>
      ))}
    </Fragment>
  );
};

export default Pages;
