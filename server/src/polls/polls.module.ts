import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { jwtModule, redisModule } from 'src/modules.config';
import { PollsGateway } from './gateway/polls.gateway';
import { PollsController } from './polls.controller';
import { PollService } from './polls.service';
import { PollsRepository } from './respository/polls.repository';

@Module({
  imports: [ConfigModule, redisModule, jwtModule],
  controllers: [PollsController],
  providers: [PollService, PollsRepository, PollsGateway],
})
export class PollsModule {}
