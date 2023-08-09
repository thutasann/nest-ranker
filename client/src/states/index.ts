import { IPoll } from 'shared';
import { proxy, ref } from 'valtio';
import { derive, subscribeKey } from 'valtio/utils';
import { getTokenPayload } from '../util';
import { AppPage, AppState, IWsError } from './types';
import { createSocketWithHandlers, socketIOUrl } from '../socket/socket-io';
import { nanoid } from 'nanoid';

/**
 * Initial State
 */
const state: AppState = proxy({
  isLoading: false,
  currentPage: AppPage.Welcome,
  wsErrors: [],
});

/**
 * Derived State
 */
const statewWithComputed: AppState = derive(
  {
    me: (get) => {
      const accessToken = get(state).accessToken;

      if (!accessToken) {
        return;
      }

      const token = getTokenPayload(accessToken);
      console.log('token', token);

      return {
        id: token.sub,
        name: token.name,
      };
    },
    isAdmin: (get) => {
      if (!get(state).me) {
        return false;
      }
      return get(state).me?.id === get(state).poll?.adminID;
    },
  },
  {
    proxy: state,
  },
);

/**
 * Actions
 */
const actions = {
  startLoading: (): void => {
    state.isLoading = true;
  },

  stopLoading: (): void => {
    state.isLoading = false;
  },

  setPage: (page: AppPage): void => {
    state.currentPage = page;
  },

  startOver: (): void => {
    actions.setPage(AppPage.Welcome);
  },

  initilizePoll: (poll?: IPoll) => {
    state.poll = poll;
  },

  setPollAccessToken: (token: string) => {
    state.accessToken = token;
  },

  initializedSocket: (): void => {
    if (!state.socket) {
      state.socket = ref(
        createSocketWithHandlers({
          socketIOUrl,
          state,
          actions,
        }),
      );
    } else {
      state.socket.connect();
    }
  },

  updatePoll: (poll: IPoll) => {
    state.poll = poll;
  },

  addWsError: (error: IWsError): void => {
    state.wsErrors = [
      ...state.wsErrors,
      {
        ...error,
        id: nanoid(),
      },
    ];
  },

  removeError: (id: string): void => {
    state.wsErrors = state.wsErrors.filter((error) => error.id !== id);
  },
};

subscribeKey(state, 'accessToken', () => {
  if (state.accessToken && state.poll) {
    localStorage.setItem('accessToken', state.accessToken);
  }
});

export type AppActions = typeof actions;

export { statewWithComputed as state, actions };
