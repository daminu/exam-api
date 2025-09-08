export class HttpException extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string
  ) {
    super(message);
  }
}

export class BadRequestException extends HttpException {
  constructor(public readonly message: string) {
    super(400, message);
  }
}

export class ConflictException extends HttpException {
  constructor(public readonly message: string) {
    super(409, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(public readonly message: string) {
    super(403, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(public readonly message: string) {
    super(404, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(public readonly message: string) {
    super(401, message);
  }
}
