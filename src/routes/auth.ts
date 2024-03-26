import { Router } from "express";
import bcrypt from "bcryptjs";

import {
	checkIfEmailExists,
	createNewUser,
	createUsersTable,
	getPasswordFromDb,
} from "../db/queries";
import { hash } from "../utils";
import "dotenv/config";

const router = Router();
export default router;

router.post("/signup", async (req, res) => {
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
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	const emailExists = await checkIfEmailExists(email);
	if (emailExists === undefined)
		res.status(400).json({ message: "Sign up first!!" });

	const passFromDb = await getPasswordFromDb(email);
	const result = await bcrypt.compare(password, passFromDb);
	if (!result) res.status(400).json({ message: "Invalid credentials" });
	else res.status(201).json({ message: "Logged in!! Loading..." });
});
