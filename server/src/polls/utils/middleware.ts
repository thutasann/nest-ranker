import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ISocketWithAuth } from '../interfaces/polls.interface';

/**
 * Create Token Middleware
 * @description This is the middleware where we validate auth token before socket connection
 */
export const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
  (socket: ISocketWithAuth, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    logger.debug(`👮‍♀️ Validating auth token before connection: ${token}`);

    try {
      const payload = jwtService.verify(token);
      socket.userID = payload.sub;
      socket.pollID = payload.pollID;
      socket.name = payload.name;
      next();
    } catch (err) {
      next(new Error('FORBIDDEN'));
    }
  };
