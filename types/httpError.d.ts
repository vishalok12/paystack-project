declare interface HTTPError extends Error {
  errorTypes?: number;
  status?: number;
  errorCode?: string;
}
