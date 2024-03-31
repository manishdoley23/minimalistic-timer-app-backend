import pg, { QueryResult } from "pg";

export const db = new pg.Client({
	host: "localhost",
	port: 5432,
	user: "postgres",
	password: "postgres",
	database: "postgres",
});

export const createUsersTable = async () => {
	const checkTableExistsQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables 
            WHERE table_name = 'users'
        );
    `;

	try {
		const result = await db.query(checkTableExistsQuery);
		const tableExists = result.rows[0].exists;

		if (!tableExists) {
			const createTableQuery = `
                CREATE TABLE users (
                    userId SERIAL PRIMARY KEY, -- Using SERIAL for auto-incrementing numeric primary key
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(100) NOT NULL,
					refreshToken VARCHAR(500)
                );
            `;

			await db.query(createTableQuery);
			console.log("Users table created successfully");
		} else {
			console.log("Users table already exists, skipping creation");
		}
	} catch (err) {
		console.error(
			"Error checking if users table exists or creating table:",
			err
		);
	}
};

export const checkIfEmailExists = async (email: string) => {
	const checkEmailQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM users
            WHERE email = $1
        );
    `;

	try {
		const { rows } = await db.query(checkEmailQuery, [email]);
		const emailExists = rows[0].exists;
		return emailExists;
	} catch (error) {
		console.error("Error checking if email exists:", error);
		throw new Error("Error checking if email exists");
	}
};

export const createNewUser = async (email: string, password: string) => {
	try {
		// Insert the new user into the database
		const insertUserQuery = `
            INSERT INTO users (email, password)
            VALUES ($1, $2)
        `;
		await db.query(insertUserQuery, [email, password]);
		console.log("User created successfully");
	} catch (error) {
		console.error("Error creating new user:", error);
		throw new Error("Error creating new user");
	}
};

export const getPasswordFromDb = async (email: string) => {
	try {
		const getPasswordQuery = `
            SELECT password FROM users WHERE email = $1
        `;

		const password = await db.query(getPasswordQuery, [email]);
		return password.rows[0].password;
	} catch (error) {
		console.error("Error getting password from db:", error);
	}
};

export const saveRefreshTokenToDb = async (
	email: string,
	refreshToken: string
) => {
	try {
		const updateRefreshTokenQuery = `
            UPDATE users
            SET refreshToken = $1
            WHERE email = $2
        `;
		await db.query(updateRefreshTokenQuery, [refreshToken, email]);
		console.log("Refresh token saved to database successfully");
	} catch (error) {
		console.error("Error saving refresh token to database:", error);
		throw new Error("Error saving refresh token to database");
	}
};

export const getUserFromRefresToken = async (refreshtoken: string) => {
	try {
		const getRefreshTokenQuery = `
			SELECT email FROM users WHERE refreshtoken = $1
		`;
		const email = await db.query(getRefreshTokenQuery, [refreshtoken]);
		return email;
	} catch (error) {
		console.log("User not found");
		throw new Error("User not found");
	}
};
