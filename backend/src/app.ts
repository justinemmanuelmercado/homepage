import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as AWS from "aws-sdk";
import { createConnection } from "typeorm";
import { authentication } from './authentication';

import { DeleteLinks } from "./handler/delete-links";
import { GetLinks } from "./handler/get-links";
import { PutLink } from "./handler/put-link";
import { GetTags } from "./handler/get-tags";
import { PutLinkEdit } from "./handler/put-link-edit";
import { GetMetadata } from "./handler/get-metadata";

AWS.config.update({ region: process.env.AWS_REGION || "us-east-1" });

export default async function () {
  const connection = await createConnection();
  const app = express();

  app.use(cors());
  app.use(authentication(connection))
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


  app.get('/', (_req, res) => {
    res.json({
      message: "congrats",
      name: connection.name
    })
  });

  app.get('/link', GetLinks(connection));
  app.put('/link', PutLink(connection));
  app.put('/link/:id', PutLinkEdit(connection));
  app.delete('/link', DeleteLinks(connection));
  app.get('/tags', GetTags(connection));
  app.get('/metadata/*', GetMetadata.get)

  return app;
}