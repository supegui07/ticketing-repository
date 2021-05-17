import { CustomError } from "./custom-error";

export class UnauthorizedRequestError extends CustomError {
  statusCode=401

  constructor() {
    super('Unauthorized request')

    Object.setPrototypeOf(this, UnauthorizedRequestError.prototype)
  }

  serializeErrors() {
    return [{ message: 'Unauthorized request'}]
  }
}