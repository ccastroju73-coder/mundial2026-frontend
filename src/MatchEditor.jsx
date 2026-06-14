// MatchEditor.jsx
import { useState } from 'react';

const MatchEditor = ({ match, onUpdate }) => {
  const [homeScore, setHomeScore] = useState(match.home_score || 0);
  const [awayScore, setAwayScore] = useState(match.away_score || 0);

  const handleSave = async () => {
    // Usamos el ID del partido que viene de tu API
    const response = await fetch(`https://api-mundial-2026-iwfn.onrender.com/api/matches/${match._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        home_score: homeScore,
        away_score: awayScore,
        finished: "TRUE" // Esto disparará tu lógica de recálculo en el backend
      })
    });
    
    if (response.ok) {
        alert("Resultado guardado");
        onUpdate(); // Recarga la tabla de posiciones
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <input type="number" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} style={{ width: '40px' }} />
      -
      <input type="number" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} style={{ width: '40px' }} />
      <button onClick={handleSave}>✔</button>
    </div>
  );
};

export default MatchEditor;