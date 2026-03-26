import { useEffect, useState } from "react";
import api from "../services/api";
import PublicacionCard from "./publicacionCard";

export default function Feed({ user }) {
const [publicaciones, setPublicaciones] = useState([]);
const [cursos, setCursos] = useState([]);
const [catedraticos, setCatedraticos] = useState([]);
const [error, setError] = useState("");
const [loading, setLoading] = useState(true);
const [titulo, setTitulo] = useState("");
const [contenido, setContenido] = useState("");
const [idCurso, setIdCurso] = useState("");
const [tipoTema, setTipoTema] = useState("curso");
const [idCatedratico, setIdCatedratico] = useState("");
const [filtroTexto, setFiltroTexto] = useState("");
const [filtroCurso, setFiltroCurso] = useState("");
const [filtroCatedratico, setFiltroCatedratico] = useState("");

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

const cargarCatedraticos = async () => {
	try {
		const res = await api.get("/catedraticos");
		setCatedraticos(res.data || []);
	} catch (err) {
		setCatedraticos([]);
	}
};

useEffect(() => {
	const load = async () => {
		setLoading(true);
		await Promise.all([cargarPublicaciones(), cargarCursos(), cargarCatedraticos()]);
		setLoading(false);
	};

	load();
}, []);

const crearPublicacion = async (e) => {
	e.preventDefault();
	try {
		setError("");
		let cursoFinal = idCurso;

		if (tipoTema === "catedratico") {
			const cursoAsociado = cursos.find((c) => String(c.id_catedratico) === String(idCatedratico));
			cursoFinal = cursoAsociado?.id_curso || "";
		}

		if (!titulo || !contenido || !cursoFinal) {
			setError("Completa titulo, contenido y seleccion del tema");
			return;
		}

		await api.post("/publicaciones", {
			id_usuario: user?.id_usuario,
			id_curso: Number(cursoFinal),
			titulo,
			contenido,
		});

		setTitulo("");
		setContenido("");
		setIdCurso("");
		setIdCatedratico("");
		await cargarPublicaciones();
	} catch (err) {
		setError(err?.response?.data?.error || "No se pudo crear la publicacion");
	}
};

const publicacionesFiltradas = publicaciones.filter((p) => {
	if (filtroCurso && String(p.id_curso) !== String(filtroCurso)) return false;
	if (filtroCatedratico) {
		const curso = cursos.find((c) => String(c.id_curso) === String(p.id_curso));
		if (!curso || String(curso.id_catedratico) !== String(filtroCatedratico)) return false;
	}

	if (!filtroTexto) return true;
	const txt = filtroTexto.toLowerCase();
	return (
		p.titulo.toLowerCase().includes(txt) ||
		p.contenido.toLowerCase().includes(txt) ||
		p.nombre_curso.toLowerCase().includes(txt)
	);
});
const catedraticosUi = catedraticos.length
	? catedraticos.map((c) => ({
		id_catedratico: c.id_catedratico,
		nombre: `${c.nombre || ""} ${c.apellido || ""}`.trim(),
	}))
	: cursos.reduce((acc, c) => {
		if (!c.id_catedratico) return acc;
		const exists = acc.some((x) => String(x.id_catedratico) === String(c.id_catedratico));
		if (!exists) {
			acc.push({
				id_catedratico: c.id_catedratico,
				nombre: `${c.nombre_catedratico || ""} ${c.apellido_catedratico || ""}`.trim(),
			});
		}
		return acc;
	}, []);

if (error) return <p>Error: {error}</p>;
if (loading) return <p>Cargando publicaciones...</p>;

return (
<section className="feed-layout">
	<aside className="feed-side">
		<div className="panel">
			<h2>Nueva Publicacion</h2>
			<form onSubmit={crearPublicacion} className="form-grid">
				<select value={tipoTema} onChange={(e) => setTipoTema(e.target.value)}>
					<option value="curso">Sobre Curso</option>
					<option value="catedratico">Sobre Catedratico</option>
				</select>
				<input placeholder="Titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
				<textarea placeholder="Contenido" value={contenido} onChange={(e) => setContenido(e.target.value)} />
				{tipoTema === "curso" ? (
					<select value={idCurso} onChange={(e) => setIdCurso(e.target.value)}>
						<option value="">Selecciona curso</option>
						{cursos.map((c) => (
							<option key={c.id_curso} value={c.id_curso}>
								{c.nombre_curso}
							</option>
						))}
					</select>
				) : (
					<select value={idCatedratico} onChange={(e) => setIdCatedratico(e.target.value)}>
						<option value="">Selecciona catedratico</option>
						{catedraticosUi.map((c) => (
							<option key={c.id_catedratico} value={c.id_catedratico}>
								{c.nombre}
							</option>
						))}
					</select>
				)}
				<button type="submit">Publicar</button>
			</form>
		</div>

		<div className="panel">
			<h2>Filtros</h2>
			<input
				placeholder="Buscar por titulo, contenido o curso"
				value={filtroTexto}
				onChange={(e) => setFiltroTexto(e.target.value)}
				className="full-input"
			/>
			<select value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
				<option value="">Filtrar por curso</option>
				{cursos.map((c) => (
					<option key={c.id_curso} value={c.id_curso}>{c.nombre_curso}</option>
				))}
			</select>
			<select value={filtroCatedratico} onChange={(e) => setFiltroCatedratico(e.target.value)}>
				<option value="">Filtrar por catedratico</option>
				{catedraticosUi.map((c) => (
					<option key={c.id_catedratico} value={c.id_catedratico}>{c.nombre}</option>
				))}
			</select>
			<p className="muted-text">Cursos disponibles: {cursos.length}</p>
			<p className="muted-text">Publicaciones: {publicacionesFiltradas.length}</p>
		</div>
	</aside>

	<main>
		<div className="panel">
			<h2>Feed de Publicaciones</h2>
			{!publicacionesFiltradas.length ? <p>No hay publicaciones todavia.</p> : null}
			<div className="posts-grid">
				{publicacionesFiltradas.map((p) => (
					<PublicacionCard key={p.id_publicacion} p={p} user={user} />
				))}
			</div>
		</div>
	</main>
</section>
);
}