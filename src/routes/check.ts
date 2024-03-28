import { Router } from "express";
import { authenticateToken } from "../controllers/user.controller";

const router = Router();
export default router;

router.get("/check", authenticateToken, (req, res) => {
	res.send("SUccess");
});
