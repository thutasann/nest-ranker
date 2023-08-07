import { Request } from 'express';
import { INormation } from 'shared';
import { Socket } from 'socket.io';

// ----- Service Fields Types
export interface ICreatePollFields {
  topic: string;
  votesPerVoter: number;
  name: string;
}

export interface IJoinPollFields {
  pollID: string;
  name: string;
}

export interface IRejoinPollFields {
  pollID: string;
  userID: string;
  name: string;
}

export interface IAddParticipantFields {
  pollID: string;
  userID: string;
  name: string;
}

export interface IAddNorminationFields {
  pollID: string;
  userID: string;
  text: string;
}

export interface ISubmitRankingsFields {
  pollID: string;
  userID: string;
  rankings: string[];
}

// -----  Repositories Types
export interface CreatePollDataProps {
  pollID: string;
  topic: string;
  votesPerVoter: number;
  userID: string;
}

export interface AddParticipantDataProps {
  pollID: string;
  userID: string;
  name: string;
}

export interface AddNorminationDataProps {
  pollID: string;
  norminationID: string;
  normination: INormation;
}

export interface AddParticipantRankingsDataProps {
  pollID: string;
  userID: string;
  rankings: string[];
}

// ---- Request Structure

export interface IAuthPayload {
  userID: string;
  pollID: string;
  name: string;
}

export interface IAddNorminationData {
  pollID: string;
  norminationID: string;
  normination: INormation;
}

/**
 * Guard Auth Request
 */
export type IRequestWithAuth = Request & IAuthPayload;

/**
 * Socket With Auth
 */
export type ISocketWithAuth = Socket & IAuthPayload;
