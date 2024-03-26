import bcrypt from "bcryptjs";

export const hash = async (val: string) => {
	try {
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(val, salt);
		return hash;
	} catch (error) {
		console.error("error in generating hash:", error);
	}
};
