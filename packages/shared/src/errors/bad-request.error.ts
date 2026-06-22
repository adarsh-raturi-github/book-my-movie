import { ISerializeError } from "../interfaces";
import { AbstractCustomError } from "./custom-error-abstract";

export class BadRequestError extends AbstractCustomError {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): ISerializeError[] {
    return [
      {
        message: this.message,
      },
    ];
  }
}
