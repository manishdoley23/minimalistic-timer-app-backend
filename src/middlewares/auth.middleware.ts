import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token =
		req.cookies?.accesstoken ||
		req.header("Authorization")?.replace("Bearer ", "");

	try {
		const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
		console.log("user:", user);
		next();
	} catch (error) {
		console.log("Error in auth");
		res.status(401).send("Unauthorized!");
	}
};
