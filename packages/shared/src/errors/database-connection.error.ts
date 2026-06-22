import { AbstractCustomError } from "./custom-error-abstract";

export class DatabaseConnectionError extends AbstractCustomError {
  statusCode = 500;
  constructor(errorMmessage: string) {
    super(errorMmessage);
    this.message = errorMmessage;
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
