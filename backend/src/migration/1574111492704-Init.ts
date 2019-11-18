import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1574111492704 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "bookmark_tag" ("tag" character varying NOT NULL, "bookmarkId" character varying NOT NULL, CONSTRAINT "PK_897be711374de856a108cdee817" PRIMARY KEY ("tag", "bookmarkId"))`);
        await queryRunner.query(`CREATE TABLE "bookmark" ("id" character varying NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "thumbnail" character varying, "note" character varying, CONSTRAINT "PK_b7fbf4a865ba38a590bb9239814" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quick_link" ("id" character varying NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "thumbnail" character varying, CONSTRAINT "PK_b4369bfcbacd8ba240a3246aca4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bookmark_tag" ADD CONSTRAINT "FK_66b131399f3b96b4691165c4671" FOREIGN KEY ("bookmarkId") REFERENCES "bookmark"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "bookmark_tag" DROP CONSTRAINT "FK_66b131399f3b96b4691165c4671"`);
        await queryRunner.query(`DROP TABLE "quick_link"`);
        await queryRunner.query(`DROP TABLE "bookmark"`);
        await queryRunner.query(`DROP TABLE "bookmark_tag"`);
    }

}
