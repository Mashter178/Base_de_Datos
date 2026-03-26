const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
	try {
		const { nombre, apellido, correo, password } = req.body;

		if (!nombre || !apellido || !correo || !password) {
			return res.status(400).json({ error: 'Faltan campos obligatorios' });
		}

		const [exists] = await pool.query(
			'SELECT id_usuario FROM Usuario WHERE correo = ?',
			[correo]
		);

		if (exists.length) {
			return res.status(409).json({ error: 'Correo ya registrado' });
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const [result] = await pool.query(
			`INSERT INTO Usuario (nombre, apellido, correo, password_hash, fecha_registro)
			 VALUES (?, ?, ?, ?, CURDATE())`,
			[nombre, apellido, correo, passwordHash]
		);

		return res.status(201).json({
			message: 'Usuario creado',
			id_usuario: result.insertId,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { correo, password } = req.body;

		if (!correo || !password) {
			return res.status(400).json({ error: 'Correo y password son obligatorios' });
		}

		const [rows] = await pool.query(
			`SELECT id_usuario, nombre, apellido, correo, password_hash
			 FROM Usuario WHERE correo = ?`,
			[correo]
		);

		if (!rows.length) {
			return res.status(401).json({ error: 'Credenciales invalidas' });
		}

		const user = rows[0];
		const validPassword = await bcrypt.compare(password, user.password_hash || '');

		if (!validPassword) {
			return res.status(401).json({ error: 'Credenciales invalidas' });
		}

		const token = jwt.sign(
			{ id_usuario: user.id_usuario, correo: user.correo },
			process.env.JWT_SECRET || 'dev_secret',
			{ expiresIn: '1d' }
		);

		return res.json({
			token,
			usuario: {
				id_usuario: user.id_usuario,
				nombre: user.nombre,
				apellido: user.apellido,
				correo: user.correo,
			},
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

module.exports = router;
