import React from 'react';
import { actions, AppPage } from '../states';

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="text-center font-bold mt-12">Welcome to Nest Ranker</h1>
      <div className=" mt-5 flex items-center gap-3 justify-center">
        <button
          className="box btn-orange my-2"
          onClick={() => {
            actions.setPage(AppPage.Create);
          }}
        >
          Create new poll
        </button>
        <button
          className="box btn-purple my-2"
          onClick={() => {
            actions.setPage(AppPage.Join);
          }}
        >
          Join existing poll
        </button>
      </div>
    </div>
  );
};

export default Welcome;
