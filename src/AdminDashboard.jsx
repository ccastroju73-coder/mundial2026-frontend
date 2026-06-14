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
          <table style={{ width: '100%', marginBottom: '20px', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #555' }}>
                <th>Equipo</th><th>PJ</th><th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {group.teams.map(team => {
                const info = getTeamInfo(team.team_id);
                return (
                  <tr key={team._id}>
                    <td style={{ padding: '8px' }}>
                      <img src={info.flag} alt={info.name_en} style={{ width: '25px', marginRight: '10px' }} />
                      {info.name_en}
                    </td>
                    <td>{team.mp}</td>
                    <td>{team.pts}</td>
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