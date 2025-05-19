'use client'
import { useEffect, useState } from 'react';

export default function MisionesPage() {
  const [misiones, setMisiones] = useState([]);

  useEffect(() => {
    fetch('/api/misiones')
      .then(res => res.json())
      .then(data => setMisiones(data));
  }, []);

  return (
    <main style={{ padding: '1rem' }}>
      <h1>Misiones</h1>
      <ul>
        {misiones.map((mision) => (
          <li key={mision._id}>
            <strong>{mision.titulo}</strong>: {mision.descripcion}
            <br />
            XP: {mision.experiencia} | Estado: {mision.estado}
          </li>
        ))}
      </ul>
    </main>
  );
}
