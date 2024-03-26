import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import mountRoutes from "./routes";
import { db } from "./db";
import { createUsersTable } from "./db/queries";

const app = express();
app.use(cors());
app.use(bodyParser.json());
mountRoutes(app);

db.connect()
	.then(() => console.log("Connected success"))
	.then(() => createUsersTable())
	.catch((err) => {
		throw err;
	});
app.listen(process.env.PORT || 8080, () => {
	console.log("Express:" + process.env.PORT || 8080);
});
