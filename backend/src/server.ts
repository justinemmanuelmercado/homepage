import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
const port = process.env.PORT || 3000;
export default app()
    .then(app => {
        app.listen(port);
        console.log(`listening on http://localhost:${port}`);
    })
    .catch(err => {
        console.error(err);
    });