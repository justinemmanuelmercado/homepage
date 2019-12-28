import dotenv from 'dotenv';
dotenv.config();

import { Connection, createConnection, InsertResult } from "typeorm";
import { User } from '../src/entity/User';


const createSeedConnection: () => Promise<Connection> = () => {
    const {
        TYPEORM_CONNECTION,
        TYPEORM_HOST,
        TYPEORM_USERNAME,
        TYPEORM_PASSWORD,
        TYPEORM_DATABASE,
        TYPEORM_PORT,
        TYPEORM_ENTITIES,
        TYPEORM_MIGRATIONS,
        TYPEORM_ENTITIES_DIR,
        TYPEORM_MIGRATIONS_DIR,
        TYPEORM_SUBSCRIBERS_DIR,
    } = process.env;
    return createConnection({
        name: 'create-user',
        // @ts-ignore
        type: TYPEORM_CONNECTION as "postgres",
        username: TYPEORM_USERNAME,
        password: TYPEORM_PASSWORD,
        port: parseInt(TYPEORM_PORT || "5432"),
        host: TYPEORM_HOST,
        database: TYPEORM_DATABASE,
        synchronize: false,
        logging: true,
        entities: [TYPEORM_ENTITIES as string],
        migrations: [TYPEORM_MIGRATIONS as string],
        cli: {
            entitiesDir: TYPEORM_ENTITIES_DIR,
            migrationsDir: TYPEORM_MIGRATIONS_DIR,
            subscribersDir: TYPEORM_SUBSCRIBERS_DIR,
        },
    });
}


(async (): Promise<void> => {
    try {
        const connection = await createSeedConnection();

        const userIndex = process.argv.indexOf("-u");
        const passwordIndex = process.argv.indexOf("-p");
        if (userIndex === -1 || passwordIndex === -1) {
            throw new Error('Please pass a username and password "-u <username> -p <password>"');
        }

        const username = process.argv[userIndex + 1];
        const password = process.argv[passwordIndex + 1];

        console.log(`Creating user '${username}' with password '${password}'`);

        const newUser = new User({
            username,
            password
        });

        (await connection.getRepository(User)).save(newUser);
        console.log(`User ${username} succesfully created!`);
    } catch (e) {
        console.error('Something went wrong', e);
        process.exit(1);
    }
})();