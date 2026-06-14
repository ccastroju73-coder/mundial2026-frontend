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
              <table style={{ 
                    width: '100%', 
                    marginBottom: '40px', 
                    borderCollapse: 'collapse', 
                    color: '#fff',
                    tableLayout: 'fixed' // ¡ESTO ES LA CLAVE para que todas las tablas midan igual!
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333', color: '#aaa', fontSize: '0.9rem' }}>
                      <th style={{ textAlign: 'left', padding: '12px', width: '40%' }}>Equipo</th>
                      <th style={{ width: '10%' }}>PJ</th>
                      <th style={{ width: '10%' }}>G</th>
                      <th style={{ width: '10%' }}>E</th>
                      <th style={{ width: '10%' }}>P</th>
                      <th style={{ width: '10%' }}>DG</th>
                      <th style={{ width: '10%' }}>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.teams.map(team => {
                       const info = getTeamInfo(team.team_id);
                       return (
                          <tr key={team._id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                            <td style={{ textAlign: 'left', padding: '12px', display: 'flex', alignItems: 'center' }}>
                                <img src={info.flag} alt={info.name_en} style={{ width: '24px', marginRight: '12px', borderRadius: '3px' }} />
                                {info.name_en}
                            </td>
                            <td style={{ textAlign: 'center' }}>{team.mp}</td>
                            <td style={{ textAlign: 'center' }}>{team.w}</td>
                            <td style={{ textAlign: 'center' }}>{team.d}</td>
                            <td style={{ textAlign: 'center' }}>{team.l}</td>
                            <td style={{ textAlign: 'center' }}>{team.gd}</td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#00ff00' }}>{team.pts}</td>
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