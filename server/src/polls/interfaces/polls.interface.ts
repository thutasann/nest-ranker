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
