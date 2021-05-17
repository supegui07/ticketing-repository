import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../interfaces/user-payload";
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}
export declare const currentUser: (req: Request, res: Response, next: NextFunction) => void;
