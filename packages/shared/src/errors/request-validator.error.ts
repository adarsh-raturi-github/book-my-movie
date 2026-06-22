import { ValidationError } from "express-validator";
import { AbstractCustomError } from "./custom-error-abstract";

export class RequestValidationError extends AbstractCustomError {
  statusCode = 400;
  constructor(private readonly errors: ValidationError[]) {
    super("Request param invalid");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((e) => {
      if (e.type === "field") {
        return {
          message: e.msg,
          field: e.path,
        };
      }
      return { message: e.msg };
    });
  }
}
