import { useState } from "react";
import api from "../services/api";

export default function Register({ onGoLogin }) {
	const [registroAcademico, setRegistroAcademico] = useState("");
	const [nombre, setNombre] = useState("");
	const [apellido, setApellido] = useState("");
	const [correo, setCorreo] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			setError("");
			setMessage("");
			await api.post("/register", { registroAcademico, nombre, apellido, correo, password });
			setMessage("Registro exitoso. Ahora puedes iniciar sesion.");
		} catch (err) {
			setError(err?.response?.data?.error || "No se pudo registrar usuario");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={submit} className="panel form-grid auth-panel">
			<h2>Registro</h2>
			<input placeholder="Registro academico" value={registroAcademico} onChange={(e) => setRegistroAcademico(e.target.value)} />
			<input placeholder="Nombres" value={nombre} onChange={(e) => setNombre(e.target.value)} />
			<input placeholder="Apellidos" value={apellido} onChange={(e) => setApellido(e.target.value)} />
			<input placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
			<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
			{error ? <p className="error-text">{error}</p> : null}
			{message ? <p className="ok-text">{message}</p> : null}
			<button type="submit" disabled={loading}>{loading ? "Guardando..." : "Registrar"}</button>
			<button type="button" onClick={onGoLogin}>Volver a login</button>
		</form>
	);
}
