import { AbstractCustomError } from "./custom-error-abstract";

export class NotAuthorizeError extends AbstractCustomError {
  statusCode = 401;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NotAuthorizeError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
