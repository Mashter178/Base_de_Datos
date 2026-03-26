import { useEffect, useState } from "react";
import api from "../services/api";

export default function CursosAprobados({ idUsuario }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/usuarios/${idUsuario}/cursos-aprobados`);
        setItems(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.error || "No se pudieron cargar cursos aprobados");
      } finally {
        setLoading(false);
      }
    };

    if (idUsuario) load();
  }, [idUsuario]);

  if (loading) return <p className="muted-text">Cargando cursos aprobados...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!items.length) return <p className="muted-text">No hay cursos aprobados registrados.</p>;

  return (
    <ul>
      {items.map((c) => (
        <li key={c.id_curso_aprobado}>
          {c.nombre_curso} - Nota: {c.nota_final}
        </li>
      ))}
    </ul>
  );
}
