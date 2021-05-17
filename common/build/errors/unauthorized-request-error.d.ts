import { CustomError } from "./custom-error";
export declare class UnauthorizedRequestError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
