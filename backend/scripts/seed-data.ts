import dotenv from 'dotenv';
dotenv.config();

import { Connection, createConnection } from "typeorm";
import { QuickLink } from "../src/entity/QuickLink";
import { Bookmark } from "../src/entity/Bookmark";
import { BookmarkTag } from "../src/entity/BookmarkTag"
import uuidv4 from "uuid/v4";
import { internet, hacker, random } from "faker";

class DatabaseSeeder {
    private connection: Connection;

    public constructor(connection: Connection) {
        this.connection = connection;
    }

    public static createConnection(): Promise<Connection> {
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
            name: 'seed',
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

    public async up() {
        const qlRepository = await this.connection.getRepository(QuickLink);
        const bmRepository = await this.connection.getRepository(Bookmark);
        const bmTagRepository = await this.connection.getRepository(BookmarkTag);

        let bmCount = 0, qlCount = 0, maxBm = 100, maxQl = 20;
        let bmPromises: Promise<Bookmark>[] = [];
        let bmTagPromises: Promise<BookmarkTag>[] = [];
        let qlPromises: Promise<QuickLink>[] = [];

        while (bmCount < maxBm) {
            let tagCount = 0;
            const id = uuidv4();
            const bm = new Bookmark({
                id,
                name: hacker.noun(),
                url: internet.url()
            })
            bm.note = random.words(15);
            bm.thumbnail = random.image();
            
            bmPromises.push(bmRepository.save(bm));
            while (tagCount < 10) {
                const bmTag = new BookmarkTag({
                    bookmarkId: id,
                    tag: hacker.noun()
                })
                bmTagPromises.push(bmTagRepository.save(bmTag));
                tagCount++;
            }
            bmCount++;
        }

        while (qlCount < maxQl) {
            const id = uuidv4();
            const ql = new QuickLink({
                id,
                name: hacker.noun(),
                url: internet.url()
            })
            ql.thumbnail = random.image();

            qlPromises.push(qlRepository.save(ql));
            qlCount++;

        }

        const savedQuickLinks = await Promise.all(qlPromises);
        const savedBookmarks = await Promise.all(bmPromises);
        const savedBmTags = await Promise.all(bmTagPromises);

    }

    public async down(){
        await this.connection.query('TRUNCATE "bookmark", "quick_link", "bookmark_tag" CASCADE');
    }
}

(async (): Promise<void> => {
    try {
        const command = process.argv[2];
        if (command !== '-u' && command !== '-d') {
            console.error('invalid command');
            process.exit(1);
        }

        const connection = await DatabaseSeeder.createConnection();
        const db = new DatabaseSeeder(connection);

        if (command === '-u') {
            await db.up();
        }

        if (command === '-d') {
            await db.down();
        }
        connection.close();
    } catch (e) {

        console.error('Something went wrong', e);
        process.exit(1);
    }
})();