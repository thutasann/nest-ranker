import React, { useState } from 'react';
import { IPoll } from 'shared';
import { makeRequest } from '../api';
import { actions } from '../states';
import { AppPage } from '../states/types';

const Join = () => {
  const [pollID, setpollID] = useState('');
  const [name, setName] = useState('');
  const [apiError, setApiError] = useState('');

  const checkFieldsValid = (): boolean => {
    if (pollID.length < 6 || pollID.length > 6) {
      return false;
    }
    if (name.length < 1 || name.length > 25) {
      return false;
    }
    return true;
  };

  const handleJoinPoll = async () => {
    actions.startLoading();
    setApiError('');

    const { data, error } = await makeRequest<{
      poll: IPoll;
      accessToken: string;
    }>(`/polls/join`, {
      method: 'POST',
      body: JSON.stringify({
        pollID,
        name,
      }),
    });

    if (error && error.statusCode === 400) {
      setApiError(`Please make sure to include a poll topic`);
    } else if (error && !error.statusCode) {
      setApiError(`Unknown API error`);
    } else if (error?.statusCode === 500) {
      setApiError('Something went wrong!');
    } else {
      actions.initilizePoll(data.poll);
      actions.setPollAccessToken(data.accessToken);
      actions.setPage(AppPage.WaitingRoom);
    }
    actions.stopLoading();
  };

  return (
    <div className="flex flex-col w-full justify-around items-stretch h-full mx-auto max-w-sm">
      <div>
        <div className="mb-4">
          <h3 className="text-center">Enter Code provided by Friend</h3>
          <div className="text-center w-full">
            <input
              maxLength={6}
              onChange={(e) => setpollID(e.target.value.toUpperCase())}
              className="box info w-full"
              autoCapitalize="characters"
              style={{
                textTransform: 'uppercase',
              }}
            />
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-center">Your Name</h3>
          <div className="text-center w-full">
            <input
              maxLength={25}
              onChange={(e) => setName(e.target.value)}
              className="box info w-full"
            />
          </div>
        </div>
        {apiError ? (
          <p className="text-center bg-red-600 py-1 rounded-md text-white">
            {apiError || 'something went wrong!'}
          </p>
        ) : null}
        <div className="my-12 flex items-center gap-3">
          <button
            className="box btn-purple w-32 my-2"
            onClick={() => actions.startOver()}
          >
            Start over
          </button>
          <button
            className="box btn-orange w-32 my-2"
            onClick={handleJoinPoll}
            disabled={!checkFieldsValid()}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default Join;
