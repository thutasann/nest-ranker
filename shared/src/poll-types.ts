type NorminationID = string;

export interface IParticipants {
  [participantID: NorminationID]: string;
}

export interface IRankings {
  [userID: string]: NorminationID[];
}

export type IResults = Array<{
  nominationID: NorminationID;
  nominationText: string;
  score: number;
}>;

export interface IPoll {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: IParticipants;
  adminID: string;
  hasStarted: boolean;
  norminations: INorminations;
  rankings: IRankings;
  results: IResults;
}

export interface INormation {
  userID: string;
  text: string;
}

export interface INorminations {
  [norminationID: string]: INormation;
}
