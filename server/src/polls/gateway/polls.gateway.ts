import {
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { WsCatchAllFilter } from '../exceptions/ws-catch-all-filter';
import { GatewayAdminGuard } from '../guard/getway-admin-guard';
import { ISocketWithAuth } from '../interfaces/polls.interface';
import { PollService } from '../polls.service';

@UsePipes(new ValidationPipe())
@UseFilters(new WsCatchAllFilter())
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

  async handleConnection(client: ISocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(
      `💬 Socket connected with userID: ${client.userID}, pollID:${client.pollID}, and name: ${client.name}`,
    );

    this.logger.log(`🔔 WS client with id : ${client.id} connected`);
    this.logger.debug(`🔢 Number of connected sockets: ${sockets.size}`);

    this.io.emit('hello', `👋 from ${client.id}`);
  }

  async handleDisconnect(client: ISocketWithAuth) {
    const sockets = this.io.sockets;

    const { pollID, userID } = client;
    const updatedPoll = await this.pollsService.removeParticipant(
      pollID,
      userID,
    );

    this.logger.debug(
      `💬 Socket connected with userID: ${client.userID}, pollID:${client.pollID}, and name: ${client.name}`,
    );

    this.logger.log(`🔔 Disconnected socket id : ${client.id}`);
    this.logger.debug(`🔢 Number of connected sockets: ${sockets.size}`);

    if (updatedPoll) {
      this.io.to(pollID).emit('poll_updated', updatedPoll);
    }
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('remove_participant')
  async removeParticipant(
    @MessageBody('id') id: string,
    @ConnectedSocket() client: ISocketWithAuth,
  ) {
    this.logger.debug(
      `🦵🏻 Attempting to remove participant ${id} from poll ${client.pollID}`,
    );

    const updatedPoll = await this.pollsService.removeParticipant(
      client.pollID,
      id,
    );

    if (updatedPoll) {
      this.io.to(client.pollID).emit('poll_updated', updatedPoll);
    }
  }
}
