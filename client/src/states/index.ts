import { IPoll } from 'shared';
import { proxy, ref } from 'valtio';
import { subscribeKey } from 'valtio/utils';
import { getTokenPayload } from '../util';
import { AppPage, AppState, IWsError } from './types';
import { createSocketWithHandlers, socketIOUrl } from '../socket/socket-io';
import { nanoid } from 'nanoid';
import { IActions } from './actions.interface';

const state = proxy<AppState>({
  isLoading: false,
  currentPage: AppPage.Welcome,
  wsErrors: [],
  get me() {
    const accessToken = this.accessToken;
    if (!accessToken) {
      return;
    }
    const token = getTokenPayload(accessToken);
    return {
      id: token.sub,
      name: token.name,
    };
  },
  get isAdmin() {
    if (!this.me) {
      return false;
    }
    return this.me?.id === this.poll?.adminID;
  },
  get norminationCount() {
    return Object.keys(this.poll?.participants || {}).length;
  },
  get participantCount() {
    return Object.keys(this.poll?.participants || {}).length;
  },
  get canStartVote() {
    const votesPerVoter = this.poll?.votesPerVoter ?? 100;
    return this.norminationCount >= votesPerVoter;
  },
});

/**
 * Actions
 */
const actions: IActions = {
  startLoading: (): void => {
    state.isLoading = true;
  },

  stopLoading: (): void => {
    state.isLoading = false;
  },

  setPage: (page: AppPage): void => {
    state.currentPage = page;
  },

  initilizePoll: (poll?: IPoll): void => {
    state.poll = poll;
  },

  setPollAccessToken: (token: string): void => {
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

  norminate: (text: string): void => {
    state.socket?.emit('norminate', { text });
  },

  removeNormination: (id: string): void => {
    state.socket?.emit('remove_normination', { id });
  },

  startOver: (): void => {
    actions.reset();
    localStorage.removeItem('accessToken');
    actions.setPage(AppPage.Welcome);
  },

  reset: (): void => {
    state.socket?.disconnect();
    state.poll = undefined;
    state.accessToken = undefined;
    state.isLoading = false;
    state.socket = undefined;
    state.wsErrors = [];
  },

  removeParticipant: (id: string) => {
    state.socket?.emit('remove_participant', { id });
  },

  startVote: () => {
    state.socket?.emit('start_vote');
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

/**
 * Subscription to state
 */
subscribeKey(state, 'accessToken', () => {
  if (state.accessToken && state.poll) {
    localStorage.setItem('accessToken', state.accessToken);
  }
});

export type AppActions = typeof actions;

export { state, actions };
