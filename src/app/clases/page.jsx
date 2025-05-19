'use client'
import { useEffect, useState } from 'react';

export default function ClasesPage() {
  const [clases, setClases] = useState([]);

  useEffect(() => {
    fetch('/api/clases')
      .then(res => res.json())
      .then(data => setClases(data));
  }, []);

  return (
    <main style={{ padding: '1rem' }}>
      <h1>Clases Disponibles</h1>
      <ul>
        {clases.map((clase) => (
          <li key={clase._id}>
            <strong>{clase.nombre}</strong>: {clase.descripcion}
            <br />
            Habilidades: {clase.habilidades.join(', ')}
          </li>
        ))}
      </ul>
    </main>
  );
}
