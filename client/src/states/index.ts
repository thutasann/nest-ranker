import { IPoll } from 'shared';
import { proxy } from 'valtio';
import { derive, subscribeKey } from 'valtio/utils';
import { getTokenPayload } from '../util';
import { AppPage, AppState } from './types';

const state: AppState = proxy({
  isLoading: false,
  currentPage: AppPage.Welcome,
});

const statewWithComputed: AppState = derive(
  {
    me: (get) => {
      const accessToken = get(state).accessToken;

      if (!accessToken) {
        return;
      }

      const token = getTokenPayload(accessToken);

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
};

subscribeKey(state, 'accessToken', () => {
  if (state.accessToken && state.poll) {
    localStorage.setItem('accessToken', state.accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
});

export { statewWithComputed as state, actions };
