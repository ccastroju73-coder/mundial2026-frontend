import { useState, useEffect, useCallback } from 'react';

// 1. Define el componente MatchEditor
  const MatchEditor = ({ match, onUpdate }) => {
  const [homeScore, setHomeScore] = useState(match.home_score || 0);
  const [awayScore, setAwayScore] = useState(match.away_score || 0);

  const handleSave = async () => {
    const response = await fetch(`https://api-mundial-2026-iwfn.onrender.com/api/matches/${match._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ home_score: parseInt(homeScore), away_score: parseInt(awayScore), finished: "TRUE" })
    });
    if (response.ok) onUpdate();
  };

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <input type="number" value={homeScore} onChange={e => setHomeScore(e.target.value)} style={{ width: '40px' }} />
      -
      <input type="number" value={awayScore} onChange={e => setAwayScore(e.target.value)} style={{ width: '40px' }} />
      <button onClick={handleSave}>✔</button>
    </div>
  );
};

const AdminDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [matches, setMatches] = useState([]);

  const fetchData = useCallback(async () => {
    const [groupsRes, teamsRes, matchesRes] = await Promise.all([
      fetch('https://api-mundial-2026-iwfn.onrender.com/api/dashboard-data'),
      fetch('https://api-mundial-2026-iwfn.onrender.com/api/teams'),
      fetch('https://api-mundial-2026-iwfn.onrender.com/api/matches')
    ]);
    setGroups(await groupsRes.json());
    setTeamsData(await teamsRes.json());
    setMatches(await matchesRes.json());
  }, []);

 // Asegúrate de que fetchData esté definido con useCallback arriba
  useEffect(() => {
    let isMounted = true; // Variable de control para evitar actualizaciones si el componente se desmonta

    const loadData = async () => {
      await fetchData();
    };

    if (isMounted) {
      loadData();
    }

    return () => { isMounted = false; }; // Limpieza
  }, [fetchData]);

  const getTeamInfo = (id) => {
    return teamsData.find(t => t.id === id) || { name_en: "Desconocido", flag: "" };
  };

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
      <h1>Panel de Control del Mundial</h1>
      
      {/* Sección de partidos */}
      <div style={{ marginBottom: '50px' }}>
        <h3>Partidos</h3>
        {matches.map(match => (
           <div key={match._id} style={{ display: 'flex', gap: '10px', padding: '5px' }}>
              <span>ID: {match.home_team_id} vs {match.away_team_id}</span>
              <MatchEditor match={match} onUpdate={fetchData} />
           </div>
        ))}
      </div>

      {/* Tabla de posiciones */}
      {groups.length > 0 && teamsData.length > 0 ? (
        groups.map(group => (
          <div key={group._id} style={{ marginBottom: '40px' }}>
            <h2>Grupo {group.group}</h2>
            <table style={{ width: '100%', marginBottom: '40px', borderCollapse: 'collapse', color: '#fff', tableLayout: 'fixed' }}>
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