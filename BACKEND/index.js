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

    const maybeId = Number(correo);
    const [rows] = await pool.query(
      `SELECT id_usuario, nombre, apellido, correo, password_hash
       FROM Usuario
       WHERE correo = ? OR id_usuario = ?`,
      [correo, Number.isNaN(maybeId) ? -1 : maybeId]
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
        c.id_catedratico,
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
        p.calificacion_curso,
        p.calificacion_catedratico,
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
    const { id_usuario, id_curso, titulo, contenido, calificacion_curso, calificacion_catedratico } = req.body;
    if (!id_usuario || !id_curso || !titulo || !contenido) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const calCurso = calificacion_curso ?? null;
    const calCatedratico = calificacion_catedratico ?? null;

    if (calCurso !== null && (!Number.isInteger(calCurso) || calCurso < 1 || calCurso > 5)) {
      return res.status(400).json({ error: "calificacion_curso debe ser un entero entre 1 y 5" });
    }

    if (calCatedratico !== null && (!Number.isInteger(calCatedratico) || calCatedratico < 1 || calCatedratico > 5)) {
      return res.status(400).json({ error: "calificacion_catedratico debe ser un entero entre 1 y 5" });
    }

    const [result] = await pool.query(
      `INSERT INTO Publicacion (
        id_usuario,
        id_curso,
        titulo,
        contenido,
        calificacion_curso,
        calificacion_catedratico,
        fecha_publicacion
      )
       VALUES (?, ?, ?, ?, ?, ?, CURDATE())`,
      [id_usuario, id_curso, titulo, contenido, calCurso, calCatedratico]
    );

    res.status(201).json({ message: "Publicacion creada", id_publicacion: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comentarios por publicacion
app.get("/api/comentarios/publicacion/:idPublicacion", async (req, res) => {
  try {
    const { idPublicacion } = req.params;
    const [rows] = await pool.query(
      `SELECT
        c.id_comentario,
        c.texto,
        c.fecha_comentario,
        u.id_usuario,
        u.nombre,
        u.apellido
      FROM Comentario c
      JOIN Usuario u ON c.id_usuario = u.id_usuario
      WHERE c.id_publicacion = ?
      ORDER BY c.id_comentario DESC`,
      [idPublicacion]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/comentarios/publicacion/:idPublicacion", async (req, res) => {
  try {
    const { idPublicacion } = req.params;
    const { id_usuario, texto } = req.body;
    if (!id_usuario || !texto) {
      return res.status(400).json({ error: "id_usuario y texto son obligatorios" });
    }

    const [result] = await pool.query(
      `INSERT INTO Comentario (id_publicacion, id_usuario, texto, fecha_comentario)
       VALUES (?, ?, ?, CURDATE())`,
      [idPublicacion, id_usuario, texto]
    );

    res.status(201).json({ message: "Comentario creado", id_comentario: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Perfil simple por usuario
app.get("/api/usuarios/:idUsuario", async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const [rows] = await pool.query(
      `SELECT id_usuario, nombre, apellido, correo, fecha_registro
       FROM Usuario WHERE id_usuario = ?`,
      [idUsuario]
    );

    if (!rows.length) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/usuarios/:idUsuario", async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const { nombre, apellido, correo } = req.body;

    if (!nombre || !apellido || !correo) {
      return res.status(400).json({ error: "nombre, apellido y correo son obligatorios" });
    }

    await pool.query(
      `UPDATE Usuario SET nombre = ?, apellido = ?, correo = ? WHERE id_usuario = ?`,
      [nombre, apellido, correo, idUsuario]
    );

    res.json({ message: "Perfil actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/usuarios/:idUsuario/cursos-aprobados", async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const [rows] = await pool.query(
      `SELECT
        ca.id_curso_aprobado,
        ca.nota_final,
        ca.fecha_aprobacion,
        c.id_curso,
        c.nombre_curso,
        c.creditos
      FROM Curso_Aprobado ca
      JOIN Curso c ON ca.id_curso = c.id_curso
      WHERE ca.id_usuario = ?
      ORDER BY ca.id_curso_aprobado DESC`,
      [idUsuario]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Catedraticos
app.get("/api/catedraticos", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_catedratico, nombre, apellido, especialidad
       FROM Catedratico
       ORDER BY apellido, nombre`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});