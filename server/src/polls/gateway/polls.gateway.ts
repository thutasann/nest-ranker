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
import { NorminationDto } from '../dtos/polls.dto';
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

  async handleConnection(client: ISocketWithAuth): Promise<void> {
    const sockets = this.io.sockets;
    this.logger.debug(
      ` Number of all of the connected sockets: ${sockets.size}`,
    );

    this.logger.debug(
      `💬 Socket connected with userID: ${client.userID}, pollID:${client.pollID}, and name: ${client.name}`,
    );

    const roomName = client.pollID;
    await client.join(roomName);

    const connectedClients = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

    this.logger.debug(
      ` 🔔 userID: ${client.userID} joined the room with name: ${roomName}`,
    );
    this.logger.debug(
      ` 🔢 Total clients connected to room ${roomName}: ${connectedClients}`,
    );

    const updatedPoll = await this.pollsService.addParticipant({
      pollID: client.pollID,
      userID: client.userID,
      name: client.name,
    });

    this.io.to(roomName).emit('poll_updated', updatedPoll);
  }

  async handleDisconnect(client: ISocketWithAuth): Promise<void> {
    const { pollID, userID } = client;
    const updatedPoll = await this.pollsService.removeParticipant(
      pollID,
      userID,
    );

    const roomName = client.pollID;
    const clientCount = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${clientCount}`);
    this.logger.debug(
      `Total clients connected to room ${roomName}: ${clientCount}`,
    );

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

  @SubscribeMessage('norminate')
  async norminate(
    @MessageBody() normination: NorminationDto,
    @ConnectedSocket() client: ISocketWithAuth,
  ): Promise<void> {
    this.logger.debug(
      `💬 Attempting to add normination for user ${client.userID} to poll ${client.pollID}\n${normination.text}`,
    );

    const updatedPoll = await this.pollsService.addNormination({
      pollID: client.pollID,
      userID: client.userID,
      text: normination.text,
    });

    this.io.to(client.pollID).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('remove_normination')
  async removeNormination(
    @MessageBody('id') norminationID: string,
    @ConnectedSocket() client: ISocketWithAuth,
  ): Promise<void> {
    const updatedPoll = await this.pollsService.removeNormination(
      client.pollID,
      norminationID,
    );
    this.io.to(client.pollID).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('start_vote')
  async startVote(@ConnectedSocket() client: ISocketWithAuth): Promise<void> {
    this.logger.debug(`Attempting to start voting for poll: ${client.pollID}`);

    const updatedPoll = await this.pollsService.startPoll(client.pollID);

    this.io.to(client.pollID).emit('poll_updated', updatedPoll);
  }

  @SubscribeMessage('submit_rankings')
  async submitRankings(
    @ConnectedSocket() client: ISocketWithAuth,
    @MessageBody('rankings') rankings: string[],
  ) {
    this.logger.debug(
      `Submitting votes for user: ${client.userID} belonging to pollID: ${client.pollID}`,
    );

    const updatedPoll = await this.pollsService.submitRankings({
      pollID: client.pollID,
      userID: client.userID,
      rankings,
    });

    this.io.to(client.pollID).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('close_poll')
  async closePoll(@ConnectedSocket() client: ISocketWithAuth): Promise<void> {
    this.logger.debug(
      `🛑 Closing poll: ${client.pollID} and computing results`,
    );

    const updatedPoll = await this.pollsService.computeResults(client.pollID);

    this.io.to(client.pollID).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('cancel_poll')
  async cancelPoll(@ConnectedSocket() client: ISocketWithAuth): Promise<void> {
    this.logger.debug(`🛑 Cancelling poll with id: ${client.pollID}`);

    await this.pollsService.cancelPoll(client.pollID);

    this.io.to(client.pollID).emit('poll_cancelled');
  }
}
