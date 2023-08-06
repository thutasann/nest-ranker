import { WsException } from '@nestjs/websockets';

type WsExceptionType = 'BadRequest' | 'Unauthorized' | 'Unknown';

/**
 * Custom WebsocketTypeException
 * @description this is to be used in the Socket Connection Exceptions
 */
export class WsTypeException extends WsException {
  readonly type: WsExceptionType;

  constructor(type: WsExceptionType, message: string | unknown) {
    const error = {
      type,
      message,
    };
    super(error);
    this.type = type;
  }
}

/**
 * WebSocket BadRequest Exception
 */
export class WsBadRequestException extends WsTypeException {
  constructor(message: string | unknown) {
    super('BadRequest', message);
  }
}

/**
 * WebSocket UnAuthorized Exception
 */
export class WsUnauthorizedException extends WsTypeException {
  constructor(message: string | unknown) {
    super('Unauthorized', message);
  }
}

/**
 * WebSocket Unknown Exception
 */
export class WsUnknownException extends WsTypeException {
  constructor(message: string | unknown) {
    super('Unknown', message);
  }
}
