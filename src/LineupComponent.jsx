//import PlayerRow from './PlayerRow'; // <--- ¡Añade esta línea!

// LineupComponent.jsx
export default function LineupComponent({ homePlayers, awayPlayers }) {
  // Aseguramos mostrar hasta 11 jugadores
  const rows = Array.from({ length: 11 }); 

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Columna Local */}
      <div className="space-y-2">
        {rows.map((_, i) => (
          <div key={i} className="flex items-center gap-2 p-2 bg-white/5 rounded">
            <span className="font-bold text-gray-500">{homePlayers[i]?.jersey_number || '-'}</span>
            <span className="text-white">{homePlayers[i]?.name || 'Sin asignar'}</span>
          </div>
        ))}
      </div>
      
      {/* Columna Visitante */}
      <div className="space-y-2">
        {rows.map((_, i) => (
          <div key={i} className="flex items-center gap-2 p-2 bg-white/5 rounded">
            <span className="text-white">{awayPlayers[i]?.name || 'Sin asignar'}</span>
            <span className="font-bold text-gray-500">{awayPlayers[i]?.jersey_number || '-'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}