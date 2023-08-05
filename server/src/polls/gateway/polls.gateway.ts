import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { PollService } from '../polls.service';

@WebSocketGateway({
  namespace: 'polls', // namespace -> to separate websockets into separate paths
})
export class PollsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PollsGateway.name);

  constructor(private readonly pollsService: PollService) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log(`🌍 Websocket Gateway initialized. `);
  }

  handleConnection<T>(client: Socket<T, T, T, any>) {
    const sockets = this.io.sockets;
    this.logger.log(`🔔 WS client with id : ${client.id} connected`);
    this.logger.debug(`🔢 Number of connected sockets: ${sockets.size}`);

    this.io.emit('hello', `👋 from ${client.id}`);
  }

  handleDisconnect<T>(client: Socket<T, T, T, any>) {
    const sockets = this.io.sockets;

    this.logger.log(`🔔 Disconnected socket id : ${client.id}`);
    this.logger.debug(`🔢 Number of connected sockets: ${sockets.size}`);
  }
}
