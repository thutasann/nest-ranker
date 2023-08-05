import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
  constructor(
    private readonly pollsRepository: PollsRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createPoll(
    fields: ICreatePollFields,
  ): Promise<{ poll: IPoll; accessToken: string }> {
    const pollID = createPollID();
    const userID = createUserID();

    const createdPoll = await this.pollsRepository.createPoll({
      ...fields,
      pollID,
      userID,
    });

    this.logger.debug(
      `🔐 Creating token string for pollID: ${createdPoll.id} and userId: ${userID}`,
    );

    const signedString = this.jwtService.sign(
      {
        pollID: createdPoll.id,
        name: fields.name,
      },
      {
        subject: userID,
      },
    );

    return {
      poll: createdPoll,
      accessToken: signedString,
    };
  }

  async joinPoll(
    fields: IJoinPollFields,
  ): Promise<{ poll: IPoll; accessToken: string }> {
    const userID = createUserID();

    this.logger.debug(
      `fetching poll with ID: ${fields.pollID} for user with ID: ${userID}`,
    );

    const joinedPoll = await this.pollsRepository.getPoll(fields.pollID);

    this.logger.debug(
      `Creating token string for pollID: ${joinedPoll.id} and userID: ${userID}`,
    );

    const signedString = this.jwtService.sign(
      {
        pollID: joinedPoll.id,
        name: fields.name,
      },
      {
        subject: userID,
      },
    );

    return {
      poll: joinedPoll,
      accessToken: signedString,
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
