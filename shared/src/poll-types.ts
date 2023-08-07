type NorminationID = string;

export interface IParticipants {
  [participantID: NorminationID]: string;
}

export interface IRankings {
  [userID: string]: NorminationID[];
}

export interface IPoll {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: IParticipants;
  adminID: string;
  hasStarted: boolean;
  norminations: INorminations;
  rankings: IRankings;
}

export interface INormation {
  userID: string;
  text: string;
}

export interface INorminations {
  [norminationID: string]: INormation;
}
