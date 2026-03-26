USE fiusac_rate;

-- Catedratico base para cursos de ejemplo
INSERT INTO Catedratico (nombre, apellido, especialidad)
SELECT 'Docente', 'General', 'Basico'
WHERE NOT EXISTS (
  SELECT 1 FROM Catedratico WHERE nombre = 'Docente' AND apellido = 'General'
);

-- Limpia datos relacionados para evitar error por llaves foraneas
DELETE FROM Comentario;
DELETE FROM Publicacion;
DELETE FROM Curso_Aprobado;
DELETE FROM Curso;

-- Inserta cursos simples
INSERT INTO Curso (nombre_curso, creditos, id_catedratico)
SELECT 'Matematica', 5, id_catedratico FROM Catedratico WHERE nombre = 'Docente' AND apellido = 'General' LIMIT 1;

INSERT INTO Curso (nombre_curso, creditos, id_catedratico)
SELECT 'Fisica', 5, id_catedratico FROM Catedratico WHERE nombre = 'Docente' AND apellido = 'General' LIMIT 1;

INSERT INTO Curso (nombre_curso, creditos, id_catedratico)
SELECT 'Quimica', 4, id_catedratico FROM Catedratico WHERE nombre = 'Docente' AND apellido = 'General' LIMIT 1;

INSERT INTO Curso (nombre_curso, creditos, id_catedratico)
SELECT 'Biologia', 4, id_catedratico FROM Catedratico WHERE nombre = 'Docente' AND apellido = 'General' LIMIT 1;

INSERT INTO Curso (nombre_curso, creditos, id_catedratico)
SELECT 'Programacion', 6, id_catedratico FROM Catedratico WHERE nombre = 'Docente' AND apellido = 'General' LIMIT 1;

INSERT INTO Curso (nombre_curso, creditos, id_catedratico)
SELECT 'Estadistica', 5, id_catedratico FROM Catedratico WHERE nombre = 'Docente' AND apellido = 'General' LIMIT 1;
