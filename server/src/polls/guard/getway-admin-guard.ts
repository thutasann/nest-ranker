import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsUnauthorizedException } from '../exceptions/ws-exceptions';
import { IAuthPayload, ISocketWithAuth } from '../interfaces/polls.interface';
import { PollService } from '../polls.service';

/**
 * Admin-Only Gateway Guard
 * @description Gateway Guard only for the Admin role
 */
@Injectable()
export class GatewayAdminGuard implements CanActivate {
  private readonly logger = new Logger(GatewayAdminGuard.name);

  constructor(
    private readonly pollsService: PollService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // regular `Socket` from socket.io is probably sufficient
    const socket: ISocketWithAuth = context.switchToWs().getClient();

    // for testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    if (!token) {
      this.logger.error(`🛑 No authorization token provided`);
      throw new WsUnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify<IAuthPayload & { sub: string }>(
        token,
      );

      this.logger.debug(`🔐 Validating admin using token payload: ${payload}`);

      const { userID, pollID } = payload;

      const poll = await this.pollsService.getPoll(pollID);

      if (userID !== poll.adminID) {
        throw new WsUnauthorizedException('🛑 Admin privileges required');
      }

      return true;
    } catch (error) {
      this.logger.error(`🛑 GatewayAdminGuard error => ${error}`);
      throw new WsUnauthorizedException('🛑 Admin privileges required');
    }
  }
}
