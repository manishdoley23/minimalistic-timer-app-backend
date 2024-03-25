import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import mountRoutes from "./routes";
import { db } from "./db";

const app = express();
app.use(cors());
app.use(bodyParser.json());
mountRoutes(app);

db.connect()
	.then(() => console.log("COnnected success"))
	.then(() => db.query("SELECT * FROM POSTGRES"))
	.then((res) => console.log("res:", res))
	.catch((e) => console.log(e))
	.finally(() => db.end());

app.listen(process.env.PORT || 8080, () => {
	console.log("Express:" + process.env.PORT || 8080);
});
