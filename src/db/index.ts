import pg, { QueryResult } from "pg";

export const db = new pg.Client({
	host: "localhost",
	port: 5432,
	user: "postgres",
	password: "postgres",
	database: "postgres",
});

export const query = (
	text: string,
	params: any,
	callback: (err: Error, result: QueryResult<any>) => void
) => db.query(text, params, callback);
