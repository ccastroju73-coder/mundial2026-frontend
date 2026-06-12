import { useState, useEffect } from 'react';
// import AdminMatchForm from './AdminMatchForm';

const AdminDashboard = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api-mundial-2026-iwfn.onrender.com/api/dashboard-data'); 
        const data = await res.json();
        setGroups(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
      <h1>Panel de Control del Mundial</h1>
      {groups.map(group => (
        <div key={group._id} style={{ marginBottom: '40px' }}>
          <h2>Grupo {group.group}</h2>
          {/* Mapeamos 'teams' en lugar de 'matches' */}
          <table style={{ width: '100%', marginBottom: '20px', textAlign: 'left', borderCollapse: 'collapse' }}>
               <thead>
                   <tr style={{ borderBottom: '1px solid #555' }}>
      <                th>Equipo</th><th>PJ</th><th>Pts</th>
                   </tr>
                </thead>
              <tbody>
                  {group.teams.map(team => (
                     <tr key={team._id}>
                        <td style={{ padding: '8px' }}>{team.team_id}</td>
                        <td>{team.mp}</td>
                        <td>{team.pts}</td>
                     </tr>
                    ))}
              </tbody>
           </table>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;