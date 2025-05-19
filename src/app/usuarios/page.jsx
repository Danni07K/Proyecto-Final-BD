'use client'
import { useEffect, useState } from 'react';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data));
  }, []);

  return (
    <main style={{ padding: '1rem' }}>
      <h1>Usuarios</h1>
      <ul>
        {usuarios.map((u) => (
          <li key={u._id}>
            <strong>{u.nombre}</strong> - Clase: {u.clase?.nombre || 'Sin clase'}
            <br />
            Nivel: {u.nivel} | XP: {u.experiencia}
            <br />
            Misiones completadas: {u.misionesCompletadas?.length ?? 0}
          </li>
        ))}
      </ul>
    </main>
  );
}
