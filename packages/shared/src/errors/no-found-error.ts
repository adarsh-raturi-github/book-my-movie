import { AbstractCustomError } from "./custom-error-abstract";

export class NotFoundError extends AbstractCustomError {
  statusCode = 404;
  constructor() {
    super("Not found");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not found" }];
  }
}
