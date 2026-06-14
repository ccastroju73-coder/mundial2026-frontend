import { useState, useEffect, useCallback, useMemo } from 'react';

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

  // Lógica de agrupamiento y ordenamiento optimizada
  const groupedMatches = useMemo(() => {
    if (!matches || matches.length === 0) return {};
    
    const acc = matches.reduce((groupAcc, match) => {
      if (!groupAcc[match.group]) groupAcc[match.group] = [];
      groupAcc[match.group].push(match);
      return groupAcc;
    }, {});

    Object.keys(acc).forEach(key => {
      acc[key].sort((a, b) => parseInt(a.id) - parseInt(b.id));
    });
    
    return acc;
  }, [matches]);

  const getTeamInfo = (id) => {
    return teamsData.find(t => t.id === id) || { name_en: "Desconocido", flag: "" };
  };

return (
    <div style={{ maxWidth: '1400px', margin: 'auto', padding: '20px' }}>
      <h1>Panel de Control del Mundial</h1>
      
      {/* Contenedor principal que envuelve ambas columnas */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Columna de Partidos */}
        <div style={{ flex: 1 }}>
          <h3>Partidos</h3>
          {Object.keys(groupedMatches).sort().map(groupKey => (
            <div key={groupKey} style={{ marginBottom: '30px', backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '8px' }}>
              <h4 style={{ color: '#aaa', marginBottom: '15px' }}>Grupo {groupKey}</h4>
              {groupedMatches[groupKey].map(match => {
                const homeTeam = getTeamInfo(match.home_team_id);
                const awayTeam = getTeamInfo(match.away_team_id);
                
                const [datePart, time] = match.local_date.split(' ');
                const [mm, dd, yyyy] = datePart.split('/');
                const formattedDate = `${dd}/${mm}/${yyyy}`;

                return (
                  <div key={match._id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #333', fontSize: '0.9rem' }}>
                    <span style={{ width: '40px', color: '#888' }}>#{match.id}</span>
                    <span style={{ width: '80px', color: '#ccc' }}>{formattedDate}</span>
                    <span style={{ width: '60px', color: '#aaa' }}>{time}</span>
                    <div style={{ display: 'flex', alignItems: 'center', width: '200px' }}>
                      <img src={homeTeam.flag} alt={homeTeam.name_en} style={{ width: '20px', marginRight: '8px', borderRadius: '2px' }} />
                      {homeTeam.name_en}
                    </div>
                    <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                      <MatchEditor match={match} onUpdate={fetchData} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', width: '200px', justifyContent: 'flex-end' }}>
                      {awayTeam.name_en}
                      <img src={awayTeam.flag} alt={awayTeam.name_en} style={{ width: '20px', marginLeft: '8px', borderRadius: '2px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Columna de Tablas de Posiciones */}
        <div style={{ flex: 1 }}>
          <h3>Posiciones</h3>
          {groups.length > 0 && teamsData.length > 0 ? (
            groups.map(group => (
              <div key={group._id} style={{ marginBottom: '30px', backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ color: '#aaa', marginBottom: '15px' }}>Grupo {group.group}</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333', color: '#aaa', fontSize: '0.9rem' }}>
                      <th style={{ textAlign: 'left', padding: '12px' }}>Equipo</th>
                      <th>PJ</th><th>G</th><th>E</th><th>P</th><th>DG</th><th>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.teams.map(team => {
                      const info = getTeamInfo(team.team_id);
                      return (
                        <tr key={team._id} style={{ borderBottom: '1px solid #333' }}>
                          <td style={{ textAlign: 'left', padding: '12px', display: 'flex', alignItems: 'center' }}>
                            <img src={info.flag} style={{ width: '24px', marginRight: '10px' }} />
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
            <p>Cargando posiciones...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;