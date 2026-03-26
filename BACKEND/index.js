require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Salud DB
app.get("/api/ping-db", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, message: "Conexion MySQL exitosa" });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Login simple (sin JWT)
app.post("/api/login", async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ error: "Correo y password son obligatorios" });
    }

    const [rows] = await pool.query(
      "SELECT id_usuario, nombre, apellido, correo, password_hash FROM Usuario WHERE correo = ?",
      [correo]
    );

    if (!rows.length) return res.status(401).json({ error: "Credenciales invalidas" });

    const u = rows[0];
    if (u.password_hash !== password) { // simple para pruebas
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    res.json({
      message: "Login correcto",
      usuario: {
        id_usuario: u.id_usuario,
        nombre: u.nombre,
        apellido: u.apellido,
        correo: u.correo
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registro simple
app.post("/api/register", async (req, res) => {
  try {
    const { nombre, apellido, correo, password } = req.body;
    if (!nombre || !apellido || !correo || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [exists] = await pool.query("SELECT id_usuario FROM Usuario WHERE correo = ?", [correo]);
    if (exists.length) return res.status(409).json({ error: "Correo ya registrado" });

    const [result] = await pool.query(
      `INSERT INTO Usuario (nombre, apellido, correo, password_hash, fecha_registro)
       VALUES (?, ?, ?, ?, CURDATE())`,
      [nombre, apellido, correo, password]
    );

    res.status(201).json({ message: "Usuario creado", id_usuario: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cursos
app.get("/api/cursos", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        c.id_curso,
        c.nombre_curso,
        c.creditos,
        cat.nombre AS nombre_catedratico,
        cat.apellido AS apellido_catedratico
      FROM Curso c
      LEFT JOIN Catedratico cat ON c.id_catedratico = cat.id_catedratico
      ORDER BY c.id_curso DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publicaciones
app.get("/api/publicaciones", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id_publicacion,
        p.id_usuario,
        p.id_curso,
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
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/publicaciones", async (req, res) => {
  try {
    const { id_usuario, id_curso, titulo, contenido } = req.body;
    if (!id_usuario || !id_curso || !titulo || !contenido) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const [result] = await pool.query(
      `INSERT INTO Publicacion (id_usuario, id_curso, titulo, contenido, fecha_publicacion)
       VALUES (?, ?, ?, ?, CURDATE())`,
      [id_usuario, id_curso, titulo, contenido]
    );

    res.status(201).json({ message: "Publicacion creada", id_publicacion: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});