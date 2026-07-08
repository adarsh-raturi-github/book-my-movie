export class NonRetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NonRetryableError";

    Object.setPrototypeOf(this, NonRetryableError.prototype);
  }
}
