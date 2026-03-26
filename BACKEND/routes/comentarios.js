const express = require('express');
const pool = require('../db');
const auth = require('../authMiddleware');

const router = express.Router();

router.get('/publicacion/:idPublicacion', async (req, res) => {
	try {
		const { idPublicacion } = req.params;
		const sql = `
			SELECT
				c.id_comentario,
				c.texto,
				c.fecha_comentario,
				u.id_usuario,
				u.nombre,
				u.apellido
			FROM Comentario c
			JOIN Usuario u ON c.id_usuario = u.id_usuario
			WHERE c.id_publicacion = ?
			ORDER BY c.id_comentario DESC
		`;

		const [rows] = await pool.query(sql, [idPublicacion]);
		return res.json(rows);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

router.post('/publicacion/:idPublicacion', auth, async (req, res) => {
	try {
		const { idPublicacion } = req.params;
		const { texto } = req.body;

		if (!texto) {
			return res.status(400).json({ error: 'Texto requerido' });
		}

		const [result] = await pool.query(
			`INSERT INTO Comentario (id_publicacion, id_usuario, texto, fecha_comentario)
			 VALUES (?, ?, ?, CURDATE())`,
			[idPublicacion, req.user.id_usuario, texto]
		);

		return res.status(201).json({
			message: 'Comentario creado',
			id_comentario: result.insertId,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

module.exports = router;
