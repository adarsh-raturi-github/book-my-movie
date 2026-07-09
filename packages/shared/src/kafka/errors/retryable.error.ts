export class RetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RetryableError";

    Object.setPrototypeOf(this, RetryableError.prototype);
  }
}
