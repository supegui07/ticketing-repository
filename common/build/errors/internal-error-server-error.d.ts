import { CustomError } from "./custom-error";
export declare class InternalErrorServer extends CustomError {
    message: string;
    statusCode: number;
    constructor(message: string);
    serializeErrors(): {
        message: string;
    }[];
}
