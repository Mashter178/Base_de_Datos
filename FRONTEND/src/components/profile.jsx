import { useEffect, useState } from "react";
import api from "../services/api";

export default function Profile({ user }) {
	const [perfil, setPerfil] = useState(null);
	const [cursosAprobados, setCursosAprobados] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const [perfilRes, cursosRes] = await Promise.all([
					api.get("/usuarios/me"),
					api.get("/usuarios/me/cursos-aprobados"),
				]);
				setPerfil(perfilRes.data);
				setCursosAprobados(cursosRes.data);
			} catch (err) {
				setPerfil(user || null);
				setCursosAprobados([]);
			} finally {
				setLoading(false);
			}
		};

		load();
	}, []);

	if (loading) return <p>Cargando perfil...</p>;

	return (
		<section className="panel">
			<h2>Perfil de usuario</h2>
			<p><b>Nombre:</b> {perfil?.nombre || user?.nombre || "-"}</p>
			<p><b>Apellido:</b> {perfil?.apellido || user?.apellido || "-"}</p>
			<p><b>Correo:</b> {perfil?.correo || user?.correo || "-"}</p>

			<h3>Cursos aprobados</h3>
			{!cursosAprobados.length ? (
				<p>No hay cursos aprobados cargados.</p>
			) : (
				<ul>
					{cursosAprobados.map((c) => (
						<li key={c.id_curso_aprobado}>
							{c.nombre_curso} - Nota: {c.nota_final}
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
