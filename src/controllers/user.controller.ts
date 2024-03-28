import jwt from "jsonwebtoken";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";

export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers["authorization"];
	console.log("authHeader:", authHeader);
};

export const generateAccessToken = async (email: string, password: string) => {
	try {
		const accessToken = jwt.sign(
			{
				email,
				password,
			},
			process.env.ACCESS_TOKEN_SECRET!
		);

		return accessToken;
	} catch (error) {
		throw new Error(
			"Something went wrong while generating the access token"
		);
	}
};
