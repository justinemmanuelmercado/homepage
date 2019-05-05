import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as AWS from "aws-sdk";
import { DeleteLinks } from "./handler/delete-links";
import { GetLinks } from "./handler/get-links";
import { PutLink } from "./handler/put-link";

AWS.config.update({ region: process.env.AWS_REGION || "us-east-1" });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.json({
        message: "congrats"
    })
});

import {STS} from "aws-sdk";
app.get("/who", async (req, res) => {
  const sts = new STS();
  res.json({
    message: await sts.getCallerIdentity().promise()
  }) 
});

app.get('/link', GetLinks);
app.put('/link', PutLink);
app.delete('/link', DeleteLinks)

export default app;