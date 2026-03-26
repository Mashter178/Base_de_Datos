export default function PublicacionCard({ p }) {
return (
<div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
<h3>{p.titulo}</h3>
<p>{p.contenido}</p>
<small>
{p.usuario_nombre} {p.usuario_apellido} - {p.nombre_curso}
</small>
</div>
);
}