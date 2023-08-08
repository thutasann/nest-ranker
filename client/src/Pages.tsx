import React, { Fragment, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useSnapshot } from 'valtio';
import Create from './pages/Create';
import Join from './pages/Join';
import WaitingRoom from './pages/WaitingRoom';
import Welcome from './pages/Welcome';
import { AppPage, state } from './states';

const routesConfig = {
  [AppPage.Welcome]: Welcome,
  [AppPage.Create]: Create,
  [AppPage.Join]: Join,
  [AppPage.WaitingRoom]: WaitingRoom,
};

const Pages = () => {
  const currentState = useSnapshot(state);
  const nodeRef = useRef(null);

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