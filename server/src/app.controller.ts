import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return `<h1 style="font-family: 'Arial';">Helo 👋, <br/> Welcome From Nestjs React Realtime ranker app</h1>`;
  }
}
