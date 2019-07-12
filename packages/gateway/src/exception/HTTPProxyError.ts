export default class HTTPProxyError {
  private readonly httpStatusCode: number;
  private readonly errorMessage: string;

  constructor(statusCode: number = 500, message: string = 'Gateway Proxy Error') {
    this.httpStatusCode = statusCode;
    this.errorMessage = message;
  }

  get statusCode() {
    return this.httpStatusCode;
  }

  get message() {
    return this.errorMessage;
  }
}
