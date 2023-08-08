import React, { useEffect } from 'react';
import { actions } from '../states';

const WaitingRoom = () => {
  useEffect(() => {
    actions.initializedSocket();
  }, []);

  return (
    <div className="flex flex-col w-full justify-between items-center h-full">
      <h1>Waiting room</h1>
    </div>
  );
};

export default WaitingRoom;
