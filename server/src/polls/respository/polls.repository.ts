import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { IORedisKey } from 'src/redis.module';
import {
  AddParticipantDataProps,
  AddParticipantRankingsDataProps,
  CreatePollDataProps,
  IAddNorminationData,
} from '../interfaces/polls.interface';
import { IPoll } from 'shared';

@Injectable()
export class PollsRepository {
  private readonly ttl: string;
  private readonly logger = new Logger(PollsRepository.name);

  /**
   * Polls Repository
   * @description Repository for Create Poll, Get Poll, Add Participant
   */
  constructor(
    configService: ConfigService,
    @Inject(IORedisKey) private readonly redisClient: Redis,
  ) {
    this.ttl = configService.get('POLL_DURATION');
  }

  /**
   * Create Poll Method
   * @param { CreatePollDataProps } props - Create Poll Data
   * @returns { Promise<IPoll> } New Poll Data
   */
  async createPoll({
    votesPerVoter,
    topic,
    pollID,
    userID,
  }: CreatePollDataProps): Promise<IPoll> {
    const initialPoll: IPoll = {
      id: pollID,
      topic,
      votesPerVoter,
      participants: {},
      adminID: userID,
      hasStarted: false,
      norminations: {},
      rankings: {},
    };

    this.logger.log(
      `🌟 Creating new poll : ${JSON.stringify(
        initialPoll,
        null,
        2,
      )} with TTL ${this.ttl}`,
    );

    const key = `polls:${pollID}`;

    try {
      await this.redisClient
        .multi([
          ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
          ['expire', key, this.ttl],
        ])
        .exec();
      return initialPoll;
    } catch (error) {
      this.logger.error(
        `🛑 Failed to add poll ${JSON.stringify(initialPoll)}\n${error}`,
      );
      throw new InternalServerErrorException();
    }
  }

  /**
   * Get Poll Method
   * @param { string } pollID  - Poll ID
   * @returns { Promise<IPoll> } Poll Data
   */
  async getPoll(pollID: string): Promise<IPoll> {
    this.logger.log(`🚀 Attempting to get poll with: ${pollID}`);
    const key = `polls:${pollID}`;

    try {
      const currentPoll = await this.redisClient.send_command(
        'JSON.GET',
        key,
        '.',
      );

      this.logger.verbose(currentPoll);

      return JSON.parse(currentPoll);
    } catch (error) {
      this.logger.error(`🛑 Failed to get pollID ${pollID} `, error);
      throw new InternalServerErrorException(`Failed to get pollID ${pollID}`);
    }
  }

  /**
   * Add Participant Method
   * @param {AddParticipantDataProps} props  - Add Participants Data
   * @returns { Promise<IPoll> } Poll Data
   */
  async addParticipant({
    pollID,
    userID,
    name,
  }: AddParticipantDataProps): Promise<IPoll> {
    this.logger.log(
      `🚀 Attempting to add a participant with userID/name : 
      ${userID}/${name} to pollID: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        participantPath,
        JSON.stringify(name),
      );
      return await this.getPoll(pollID);
    } catch (error) {
      this.logger.error(`🛑 Failed to add new Participant ${name}\n${error}`);
      throw new InternalServerErrorException(`Failed to add new Participant`);
    }
  }

  /**
   * Remove Participant Method
   * @param { string } pollID - Poll ID
   * @param { string } userID - user ID
   * @returns { Promise<IPoll> } Poll Data
   */
  async removeParticipant(pollID: string, userID: string): Promise<IPoll> {
    this.logger.log(`🦵🏻 removing userID: ${userID} from poll: ${pollID}`);

    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.send_command('JSON.DEL', key, participantPath);
      return this.getPoll(pollID);
    } catch (error) {
      this.logger.error(
        `Failed to remove userID: ${userID} from poll: ${pollID}`,
        error,
      );
      throw new InternalServerErrorException('Failed to remove participant');
    }
  }

  /**
   * Add Normation Method
   * @param {IAddNorminationData} param - AddNormation Data
   * @returns {Promise<IPoll>} pollData
   */
  async addNormination({
    pollID,
    norminationID,
    normination,
  }: IAddNorminationData): Promise<IPoll> {
    this.logger.log(
      `Attempting to add a normiation with normiationID/normiation: ${norminationID}/${normination} to pollID: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const normiationPath = `.norminations.${norminationID}`;

    try {
      await this.redisClient.send_command('JSON.SET', key, normiationPath);
      return this.getPoll(pollID);
    } catch (error) {
      this.logger.error(
        `🛑 Failed to add a normination with norminationID/text: ${norminationID}/${normination.text} to pollID : ${pollID}`,
      );

      throw new InternalServerErrorException(
        `Failed to add a normination with norminationID/text: ${norminationID}/${normination.text} to pollID : ${pollID}`,
      );
    }
  }

  /**
   * Remove Normination
   * @param { string } pollID - Poll ID
   * @param { string } norminationID - Normination ID
   * @returns { Promise<IPoll> } pollData
   */
  async removeNormination(
    pollID: string,
    norminationID: string,
  ): Promise<IPoll> {
    this.logger.log(
      `Removing norminationID: ${norminationID} from poll : ${pollID}`,
    );

    const key = `polls.${pollID}`;
    const normiationPath = `.norminations.${norminationID}`;

    try {
      await this.redisClient.send_command('JSON.DEL', key, normiationPath);
      return this.getPoll(pollID);
    } catch (error) {
      this.logger.error(
        `Failed to remove norminationID: ${norminationID} from poll: ${pollID}`,
      );
      throw new InternalServerErrorException(
        `Failed to remove norminationID: ${norminationID} from poll: ${pollID}`,
      );
    }
  }

  /**
   * Start Poll method
   * @param {string} pollID - poll ID
   * @returns { Promise<IPoll> } poll Data
   */
  async startPoll(pollID: string): Promise<IPoll> {
    this.logger.log(`📚 setting hasStarted for poll: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        JSON.stringify(true),
      );
      return this.getPoll(pollID);
    } catch (error) {
      this.logger.error(`🛑 Failed set hasStarted for poll: ${pollID}`, error);
      throw new InternalServerErrorException(
        'Something went wrong in starting the poll',
      );
    }
  }

  /**
   * Add Participants' Rankings
   * @param { AddParticipantRankingsDataProps } param - Add Participants Rankings Data Props
   * @returns { Promise<IPoll> } poll Data
   */
  async addParticipantRankings({
    pollID,
    userID,
    rankings,
  }: AddParticipantRankingsDataProps): Promise<IPoll> {
    this.logger.log(
      `Attempting to add rankings for userId/name : ${userID} to pollId: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const rankingsPath = `.rankings.${userID}`;

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        rankingsPath,
        JSON.stringify(rankings),
      );
      return this.getPoll(pollID);
    } catch (error) {
      this.logger.error(
        `🛑 Failed to add a rankning for userID: ${userID} to pollID: ${pollID}`,
      );
      throw new InternalServerErrorException(
        `Failed to add a rankning for userID: ${userID} to pollID: ${pollID}`,
      );
    }
  }
}
