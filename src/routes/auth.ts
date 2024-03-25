import { Router } from "express";
import { db } from "../db";

const router = Router();
export default router;

router.post("/signup", (req, res) => {
	const { email, password } = req.body;
	console.log("Email: ", email);
	console.log("Password: ", password);

	// db.connect().then()
});
