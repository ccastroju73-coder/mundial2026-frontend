import { useState } from 'react';

const AdminMatchForm = ({ match, onUpdate }) => {
  const [goals, setGoals] = useState({
    homeGoals: match.homeGoals || 0,
    awayGoals: match.awayGoals || 0
  });

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/matches/${match._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goals)
      });

      if (response.ok) {
        alert("¡Resultado actualizado y tabla recalculada!");
        onUpdate(); // Esto refresca la lista en tu pantalla principal
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <input 
        type="number" 
        style={{ width: '40px', textAlign: 'center' }}
        value={goals.homeGoals} 
        onChange={(e) => setGoals({...goals, homeGoals: e.target.value})}
      />
      <span> - </span>
      <input 
        type="number" 
        style={{ width: '40px', textAlign: 'center' }}
        value={goals.awayGoals} 
        onChange={(e) => setGoals({...goals, awayGoals: e.target.value})}
      />
      <button onClick={handleUpdate} style={{ marginLeft: '10px' }}>Guardar</button>
    </div>
  );
};

export default AdminMatchForm;