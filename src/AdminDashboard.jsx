import { useState, useEffect, useCallback, useMemo } from 'react';

// --- MUEVE LOS ESTILOS AQUÍ AFUERA ---
const tableCellStyle = { 
  padding: '8px', 
  textAlign: 'center', 
  width: '30px' 
};

const teamNameStyle = { 
  padding: '8px', 
  textAlign: 'left', 
  width: '150px' 
};

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

      {groups.sort((a, b) => a.group.localeCompare(b.group)).map(group => {
        const groupMatches = groupedMatches[group.group] || [];
        
        return (
          <div key={group._id} style={{ 
            display: 'flex', gap: '30px', marginBottom: '40px', borderBottom: '2px solid #333', 
            paddingBottom: '30px', alignItems: 'flex-start' 
          }}>
            
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

            <div style={{ flex: 1, backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '8px' }}>
              <h4 style={{ color: '#aaa', marginBottom: '15px' }}>Grupo {group.group} - Posiciones</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ color: '#aaa', fontSize: '0.85rem', borderBottom: '1px solid #333' }}>
                    <th style={teamNameStyle}>Equipo</th>
                    <th style={tableCellStyle}>PJ</th><th style={tableCellStyle}>G</th><th style={tableCellStyle}>E</th>
                    <th style={tableCellStyle}>P</th><th style={tableCellStyle}>DG</th><th style={tableCellStyle}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {group.teams.map(team => {
                    const info = getTeamInfo(team.team_id);
                    return (
                      <tr key={team._id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={teamNameStyle}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={info.flag} style={{ width: '20px', marginRight: '8px' }} /> {info.name_en}
                          </div>
                        </td>
                        <td style={tableCellStyle}>{team.mp}</td>
                        <td style={tableCellStyle}>{team.w}</td>
                        <td style={tableCellStyle}>{team.d}</td>
                        <td style={tableCellStyle}>{team.l}</td>
                        <td style={tableCellStyle}>{team.gd}</td>
                        <td style={{...tableCellStyle, fontWeight: 'bold', color: '#00ff00'}}>
                          {team.pts}
                        </td>
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