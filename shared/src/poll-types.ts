export interface IParticipants {
  [participantID: string]: string;
}

export interface IPoll {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: IParticipants;
  adminID: string;
  hasStarted: boolean;
}
