import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './dtos/polls.dto';
import { ControllerAuthGuard } from './guard/controller-auth.guard';
import { IRequestWithAuth } from './interfaces/polls.interface';
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

  @UseGuards(ControllerAuthGuard)
  @Post('/rejoin')
  async rejoin(@Req() request: IRequestWithAuth) {
    const { userID, pollID, name } = request;

    return await this.pollService.rejoinPoll({
      userID,
      pollID,
      name,
    });
  }
}
