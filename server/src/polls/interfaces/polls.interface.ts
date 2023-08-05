import { Request } from '@nestjs/common';

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

// ---- Request Structure

interface IAuthPayload {
  userID: string;
  pollID: string;
  name: string;
}

/**
 * Guard Auth Request
 */
export type IRequestWithAuth = Request & IAuthPayload;
