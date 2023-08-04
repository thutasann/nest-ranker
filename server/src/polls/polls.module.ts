import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisModule } from 'src/modules.config';
import { PollsController } from './polls.controller';
import { PollService } from './polls.service';
import { PollsRepository } from './respository/polls.repository';

@Module({
  imports: [ConfigModule, redisModule],
  controllers: [PollsController],
  providers: [PollService, PollsRepository],
})
export class PollsModule {}
