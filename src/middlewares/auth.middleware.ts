import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils";

export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token =
		req.cookies?.accesstoken ||
		req.header("Authorization")?.replace("Bearer ", "");

	try {
		const user = verifyToken(token);
		next();
	} catch (error) {
		console.log("Error in auth");
		res.status(401).send("Unauthorized!");
	}
};
