import "dotenv/config";
import { Router } from "express";

import { loginUser, signUpUser } from "../controllers/auth.controller";

const router = Router();
export default router;

router.post("/signup", signUpUser);
router.post("/login", loginUser);
