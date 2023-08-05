import { Injectable, Logger } from '@nestjs/common';
import { IPoll } from 'shared';
import {
  ICreatePollFields,
  IJoinPollFields,
  IRejoinPollFields,
} from './interfaces/polls.interface';
import { PollsRepository } from './respository/polls.repository';
import { createPollID, createUserID } from './utils/ids';

@Injectable()
export class PollService {
  private readonly logger = new Logger(PollService.name);
  constructor(private readonly pollsRepository: PollsRepository) {}

  async createPoll(fields: ICreatePollFields): Promise<{ poll: IPoll }> {
    const pollID = createPollID();
    const userID = createUserID();

    const createdPoll = await this.pollsRepository.createPoll({
      ...fields,
      pollID,
      userID,
    });

    // TODO: - create an accessToken based off of pollID and userID

    return {
      poll: createdPoll,
    };
  }

  async joinPoll(fields: IJoinPollFields): Promise<{ poll: IPoll }> {
    const userID = createUserID();

    this.logger.debug(
      `fetching poll with ID: ${fields.pollID} for user with ID: ${userID}`,
    );

    const joinedPoll = await this.pollsRepository.getPoll(fields.pollID);

    return {
      poll: joinedPoll,
    };
  }

  async rejoinPoll(fields: IRejoinPollFields): Promise<IPoll> {
    this.logger.debug(
      `🚀 Rejoinning poll with ID: ${fields.pollID} for user with ID: ${fields.userID} with name: ${fields.name}`,
    );
    const joinedPoll = await this.pollsRepository.addParticipant(fields);
    return joinedPoll;
  }
}
