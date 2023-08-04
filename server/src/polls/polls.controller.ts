import { Body, Controller, Post } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './dtos/polls.dto';
import { PollService } from './polls.service';

@Controller('polls')
export class PollsController {
  constructor(private pollService: PollService) {}

  @Post('/create')
  async create(@Body() createPollDto: CreatePollDto) {
    return await this.pollService.createPoll(createPollDto);
  }

  @Post('/join')
  async join(@Body() joinPollDto: JoinPollDto) {
    return await this.pollService.joinPoll(joinPollDto);
  }

  @Post('/rejoin')
  async rejoin() {
    return await this.pollService.rejoinPoll({
      name: 'From token',
      pollID: 'Also from token',
      userID: 'Guess where this comes from',
    });
  }
}
