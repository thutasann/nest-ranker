import { proxy } from 'valtio';

export enum AppPage {
  Welcome = 'welcome',
  Create = 'create',
  Join = 'join',
}

export interface AppState {
  currentPage: AppPage;
}

const state: AppState = proxy({
  currentPage: AppPage.Welcome,
});

const actions = {
  setPage: (page: AppPage): void => {
    state.currentPage = page;
  },
};

export { state, actions };
