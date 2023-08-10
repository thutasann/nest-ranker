import { IPoll } from 'shared';
import { AppPage, IWsError } from './types';

export interface IActions {
  startLoading: () => void;
  stopLoading: () => void;
  setPage: (page: AppPage) => void;

  initilizePoll: (poll?: IPoll) => void;
  setPollAccessToken: (token: string) => void;

  initializedSocket: () => void;
  updatePoll: (poll: IPoll) => void;
  norminate: (text: string) => void;
  removeNormination: (id: string) => void;
  removeParticipant: (id: string) => void;
  startVote: () => void;
  submitRankings: (rankings: string[]) => void;
  cancelPoll: () => void;
  closePoll: () => void;

  startOver: () => void;
  reset: () => void;

  addWsError: (error: IWsError) => void;
  removeError: (id: string) => void;
}
