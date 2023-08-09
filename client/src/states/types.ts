import { IPoll } from 'shared';
import { Socket } from 'socket.io-client';

export enum AppPage {
  Welcome = 'welcome',
  Create = 'create',
  Join = 'join',
  WaitingRoom = 'waiting-room',
}
export interface IMe {
  id: string;
  name: string;
}

export interface IWsError {
  type: string;
  mesage: string;
}

export type IWsErrorUnique = IWsError & {
  id: string;
};

export interface AppState {
  currentPage: AppPage;
  me?: IMe;
  isLoading: boolean;
  poll?: IPoll;
  accessToken?: string;
  socket?: Socket;
  wsErrors: IWsErrorUnique[];
}
