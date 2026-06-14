import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  // Todo esto debe ir DENTRO de la función del componente
  const [groups, setGroups] = useState([]);
  const [teamsData, setTeamsData] = useState([]);

  const getTeamInfo = (id) => {
  return teamsData.find(t => t.id === id) || { name_en: "Desconocido", flag: "" };
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, teamsRes] = await Promise.all([
          fetch('https://api-mundial-2026-iwfn.onrender.com/api/dashboard-data'),
          fetch('https://api-mundial-2026-iwfn.onrender.com/api/teams')
        ]);
        
        const groupsJson = await groupsRes.json();
        const teamsJson = await teamsRes.json();
        
        setGroups(groupsJson);
        setTeamsData(teamsJson);
      } catch (error) {
        console.error("Error al cargar:", error);
      }
    };
    fetchData();
  }, []);

// Cambia tu return para asegurar que los datos existan antes de mapear
return (
  <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
    <h1>Panel de Control del Mundial</h1>
    {/* Añadimos esta condición para que no intente renderizar sin datos */}
    {groups.length > 0 && teamsData.length > 0 ? (
      groups.map(group => (
        <div key={group._id} style={{ marginBottom: '40px' }}>
          <h2>Grupo {group.group}</h2>
                <table style={{ width: '100%', marginBottom: '20px', textAlign: 'center', borderCollapse: 'collapse', color: '#fff' }}>
                     <thead>
                         <tr style={{ borderBottom: '1px solid #444', color: '#aaa' }}>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Equipo</th>
                            <th>PJ</th><th>G</th><th>E</th><th>P</th><th>DG</th><th>Pts</th>
                         </tr>
                        </thead>
                        <tbody>
                            {group.teams.map(team => {
                               const info = getTeamInfo(team.team_id);
                               return (
                                    <tr key={team._id} style={{ borderBottom: '1px solid #222' }}>
                                       <td style={{ textAlign: 'left', padding: '10px' }}>
                                           <img src={info.flag} alt={info.name_en} style={{ width: '20px', marginRight: '10px', borderRadius: '2px' }} />
                                           {info.name_en}
                                        </td>
                                        <td>{team.mp}</td> {/* Partidos Jugados */}
                                        <td>{team.w}</td>  {/* Ganados */}
                                        <td>{team.d}</td>  {/* Empatados */}
                                        <td>{team.l}</td>  {/* Perdidos */}
                                        <td>{team.gd}</td> {/* Diferencia de Goles */}
                                        <td style={{ fontWeight: 'bold', color: '#00ff00' }}>{team.pts}</td>
                                    </tr>
                                );
                             })}
                        </tbody>
                </table>
        </div>
      ))
    ) : (
      <p>Cargando información completa...</p>
    )}
  </div>
 );
};

export default AdminDashboard;