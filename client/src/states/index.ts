import { IPoll } from 'shared';
import { proxy } from 'valtio';

export enum AppPage {
  Welcome = 'welcome',
  Create = 'create',
  Join = 'join',
  WaitingRoom = 'waiting-room',
}

export interface AppState {
  currentPage: AppPage;
  isLoading: boolean;
  poll?: IPoll;
  accessToken?: string;
}

const state: AppState = proxy({
  isLoading: false,
  currentPage: AppPage.Welcome,
});

const actions = {
  startLoading: (): void => {
    state.isLoading = true;
  },
  endLoading: (): void => {
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

export { state, actions };
