// MatchEditor.jsx
import { useState } from 'react';

const MatchEditor = ({ match, onUpdate }) => {
  const [homeScore, setHomeScore] = useState(match.home_score || 0);
  const [awayScore, setAwayScore] = useState(match.away_score || 0);
  const [loading, setLoading] = useState(false); // <--- NUEVO ESTADO

  const handleSave = async () => {
    if (loading) return; // Si ya está cargando, no hacer nada
    setLoading(true);    // Bloquear el botón

    try {
      const response = await fetch(`https://api-mundial-2026-iwfn.onrender.com/api/matches/${match._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          home_score: parseInt(homeScore), 
          away_score: parseInt(awayScore), 
          finished: "TRUE" 
        })
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Desbloquear después de terminar
    }
  };

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <input type="number" value={homeScore} onChange={e => setHomeScore(e.target.value)} style={{ width: '40px' }} />
      -
      <input type="number" value={awayScore} onChange={e => setAwayScore(e.target.value)} style={{ width: '40px' }} />
      <button onClick={handleSave} disabled={loading}>
        {loading ? "..." : "✔"}
      </button>
    </div>
  );
};

export default MatchEditor;