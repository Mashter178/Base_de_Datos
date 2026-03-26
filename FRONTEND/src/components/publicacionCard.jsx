import Comentarios from "./comentarios";

export default function PublicacionCard({ p, user }) {

	return (
		<div className="panel post-card">
			<h3>{p.titulo}</h3>
			<p>{p.contenido}</p>
			<small>
				{p.usuario_nombre} {p.usuario_apellido} - {p.nombre_curso}
			</small>

			<Comentarios idPublicacion={p.id_publicacion} idUsuario={user?.id_usuario} />
		</div>
	);
}