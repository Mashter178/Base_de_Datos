const express = require('express');
const pool = require('../db');
const auth = require('../authMiddleware');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
	try {
		const [rows] = await pool.query(
			`SELECT id_usuario, nombre, apellido, correo, fecha_registro
			 FROM Usuario WHERE id_usuario = ?`,
			[req.user.id_usuario]
		);

		if (!rows.length) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}

		return res.json(rows[0]);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

router.get('/me/cursos-aprobados', auth, async (req, res) => {
	try {
		const sql = `
			SELECT
				ca.id_curso_aprobado,
				ca.nota_final,
				ca.fecha_aprobacion,
				c.id_curso,
				c.nombre_curso,
				c.creditos
			FROM Curso_Aprobado ca
			JOIN Curso c ON ca.id_curso = c.id_curso
			WHERE ca.id_usuario = ?
			ORDER BY ca.id_curso_aprobado DESC
		`;

		const [rows] = await pool.query(sql, [req.user.id_usuario]);
		return res.json(rows);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

module.exports = router;
