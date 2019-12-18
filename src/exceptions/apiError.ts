import { ErrorCode } from './errorCode';

export class APIError extends Error {
  errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.name = 'APIError';
    this.errorCode = errorCode;
  }
}
