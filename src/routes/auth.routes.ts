import { Router } from "express";

import {
	loginUser,
	signUpUser,
	refreshUserToken,
	logoutUser,
} from "../controllers/auth.controller";

const router = Router();
export default router;

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/refresh-token", refreshUserToken);
