import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
export default router;

router.get("/check", authenticateToken, (req, res) => {
	res.send({ success: "success" });
});
