export class HttpException extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly name: string
  ) {
    super(message);
  }
}

export class BadRequestException extends HttpException {
  constructor(public readonly message: string) {
    super(400, message, 'Bad Request');
  }
}

export class ConflictException extends HttpException {
  constructor(public readonly message: string) {
    super(409, message, 'Conflict');
  }
}

export class ForbiddenException extends HttpException {
  constructor(public readonly message: string) {
    super(403, message, 'Forbidden');
  }
}

export class NotFoundException extends HttpException {
  constructor(public readonly message: string) {
    super(404, message, 'Not Found');
  }
}

export class UnauthorizedException extends HttpException {
  constructor(public readonly message: string) {
    super(401, message, 'Unauthorized');
  }
}
