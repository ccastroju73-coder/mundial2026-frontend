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


  const groupedMatches = useMemo(() => {
    if (!matches || matches.length === 0) return {};
    const acc = matches.reduce((groupAcc, match) => {
      if (!groupAcc[match.group]) groupAcc[match.group] = [];
      groupAcc[match.group].push(match);
      return groupAcc;
    }, {});
    Object.keys(acc).forEach(key => acc[key].sort((a, b) => parseInt(a.id) - parseInt(b.id)));
    return acc;
  }, [matches]);

  const getTeamInfo = (id) => teamsData.find(t => t.id === id) || { name_en: "Desconocido", flag: "" };

  return (
    <div style={{ maxWidth: '1400px', margin: 'auto', padding: '20px' }}>
      <h1>Panel de Control del Mundial</h1>

      {/* Iteramos sobre los grupos para asegurar que partidos y tabla siempre vayan juntos */}
      {groups.sort((a, b) => a.group.localeCompare(b.group)).map(group => {
        const groupMatches = groupedMatches[group.group] || [];
        
        return (
          <div key={group._id} style={{ 
            display: 'flex', 
            gap: '30px', 
            marginBottom: '40px', 
            borderBottom: '2px solid #333', 
            paddingBottom: '30px',
            alignItems: 'flex-start' 
          }}>
            
            {/* Columna Partidos */}
            <div style={{ flex: 1, backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '8px' }}>
              <h4 style={{ color: '#aaa', marginBottom: '15px' }}>Grupo {group.group} - Partidos</h4>
              {groupMatches.map(match => {
                const homeTeam = getTeamInfo(match.home_team_id);
                const awayTeam = getTeamInfo(match.away_team_id);
                const [datePart, time] = match.local_date.split(' ');
                const [mm, dd, yyyy] = datePart.split('/');
                return (
                  <div key={match._id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #333', fontSize: '0.85rem' }}>
                    <span style={{ width: '30px', color: '#888' }}>#{match.id}</span>
                    <span style={{ width: '70px', color: '#ccc' }}>{dd}/{mm}/{yyyy}</span>
                    <span style={{ width: '50px', color: '#aaa' }}>{time}</span>
                    <div style={{ display: 'flex', alignItems: 'center', width: '150px' }}>
                      <img src={homeTeam.flag} style={{ width: '20px', marginRight: '8px' }} /> {homeTeam.name_en}
                    </div>
                    <MatchEditor match={match} onUpdate={fetchData} />
                    <div style={{ display: 'flex', alignItems: 'center', width: '150px', justifyContent: 'flex-end' }}>
                      {awayTeam.name_en} <img src={awayTeam.flag} style={{ width: '20px', marginLeft: '8px' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Columna Posiciones */}
            <div style={{ flex: 1, backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '8px' }}>
              <h4 style={{ color: '#aaa', marginBottom: '15px' }}>Grupo {group.group} - Posiciones</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ color: '#aaa', borderBottom: '1px solid #333' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Equipo</th>
                    <th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {group.teams.map(team => {
                    const info = getTeamInfo(team.team_id);
                    return (
                      <tr key={team._id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                          <img src={info.flag} style={{ width: '20px', marginRight: '8px' }} /> {info.name_en}
                        </td>
                        <td style={{ textAlign: 'center' }}>{team.mp}</td>
                        <td style={{ textAlign: 'center' }}>{team.w}</td>
                        <td style={{ textAlign: 'center' }}>{team.d}</td>
                        <td style={{ textAlign: 'center' }}>{team.l}</td>
                        <td style={{ textAlign: 'center' }}>{team.gf}</td>
                        <td style={{ textAlign: 'center' }}>{team.ga}</td>
                        <td style={{ textAlign: 'center' }}>{team.gd}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#00ff00' }}>{team.pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminDashboard;