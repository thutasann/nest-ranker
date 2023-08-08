import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useSnapshot } from 'valtio';
import Create from './pages/Create';
import Join from './pages/Join';
import Welcome from './pages/Welcome';
import { AppPage, state } from './states';

const routesConfig = {
  [AppPage.Welcome]: Welcome,
  [AppPage.Create]: Create,
  [AppPage.Join]: Join,
};

const Pages = () => {
  const currentState = useSnapshot(state);
  const nodeRef = useRef(null);

  return (
    <>
      {Object.entries(routesConfig).map(([page, Component]) => (
        <CSSTransition
          nodeRef={nodeRef}
          in={page === currentState.currentPage}
          key={page}
          timeout={300}
          className="page"
          unmountOnExit
        >
          <div
            ref={nodeRef}
            className="page mobile-height max-w-screen mx-auto py-8 px-4 overflow-y-auto"
          >
            <Component />
          </div>
        </CSSTransition>
      ))}
    </>
  );
};

export default Pages;
