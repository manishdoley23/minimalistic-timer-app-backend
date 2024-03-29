import { NextFunction, Request, Response } from "express";

export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies.accesstoken;
	console.log("token:", token);
	next();
};
