import { useState, useEffect } from 'react';
import './StandingsTable.css'; // Asegúrate de crear este archivo

const StandingsPage = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Ajusta la URL según el endpoint que ya tienes funcionando
    fetch('https://api-mundial-2026-iwfn.onrender.com/api/groups')
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error("Error al cargar grupos:", err));
  }, []);

  return (
    <div className="standings-page">
      <h1>Tabla de Posiciones</h1>
      <div className="groups-grid">
        {groups.map((group) => (
          <div key={group._id} className="group-card">
            <h3>{group.name}</h3>
            <table>
              <thead>
                <tr>
                  <th>Equipo</th>
                  <th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th>Pts</th>
                </tr>
              </thead>
            <tbody>
                 {group.teams.sort((a, b) => parseInt(b.pts) - parseInt(a.pts)).map((team) => (
                    <tr key={team.team_id}>
                        <td className="team-cell" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' }}>
                            {/* Aquí agregamos la lógica de la imagen y el nombre */}
                            <img 
                                src={team.flag || 'https://via.placeholder.com/20'} // Usa la propiedad flag o un placeholder
                                alt={team.name} 
                                style={{ width: '25px', height: '18px', borderRadius: '2px' }} 
                            />
                            <span style={{ color: 'white' }}>{team.name}</span>
                        </td>
                        <td>{team.mp}</td>
                        <td>{team.w}</td>
                        <td>{team.d}</td>
                        <td>{team.l}</td>
                        <td>{team.gd}</td>
                        <td className="pts" style={{ color: '#4ade80', fontWeight: 'bold' }}>{team.pts}</td>
                    </tr>
                ))}
              </tbody>..
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandingsPage;