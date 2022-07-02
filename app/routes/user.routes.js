import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const users = await pool.query("SELECT * FROM users");
		res.json({ users: users.rows });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await pool.query(
			"INSERT INTO users (user_name,user_email,user_password) VALUES ($1,$2,$3) RETURNING *",
			[name, email, hashedPassword]
		);
		res.json({ users: newUser.rows[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
