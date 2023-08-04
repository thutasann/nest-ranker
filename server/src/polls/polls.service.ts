import { Injectable } from '@nestjs/common';
import {
  ICreatePollFields,
  IJoinPollFields,
  IRejoinPollFields,
} from './interfaces/polls.interface';
import { createPollID, createUserID } from './utils/ids';

@Injectable()
export class PollService {
  async createPoll(fields: ICreatePollFields) {
    const pollID = createPollID();
    const userID = createUserID();

    return {
      ...fields,
      pollID,
      userID,
    };
  }

  async joinPoll(fields: IJoinPollFields) {
    const userID = createUserID();
    return {
      ...fields,
      userID,
    };
  }

  async rejoinPoll(fields: IRejoinPollFields) {
    return fields;
  }
}
