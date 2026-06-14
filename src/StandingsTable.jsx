import { useState, useEffect } from 'react';
import './StandingsTable.css';

const StandingsTable = () => {
  const [groups, setGroups] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('https://api-mundial-2026-iwfn.onrender.com/api/groups').then(res => res.json()),
      fetch('https://api-mundial-2026-iwfn.onrender.com/api/teams').then(res => res.json())
    ]).then(([groupsData, teamsData]) => {
      setGroups(groupsData);
      setTeams(teamsData);
    }).catch(err => console.error("Error al cargar datos:", err));
  }, []);

  const getTeamInfo = (teamId) => {
    return teams.find(t => t.id.toString() === teamId.toString()) || { name_en: "Desconocido", flag: "" };
  };

  return (
    <div className="standings-table">
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
                {group.teams.sort((a, b) => parseInt(b.pts) - parseInt(a.pts)).map((team) => {
                  const teamInfo = getTeamInfo(team.team_id);
                  return (
                    <tr key={team.team_id}>
                      <td className="team-cell">
                        <img src={teamInfo.flag} alt={teamInfo.name_en} style={{ width: '25px', marginRight: '8px', borderRadius: '2px' }} />
                        {teamInfo.name_en}
                      </td>
                      <td>{team.mp}</td>
                      <td>{team.w}</td>
                      <td>{team.d}</td>
                      <td>{team.l}</td>
                      <td>{team.gf}</td>
                      <td>{team.ga}</td>
                      <td>{team.gd}</td>
                      <td className="pts">{team.pts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandingsTable;