# Manual Tecnico - FIUSAC Rate

Fecha: 19-03-2026

## 1. Objetivo
Implementar un backend basico en Node.js + Express conectado a MySQL para gestionar cursos y publicaciones de estudiantes de Ingenieria.

## 2. Alcance actual
El sistema actual permite:

1. Verificar la conexion entre backend y base de datos.
2. Listar cursos con datos de catedratico.
3. Listar publicaciones con datos de usuario y curso.
4. Crear publicaciones nuevas.

No incluye todavia:

1. Login y registro.
2. Endpoints de comentarios.
3. Seguridad con JWT.

## 3. Arquitectura general
Flujo de trabajo:

1. El frontend envia una solicitud HTTP.
2. Express recibe la solicitud.
3. El backend consulta MySQL por medio del pool de conexion.
4. MySQL responde con filas o estado.
5. El backend devuelve un JSON al frontend.

## 4. Estructura principal del proyecto

- BACKEND/.env
- BACKEND/package.json
- BACKEND/index.js
- BACKEND/db.js
- BACKEND/cursos.js
- BACKEND/publicaciones.js
- SQL/script

## 5. Tecnologias usadas

1. Node.js
2. Express
3. MySQL
4. mysql2
5. dotenv
6. cors
7. nodemon

## 6. Configuracion del entorno
Archivo: BACKEND/.env

Variables:

- PORT=3000
- DB_HOST=127.0.0.1
- DB_PORT=3306
- DB_USER=root
- DB_PASSWORD=
- DB_NAME=fiusac_rate

## 7. Base de datos
Archivo: SQL/script

El script hace lo siguiente:

1. Crea la base de datos fiusac_rate si no existe.
2. Selecciona la base fiusac_rate.
3. Crea las tablas:
   - Usuario
   - Catedratico
   - Curso
   - Curso_Aprobado
   - Publicacion
   - Comentario
4. Configura llaves primarias y llaves foraneas.

## 8. Funcion de cada archivo del backend

### 8.1 index.js

Responsabilidades:

1. Cargar variables de entorno.
2. Crear servidor Express.
3. Habilitar CORS y lectura JSON.
4. Exponer endpoint de prueba /api/ping-db.
5. Registrar rutas /api/cursos y /api/publicaciones.
6. Levantar servidor en el puerto definido.

### 8.2 db.js

Responsabilidades:

1. Crear pool de conexion MySQL.
2. Leer datos de conexion desde .env.
3. Exportar el pool para usarlo en las rutas.

### 8.3 cursos.js

Responsabilidades:

1. Endpoint GET /api/cursos.
2. Consulta JOIN entre Curso y Catedratico.
3. Retorna lista JSON para frontend.

### 8.4 publicaciones.js

Responsabilidades:

1. Endpoint GET /api/publicaciones.
2. Endpoint POST /api/publicaciones.
3. Validar campos obligatorios.
4. Insertar datos en tabla Publicacion.

## 9. Endpoints disponibles

### 9.1 Salud de conexion

- Metodo: GET
- Ruta: /api/ping-db
- Esperado: {"ok": true, "message": "Conexion MySQL exitosa"}

### 9.2 Listar cursos

- Metodo: GET
- Ruta: /api/cursos
- Esperado: arreglo JSON de cursos.

### 9.3 Listar publicaciones

- Metodo: GET
- Ruta: /api/publicaciones
- Esperado: arreglo JSON de publicaciones.

### 9.4 Crear publicacion

- Metodo: POST
- Ruta: /api/publicaciones
- Body ejemplo:

```json
{
  "id_usuario": 1,
  "id_curso": 1,
  "titulo": "Buen curso",
  "contenido": "Aprendi bastante"
}
```

## 10. Pasos de ejecucion

1. Iniciar MySQL en XAMPP.
2. Ejecutar SQL/script en phpMyAdmin.
3. Abrir terminal en carpeta BACKEND.
4. Ejecutar npm install.
5. Ejecutar npm run dev.
6. Probar:
   - http://localhost:3000/api/ping-db
   - http://localhost:3000/api/cursos
   - http://localhost:3000/api/publicaciones

## 11. Problemas comunes

### 11.1 Error de conexion

Posibles causas:

1. MySQL apagado.
2. Credenciales incorrectas en .env.
3. Base de datos no creada.

### 11.2 Respuesta vacia []

Causa:

1. No hay registros de prueba en tablas.

Solucion:

1. Insertar datos en Usuario, Catedratico, Curso y Publicacion.

## 12. Estado actual
Backend y base de datos conectados correctamente.
El endpoint de prueba de conexion responde exitosamente.
El sistema ya esta listo para conectar frontend en la siguiente fase.

## 13. Proximos pasos sugeridos

1. Crear endpoints de comentarios.
2. Agregar login y registro.
3. Agregar filtros en publicaciones.
4. Crear archivo de seeds para datos de prueba reutilizables.
