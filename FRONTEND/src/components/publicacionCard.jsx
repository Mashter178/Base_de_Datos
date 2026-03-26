import { useState } from "react";
import api from "../services/api";

export default function PublicacionCard({ p }) {
	const [comentarios, setComentarios] = useState([]);
	const [texto, setTexto] = useState("");
	const [error, setError] = useState("");

	const cargarComentarios = async () => {
		try {
			setError("");
			const res = await api.get(`/comentarios/publicacion/${p.id_publicacion}`);
			setComentarios(res.data);
		} catch (err) {
			setError(err?.response?.data?.error || "No se pudieron cargar comentarios");
		}
	};

	const crearComentario = async () => {
		try {
			setError("");
			if (!texto) return;
			await api.post(`/comentarios/publicacion/${p.id_publicacion}`, { texto });
			setTexto("");
			await cargarComentarios();
		} catch (err) {
			setError(err?.response?.data?.error || "No se pudo crear comentario");
		}
	};

	return (
		<div className="panel post-card">
			<h3>{p.titulo}</h3>
			<p>{p.contenido}</p>
			<small>
				{p.usuario_nombre} {p.usuario_apellido} - {p.nombre_curso}
			</small>

			<div className="actions-row" style={{ marginTop: 10 }}>
				<button onClick={cargarComentarios}>Ver comentarios</button>
			</div>

			{comentarios.length ? (
				<ul style={{ marginTop: 8 }}>
					{comentarios.map((c) => (
						<li key={c.id_comentario}>
							<b>{c.nombre} {c.apellido}:</b> {c.texto}
						</li>
					))}
				</ul>
			) : null}

			<div className="form-grid" style={{ marginTop: 8 }}>
				<input
					placeholder="Escribe un comentario"
					value={texto}
					onChange={(e) => setTexto(e.target.value)}
				/>
				<button onClick={crearComentario}>Comentar</button>
			</div>

			{error ? <p className="error-text" style={{ marginTop: 8 }}>{error}</p> : null}
		</div>
	);
}