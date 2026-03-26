const express = require('express');
const router = express.Router();
const pool = require('../db');

// Lista de cursos junto al catedratico asignado.
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT
        c.id_curso,
        c.nombre_curso,
        c.creditos,
        cat.id_catedratico,
        cat.nombre AS nombre_catedratico,
        cat.apellido AS apellido_catedratico
      FROM Curso c
      LEFT JOIN Catedratico cat ON c.id_catedratico = cat.id_catedratico
      ORDER BY c.id_curso DESC
    `;
    const [rows] = await pool.query(sql);
    // Devuelve arreglo JSON para consumo directo en frontend.
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;