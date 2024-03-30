import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

import { hash } from "../utils";
import { checkIfEmailExists, createNewUser, getPasswordFromDb } from "../db";

const generateAccessAndRefreshToken = async (
	email: string,
	password: string
) => {
	try {
		const accessToken = jwt.sign(
			{
				email,
				password,
			},
			process.env.ACCESS_TOKEN_SECRET!
		);
		const refreshToken = jwt.sign(
			{ password },
			process.env.ACCESS_TOKEN_SECRET!
		);

		return { accessToken, refreshToken };
	} catch (error) {
		throw new Error(
			"Something went wrong while generating the access token"
		);
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
	if (!emailExists) res.status(400).json({ message: "Sign up first!!" });

	const passFromDb = await getPasswordFromDb(email);
	if (!passFromDb) res.status(400).json({ message: "Wrong credentials!" });
	const result = await bcrypt.compare(password, passFromDb);
	if (!result) res.status(400).json({ message: "Invalid credentials" });
	else {
		const { accessToken, refreshToken } =
			await generateAccessAndRefreshToken(email, password);
		res.status(201)
			.cookie("accesstoken", accessToken, { httpOnly: true })
			.cookie("refreshtoken", refreshToken, { httpOnly: true })
			.json({ message: "Logged in!! Loading...", accessToken });
	}
};
