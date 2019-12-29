import * as Express from 'express';

declare global {
    namespace Express {
        interface User {
            id: string;
        }
        export interface Request {
            user?: Express.User
        }
    }
}