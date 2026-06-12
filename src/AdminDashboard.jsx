import { useState, useEffect } from 'react';
import AdminMatchForm from './AdminMatchForm';

// Este componente es el panel de control para el administrador, donde puede ver los grupos y actualizar los resultados de los partidos.

const AdminDashboard = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Definimos la función DENTRO del useEffect para cumplir con las reglas de React
    const fetchData = async () => {
      try {
        const res = await fetch('https://mundial2026-frontend.onrender.com/api/dashboard-data'); 
        if (!res.ok) throw new Error('Error al cargar datos');
        const data = await res.json();
        setGroups(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []); // El array vacío [] asegura que solo se ejecute al montar el componente

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto' }}>
      <h1>Panel de Control del Mundial</h1>
      {groups && groups.length > 0 ? (
        groups.map(group => (
          <div key={group._id} style={{ marginBottom: '40px', borderBottom: '2px solid #ccc' }}>
            <h2>Grupo {group.group}</h2>
            {group.matches && group.matches.map(match => (
              <div key={match._id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '10px' }}>
                <span>{match.homeTeam}</span>
                <AdminMatchForm match={match} onUpdate={() => window.location.reload()} />
                <span>{match.awayTeam}</span>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>Cargando grupos...</p>
      )}
    </div>
  );
};

export default AdminDashboard;