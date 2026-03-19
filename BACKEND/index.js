require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const cursosRoutes = require('./cursos');
const publicacionesRoutes = require('./publicaciones');

const app = express();
// Middleware base para permitir peticiones del frontend y body JSON.
app.use(cors());
app.use(express.json());

// Endpoint de salud para comprobar que MySQL responde.
app.get('/api/ping-db', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ ok: true, message: 'Conexion MySQL exitosa' });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// Rutas principales del MVP.
app.use('/api/cursos', cursosRoutes);
app.use('/api/publicaciones', publicacionesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor corriendo en puerto ' + PORT);
});