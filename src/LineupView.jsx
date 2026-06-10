import PlayerRow from './PlayerRow'; // <--- ¡Añade esta línea!

export default function LineupView({ homePlayers, awayPlayers }) {
  const maxLength = Math.max(homePlayers.length, awayPlayers.length);
  
  return (
    <div className="bg-[#1a1d23] rounded-3xl p-6">
      <div className="grid grid-cols-2 text-gray-500 text-xs uppercase font-bold mb-4">
        <span>Equipo Local</span>
        <span>Equipo Visitante</span>
      </div>
      
      {[...Array(maxLength)].map((_, i) => (
        <div key={i} className="grid grid-cols-2 gap-4 py-2 border-b border-white/5">
          <PlayerRow player={homePlayers[i]} />
          <PlayerRow player={awayPlayers[i]} />
        </div>
      ))}
    </div>
  );
}