import { ErrorCode } from "exceptions/errorCode";

declare interface HTTPError extends Error {
  errorTypes?: number;
  status?: number;
  errorCode: ErrorCode;
}
