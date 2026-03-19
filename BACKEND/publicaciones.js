const express = require('express');
const router = express.Router();
const pool = require('./db');

// Feed de publicaciones con nombre de usuario y curso.
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT
        p.id_publicacion,
        p.titulo,
        p.contenido,
        p.fecha_publicacion,
        u.nombre AS usuario_nombre,
        u.apellido AS usuario_apellido,
        c.nombre_curso
      FROM Publicacion p
      JOIN Usuario u ON p.id_usuario = u.id_usuario
      JOIN Curso c ON p.id_curso = c.id_curso
      ORDER BY p.id_publicacion DESC
    `;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crea una nueva publicacion validando campos minimos requeridos.
router.post('/', async (req, res) => {
  try {
    const { id_usuario, id_curso, titulo, contenido } = req.body;

    if (!id_usuario || !id_curso || !titulo || !contenido) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const sql = `
      INSERT INTO Publicacion (id_usuario, id_curso, titulo, contenido, fecha_publicacion)
      VALUES (?, ?, ?, ?, CURDATE())
    `;
    // Parametros preparados para evitar inyeccion SQL.
    const [result] = await pool.query(sql, [id_usuario, id_curso, titulo, contenido]);

    res.status(201).json({
      message: 'Publicacion creada',
      id_publicacion: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;