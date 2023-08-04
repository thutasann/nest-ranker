import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisModule } from 'src/modules.config';
import { PollsController } from './polls.controller';
import { PollService } from './polls.service';

@Module({
  imports: [ConfigModule, redisModule],
  controllers: [PollsController],
  providers: [PollService],
})
export class PollsModule {}
