import { WsException } from '@nestjs/websockets';

type WsExceptionType = 'BadRequest' | 'Unauthorized' | 'Unknown';

export class WsTypeException extends WsException {
  readonly type: WsExceptionType;

  /**
   * Custom WebsocketTypeException
   * @description this is to be used in the Socket Connection Exceptions
   */
  constructor(type: WsExceptionType, message: string | unknown) {
    const error = {
      type,
      message,
    };
    super(error);
    this.type = type;
  }
}

export class WsBadRequestException extends WsTypeException {
  /**
   * WebSocket BadRequest Exception
   */
  constructor(message: string | unknown) {
    super('BadRequest', message);
  }
}

export class WsUnauthorizedException extends WsTypeException {
  /**
   * WebSocket UnAuthorized Exception
   */
  constructor(message: string | unknown) {
    super('Unauthorized', message);
  }
}

export class WsUnknownException extends WsTypeException {
  /**
   * WebSocket Unknown Exception
   */
  constructor(message: string | unknown) {
    super('Unknown', message);
  }
}
