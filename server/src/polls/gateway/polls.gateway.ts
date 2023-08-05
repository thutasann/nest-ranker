import { Logger } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { PollService } from '../polls.service';

@WebSocketGateway({
  namespace: 'polls', // namespace -> to separate websockets into separate paths
  cors: {
    origin: [],
  },
})
export class PollsGateway implements OnGatewayInit {
  private readonly logger = new Logger(PollsGateway.name);

  constructor(private readonly pollsService: PollService) {}

  afterInit(): void {
    this.logger.log(`🌍 Websocket Gateway initialized. `);
  }
}
