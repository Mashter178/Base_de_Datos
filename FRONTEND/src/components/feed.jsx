import { useEffect, useState } from "react";
import api from "../services/api";
import PublicacionCard from "./publicacionCard";

export default function Feed({ user }) {
const [publicaciones, setPublicaciones] = useState([]);
const [cursos, setCursos] = useState([]);
const [error, setError] = useState("");
const [loading, setLoading] = useState(true);
const [titulo, setTitulo] = useState("");
const [contenido, setContenido] = useState("");
const [idCurso, setIdCurso] = useState("");
const [filtroTexto, setFiltroTexto] = useState("");

const cargarPublicaciones = async () => {
	try {
		setError("");
		const res = await api.get("/publicaciones");
		setPublicaciones(res.data);
	} catch (err) {
		setError(err.message);
	}
};

const cargarCursos = async () => {
	try {
		const res = await api.get("/cursos");
		setCursos(res.data || []);
	} catch (err) {
		setError(err?.response?.data?.error || "No se pudieron cargar los cursos");
	}
};

useEffect(() => {
	const load = async () => {
		setLoading(true);
		await Promise.all([cargarPublicaciones(), cargarCursos()]);
		setLoading(false);
	};

	load();
}, []);

const crearPublicacion = async (e) => {
	e.preventDefault();
	try {
		setError("");
		if (!titulo || !contenido || !idCurso) {
			setError("Completa titulo, contenido e id de curso");
			return;
		}

		await api.post("/publicaciones", {
			id_usuario: user?.id_usuario,
			id_curso: Number(idCurso),
			titulo,
			contenido,
		});

		setTitulo("");
		setContenido("");
		setIdCurso("");
		await cargarPublicaciones();
	} catch (err) {
		setError(err?.response?.data?.error || "No se pudo crear la publicacion");
	}
};

const publicacionesFiltradas = publicaciones.filter((p) => {
	if (!filtroTexto) return true;
	const txt = filtroTexto.toLowerCase();
	return (
		p.titulo.toLowerCase().includes(txt) ||
		p.contenido.toLowerCase().includes(txt) ||
		p.nombre_curso.toLowerCase().includes(txt)
	);
});

if (error) return <p>Error: {error}</p>;
if (loading) return <p>Cargando publicaciones...</p>;

return (
<div className="panel">
<h2>Feed de Publicaciones</h2>

<form onSubmit={crearPublicacion} className="form-grid">
	<input placeholder="Titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
	<textarea placeholder="Contenido" value={contenido} onChange={(e) => setContenido(e.target.value)} />
	<select value={idCurso} onChange={(e) => setIdCurso(e.target.value)}>
		<option value="">Selecciona curso</option>
		{cursos.map((c) => (
			<option key={c.id_curso} value={c.id_curso}>
				{c.nombre_curso}
			</option>
		))}
	</select>
	<button type="submit">Crear Publicacion</button>
</form>

<input
	placeholder="Filtrar por titulo, contenido o curso"
	value={filtroTexto}
	onChange={(e) => setFiltroTexto(e.target.value)}
	className="full-input"
/>

{!publicacionesFiltradas.length ? <p>No hay publicaciones todavia.</p> : null}

{publicacionesFiltradas.map((p) => (
<PublicacionCard key={p.id_publicacion} p={p} />
))}
</div>
);
}