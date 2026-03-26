import { useEffect, useState } from "react";
import api from "../services/api";
import CursosAprobados from "./cursosAprobados";

export default function Profile({ user }) {
	const [perfil, setPerfil] = useState(null);
	const [nombre, setNombre] = useState("");
	const [apellido, setApellido] = useState("");
	const [correo, setCorreo] = useState("");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [ok, setOk] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				setError("");
				const perfilRes = await api.get(`/usuarios/${user?.id_usuario}`);
				setPerfil(perfilRes.data);
				setNombre(perfilRes.data?.nombre || "");
				setApellido(perfilRes.data?.apellido || "");
				setCorreo(perfilRes.data?.correo || "");
			} catch (err) {
				setPerfil(user || null);
				setNombre(user?.nombre || "");
				setApellido(user?.apellido || "");
				setCorreo(user?.correo || "");
				setError("No se pudo cargar perfil desde API, usando datos locales.");
			} finally {
				setLoading(false);
			}
		};

		load();
	}, []);

	if (loading) return <p>Cargando perfil...</p>;

	const guardarPerfil = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);
			setError("");
			setOk("");
			await api.put(`/usuarios/${user?.id_usuario}`, { nombre, apellido, correo });
			setOk("Perfil actualizado correctamente");
			setPerfil((prev) => ({ ...(prev || {}), nombre, apellido, correo }));
		} catch (err) {
			setError(err?.response?.data?.error || "No se pudo actualizar el perfil");
		} finally {
			setSaving(false);
		}
	};

	return (
		<section className="panel">
			<h2>Perfil de usuario</h2>
			<p><b>Nombre:</b> {perfil?.nombre || user?.nombre || "-"}</p>
			<p><b>Apellido:</b> {perfil?.apellido || user?.apellido || "-"}</p>
			<p><b>Correo:</b> {perfil?.correo || user?.correo || "-"}</p>

			<h3>Editar informacion</h3>
			<form onSubmit={guardarPerfil} className="form-grid" style={{ maxWidth: 520 }}>
				<input placeholder="Nombres" value={nombre} onChange={(e) => setNombre(e.target.value)} />
				<input placeholder="Apellidos" value={apellido} onChange={(e) => setApellido(e.target.value)} />
				<input placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
				<button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</button>
			</form>
			{error ? <p className="error-text">{error}</p> : null}
			{ok ? <p className="ok-text">{ok}</p> : null}

			<h3>Cursos aprobados</h3>
			<CursosAprobados idUsuario={user?.id_usuario} />
		</section>
	);
}
