import { coaches } from './coaches';

export default function LineupComponent({ homePlayers, awayPlayers, homeBench, awayBench, match }) {
  // Obtenemos los nombres de los DTs usando el ID del equipo
  const homeCoach = coaches[match.home_team_id];
  const awayCoach = coaches[match.away_team_id];

  return (
    <div className="bg-[#1a1c21] text-white rounded-lg p-6 max-w-4xl mx-auto shadow-xl">
      
      {/* 1. Header del Partido (Marcador) */}
      <div className="text-center border-b border-gray-700 pb-6 mb-8">
        <div className="flex justify-center items-center gap-12 text-3xl font-bold">
          <span>{match.home_team_name}</span>
          <span className="text-5xl">{match.score.home} - {match.score.away}</span>
          <span>{match.away_team_name}</span>
        </div>
        <p className="text-gray-400 mt-2 font-medium">Finalizado</p>
      </div>

      {/* 2. Formación Inicial */}
      <h3 className="text-center font-bold text-lg mb-6 bg-gray-800 py-2 rounded">Formación Inicial</h3>
      <PlayerGrid home={homePlayers} away={awayPlayers} />

      {/* 3. Suplentes */}
      <h3 className="text-center font-bold text-lg mt-10 mb-6 bg-gray-800 py-2 rounded">Suplentes</h3>
      <PlayerGrid home={homeBench} away={awayBench} />

      {/* 4. Footer Técnico y Nomenclaturas */}
      <div className="mt-12 pt-8 border-t border-gray-700">
        <div className="flex justify-between px-10 text-sm font-semibold text-gray-300">
          <span>DT: {homeCoach}</span>
          <span>DT: {awayCoach}</span>
        </div>
        
        {/* Nomenclaturas (íconos) */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-8 text-xs text-gray-400">
          <div className="flex items-center gap-2"><span>⚽</span> Gol</div>
          <div className="flex items-center gap-2"><span>🟨</span> Tarjeta Amarilla</div>
          <div className="flex items-center gap-2"><span>↑</span> Entra</div>
          <div className="flex items-center gap-2"><span>↓</span> Sale</div>
        </div>
      </div>
    </div>
  );
}

// Sub-componente para renderizar la fila de jugadores
function PlayerGrid({ home, away }) {
  return (
    <div className="grid grid-cols-2 gap-x-12">
      <div className="space-y-3">
        {home.map((p, i) => <PlayerRow key={i} player={p} />)}
      </div>
      <div className="space-y-3">
        {away.map((p, i) => <PlayerRow key={i} player={p} reverse />)}
      </div>
    </div>
  );
}

function PlayerRow({ player, reverse }) {
  return (
    <div className={`flex items-center gap-3 ${reverse ? 'flex-row-reverse' : ''}`}>
      <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-xs font-bold">
        {player.jersey_number}
      </div>
      <div className={reverse ? 'text-right' : ''}>
        <p className="text-sm font-semibold">{player.name}</p>
        <p className="text-[10px] text-gray-500 uppercase">{player.pos}</p>
      </div>
    </div>
  );
}