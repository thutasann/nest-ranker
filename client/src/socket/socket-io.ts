import { io, Socket } from 'socket.io-client';
import { actions, AppActions } from '../states';
import { AppState } from '../states/types';

export const socketIOUrl = `http://${import.meta.env.VITE_API_HOST}:${
  import.meta.env.VITE_API_PORT
}/${import.meta.env.VITE_POLLS_NAMESPACE}`;

interface ICreateSocketOptions {
  socketIOUrl: string;
  state: AppState;
  actions: AppActions;
}

/**
 * Create Socket Connection
 */
export const createSocketWithHandlers = ({
  socketIOUrl,
  state,
}: ICreateSocketOptions): Socket => {
  console.log(`🌟 Creating socket with accessToken: ${state.accessToken}`);

  const socket = io(socketIOUrl, {
    auth: {
      token: state.accessToken,
    },
    transports: ['websocket', 'polling'],
  });

  // connect (general)
  socket.on('connect', () => {
    console.log(
      `✅ Connected with socketID: ${socket.id} userID ${state.me?.id} will join room ${state.poll?.id}`,
    );
    actions.stopLoading();
  });

  // connect_error (general)
  socket.on('connect_error', () => {
    console.log(`🛑 Failed to connect socket`);

    actions.addWsError({
      type: 'Connection Error',
      mesage: 'Failed to connect to the Poll',
    });

    actions.stopLoading();
  });

  // exception (general)
  socket.on('exception', (error) => {
    console.log(`🛑 Ws Exception error: `, error);
    actions.addWsError(error);
  });

  // poll_updated
  socket.on('poll_updated', (poll) => {
    console.log('event: `poll_updated` received', poll);
    actions.updatePoll(poll);
  });

  return socket;
};
