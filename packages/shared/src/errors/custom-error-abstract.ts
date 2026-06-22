import { ISerializeError } from "../interfaces";

export abstract class AbstractCustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, AbstractCustomError.prototype);
  }
  abstract serializeErrors(): ISerializeError[];
}
