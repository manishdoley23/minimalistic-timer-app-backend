import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { hash, verifyToken } from "../utils";
import {
	checkIfEmailExists,
	cleartoken,
	createNewUser,
	getPasswordFromDb,
	getUserFromRefreshToken,
	saveRefreshTokenToDb,
} from "../db";

const generateAccessAndRefreshToken = async (
	email: string,
	password: string
) => {
	try {
		const accessToken = jwt.sign(
			{ email, password },
			process.env.ACCESS_TOKEN_SECRET!,
			{ expiresIn: "10s" }
		);
		const refreshToken = jwt.sign(
			{ email, password },
			process.env.REFRESH_TOKEN_SECRET!,
			{ expiresIn: "1d" }
		);

		return { accessToken, refreshToken };
	} catch (error) {
		throw new Error("Something went wrong while generating the tokens");
	}
};

export const signUpUser = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const emailExists = await checkIfEmailExists(email);
	if (emailExists)
		return res
			.status(400)
			.json({ message: "Email already exists. Go to login" });

	const hashedPassword = await hash(password);
	if (hashedPassword !== undefined) {
		await createNewUser(email, hashedPassword);
	}

	res.status(201).json({ message: "User created successfully" });
};

export const loginUser = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	console.log("email:", email);
	const emailExists = await checkIfEmailExists(email);
	if (!emailExists)
		return res.status(400).json({ message: "Sign up first!!" });

	const passFromDb = await getPasswordFromDb(email);
	if (!passFromDb)
		return res.status(400).json({ message: "Wrong credentials!" });
	const result = await bcrypt.compare(password, passFromDb);
	if (!result)
		return res.status(400).json({ message: "Invalid credentials" });

	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
		email,
		password
	);
	try {
		saveRefreshTokenToDb(email, refreshToken);
		res.status(201)
			.cookie("accesstoken", accessToken, { httpOnly: true })
			.cookie("refreshtoken", refreshToken, { httpOnly: true })
			.json({ message: "Logged in!! Loading...", accessToken });
	} catch (error) {
		res.status(400).send("Something went wrong");
	}
};

export const refreshUserToken = async (req: Request, res: Response) => {
	const cookies = req.cookies;
	const refreshToken = cookies.refreshtoken;
	if (!refreshToken) return res.status(401).send("Unathorized");
	const email = await getUserFromRefreshToken(refreshToken);
	if (!email) return res.status(401).send("No user with the refreshtoken");
	const user = verifyToken(refreshToken);
	if (!user) return res.sendStatus(401);
	const userObj = JSON.parse(user);
	const { accessToken } = await generateAccessAndRefreshToken(
		userObj.email,
		userObj.password
	);
	res.cookie("accesstoken", accessToken, { httpOnly: true })
		.status(200)
		.send({ accessToken });
};

export const logoutUser = async (req: Request, res: Response) => {
	const cookies = req.cookies;
	const refreshToken = cookies.refreshtoken;
	if (!refreshToken) return res.status(401).send("Unauthorized");
	const email = await getUserFromRefreshToken(refreshToken);
	if (!email) {
		return res
			.clearCookie("refreshtoken", { httpOnly: true })
			.status(204)
			.send("Logged out");
	}
	cleartoken(email);
	res.clearCookie("refreshtoken", { httpOnly: true })
		.status(204)
		.send("Logged out");
};
