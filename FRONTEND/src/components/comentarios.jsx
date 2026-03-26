import { useState } from "react";
import api from "../services/api";

export default function Comentarios({ idPublicacion, idUsuario }) {
  const [comentarios, setComentarios] = useState([]);
  const [expandido, setExpandido] = useState(false);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarComentarios = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/comentarios/publicacion/${idPublicacion}`);
      setComentarios(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.error || "No se pudieron cargar comentarios");
    } finally {
      setLoading(false);
    }
  };

  const toggleComentarios = async () => {
    const next = !expandido;
    setExpandido(next);
    if (next) {
      await cargarComentarios();
    }
  };

  const crearComentario = async () => {
    try {
      setError("");
      if (!texto.trim()) return;
      await api.post(`/comentarios/publicacion/${idPublicacion}`, {
        id_usuario: idUsuario,
        texto,
      });
      setTexto("");
      await cargarComentarios();
    } catch (err) {
      setError(err?.response?.data?.error || "No se pudo crear comentario");
    }
  };

  return (
    <div className="form-grid" style={{ marginTop: 8 }}>
      <div className="actions-row">
        <button type="button" onClick={toggleComentarios}>
          {expandido ? "Ocultar comentarios" : "Ver comentarios"}
        </button>
      </div>

      {expandido && loading ? <p className="muted-text">Cargando comentarios...</p> : null}

      {expandido && comentarios.length ? (
        <ul className="comments-list" style={{ marginTop: 0 }}>
          {comentarios.map((c) => (
            <li key={c.id_comentario}>
              <b>{c.nombre} {c.apellido}:</b> {c.texto}
            </li>
          ))}
        </ul>
      ) : null}

      <input
        placeholder="Escribe un comentario"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <button type="button" onClick={crearComentario}>Comentar</button>

      {error ? <p className="error-text">{error}</p> : null}
    </div>
  );
}
