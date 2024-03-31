import "dotenv/config";
import { Router } from "express";

import {
	loginUser,
	signUpUser,
	refreshUserToken,
} from "../controllers/auth.controller";

const router = Router();
export default router;

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get("/refresh-token", refreshUserToken);
