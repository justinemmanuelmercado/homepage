import { Request, Response, NextFunction } from 'express';
import { Connection } from 'typeorm';
import { User } from './entity/User';

export const authentication = (connection: Connection) => async (req: Request, _res: Response, next: NextFunction) => {
    // verify auth credentials
    if (req.headers.authorization) {
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
        const user = await (await connection.getRepository(User)).findOne({
            where: {
                username, password
            },
            select: ["id"]
        });
        if (user) {
            req.user = {
                id: user.id
            }
        }
        next();
    }
}