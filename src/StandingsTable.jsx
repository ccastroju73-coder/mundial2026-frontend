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
                  <th>PJ</th><th>G</th><th>E</th><th>P</th><th>DG</th><th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {/* Ordenamos por puntos (pts) descendente */}
                {group.teams.sort((a, b) => parseInt(b.pts) - parseInt(a.pts)).map((team) => (
                  <tr key={team.team_id}>
                    <td className="team-cell">
                      {/* Asumiendo que tienes una URL de bandera en tu objeto team */}
                      <img src={team.flag} alt={team.name} />
                      {team.name}
                    </td>
                    <td>{team.mp}</td>
                    <td>{team.w}</td>
                    <td>{team.d}</td>
                    <td>{team.l}</td>
                    <td>{team.gd}</td>
                    <td className="pts">{team.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandingsPage;