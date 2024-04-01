import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hash = async (val: string) => {
	try {
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(val, salt);
		return hash;
	} catch (error) {
		console.error("error in generating hash:", error);
	}
};

export const verifyToken = (token: string): string => {
	return JSON.stringify(jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!));
};
