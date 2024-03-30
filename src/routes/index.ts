import { Express } from "express";

import auth from "./auth.routes";
import check from "./check";

const mountRoutes = (app: Express) => {
	app.use("/auth", auth);
	app.use("/", check);
};

export default mountRoutes;
