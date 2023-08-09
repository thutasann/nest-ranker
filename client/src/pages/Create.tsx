import React, { useState } from 'react';
import { makeRequest } from '../api';
import CountSelector from '../components/ui/CountSelector';
import { actions } from '../states';
import { IPoll } from 'shared';
import { AppPage } from '../states/types';

const Create = () => {
  const [pollTopic, setPollTopic] = useState('');
  const [maxVotes, setMaxVotes] = useState(3);
  const [apiError, setApiError] = useState<string>('');
  const [name, setName] = useState('');

  const checkFieldsValid = (): boolean => {
    if (pollTopic.length < 1 || pollTopic.length > 100) {
      return false;
    }

    if (maxVotes < 1 || maxVotes > 5) {
      return false;
    }

    if (name.length < 1 || name.length > 25) {
      return false;
    }

    return true;
  };

  const handleCreatePoll = async () => {
    actions.startLoading();
    setApiError('');

    const { data, error } = await makeRequest<{
      poll: IPoll;
      accessToken: string;
    }>(`/polls`, {
      method: 'POST',
      body: JSON.stringify({
        topic: pollTopic,
        votesPerVoter: maxVotes,
        name,
      }),
    });

    console.log(data, error);

    if (error && error.statusCode === 400) {
      console.log('400 error', error);
      setApiError('Name and poll topic are both required!');
    } else if (error && error.statusCode !== 400) {
      setApiError(error.messages[0]);
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
      <div className="mb-3">
        <h3 className="text-center">Enter poll topic</h3>
        <div className="text-center w-full">
          <input
            maxLength={100}
            onChange={(e) => setPollTopic(e.target.value)}
            className="box info w-full"
          />
        </div>
        <h3 className="text-center mt-4 mb-2">Voters Per Participant</h3>
        <div className="w-48 mx-auto my-4">
          <CountSelector
            min={1}
            max={5}
            initial={2}
            step={1}
            onChange={(val) => setMaxVotes(val)}
          />
        </div>
        <div className="mb-4">
          <h3 className="text-center">Enter Name</h3>
          <div className="text-center w-full">
            <input
              maxLength={25}
              onChange={(e) => setName(e.target.value)}
              className="box info w-full"
            />
          </div>
        </div>
      </div>
      {apiError ? (
        <p className="text-center bg-red-600 py-1 rounded-md text-white">
          {apiError || 'something went wrong!'}
        </p>
      ) : null}
      <div className="flex gap-3 justify-center items-center">
        <button
          className="box btn-purple w-32 my-2"
          onClick={() => actions.startOver()}
        >
          Start over
        </button>
        <button
          className="box btn-orange w-32 my-2"
          onClick={handleCreatePoll}
          disabled={!checkFieldsValid()}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default Create;
