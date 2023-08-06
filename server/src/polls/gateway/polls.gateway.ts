import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { ISocketWithAuth } from '../interfaces/polls.interface';
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

  handleConnection(client: ISocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(
      `💬 Socket connected with userID: ${client.userID}, pollID:${client.pollID}, and name: ${client.name}`,
    );

    this.logger.log(`🔔 WS client with id : ${client.id} connected`);
    this.logger.debug(`🔢 Number of connected sockets: ${sockets.size}`);

    this.io.emit('hello', `👋 from ${client.id}`);
  }

  handleDisconnect(client: ISocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(
      `💬 Socket connected with userID: ${client.userID}, pollID:${client.pollID}, and name: ${client.name}`,
    );

    this.logger.log(`🔔 Disconnected socket id : ${client.id}`);
    this.logger.debug(`🔢 Number of connected sockets: ${sockets.size}`);
  }
}
