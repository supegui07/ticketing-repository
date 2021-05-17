import { CustomError } from "./custom-error";

export class InternalErrorServer extends CustomError {
  statusCode=501

  constructor(public message:string) {
    super('Internal error server')

    Object.setPrototypeOf(this, InternalErrorServer.prototype)
  }

  serializeErrors() {
    return [ { message: this.message} ]
  }
}