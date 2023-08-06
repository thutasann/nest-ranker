import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IRequestWithAuth } from '../interfaces/polls.interface';

@Injectable()
export class ControllerAuthGuard implements CanActivate {
  private readonly logger = new Logger(ControllerAuthGuard.name);
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: IRequestWithAuth = context.switchToHttp().getRequest();

    this.logger.debug(
      `🔐 Checking for auth token on request body`,
      request.body,
    );

    const { accessToken } = request.body;

    try {
      const payload = this.jwtService.verify(accessToken);
      // Append user and poll to socket
      request.userID = payload.sub;
      request.pollID = payload.pollID;
      request.name = payload.name;
      return true;
    } catch (error) {
      this.logger.error(`Invalid authorization token => ${error}`);
      throw new ForbiddenException('Invalid authorization token');
    }
  }
}
