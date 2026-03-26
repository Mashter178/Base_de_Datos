import { useState } from "react";
import api from "../services/api";

export default function Login({ onLogin, onGoRegister }) {
	const [correo, setCorreo] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			setError("");
			const { data } = await api.post("/login", { correo, password });
			onLogin(data);
		} catch (err) {
			setError(err?.response?.data?.error || "No se pudo iniciar sesion");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={submit} className="panel form-grid auth-panel">
			<h2>Iniciar sesion</h2>
			<input
				placeholder="Correo"
				value={correo}
				onChange={(e) => setCorreo(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			{error ? <p className="error-text">{error}</p> : null}
			<button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
			<button type="button" onClick={onGoRegister}>Crear cuenta</button>
		</form>
	);
}
