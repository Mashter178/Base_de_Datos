import { useEffect, useState } from "react";
import api from "../services/api";
import PublicacionCard from "./publicacionCard";

export default function Feed() {
const [items, setItems] = useState([]);
const [error, setError] = useState("");

useEffect(() => {
api.get("/publicaciones")
.then((res) => setItems(res.data))
.catch((err) => setError(err.message));
}, []);

if (error) return <p>Error: {error}</p>;
if (!items.length) return <p>No hay publicaciones todavia.</p>;

return (
<div>
<h2>Feed de Publicaciones</h2>
{items.map((p) => (
<PublicacionCard key={p.id_publicacion} p={p} />
))}
</div>
);
}