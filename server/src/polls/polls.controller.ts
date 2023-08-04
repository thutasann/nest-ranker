import { Controller, Logger, Post } from '@nestjs/common';

@Controller('polls')
export class PollsController {
  @Post()
  async create() {
    Logger.log('Create');
    return {
      message: 'create',
    };
  }

  @Post('/join')
  async join() {
    Logger.log('Join');
    return {
      message: 'join',
    };
  }

  @Post('/rejoin')
  async rejoin() {
    Logger.log('rejoin');
    return {
      message: 'rejoin',
    };
  }
}
