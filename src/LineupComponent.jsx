import { coaches } from './coaches';

export default function LineupComponent({ homePlayers, awayPlayers, homeBench, awayBench, match }) {
  if (!match) return null;

  const homeCoach = coaches[match.home_team_id];
  const awayCoach = coaches[match.away_team_id];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#1a1c21] text-white rounded-lg">
        {/* Header Mejorado */}
        <div className="text-center border-b border-gray-700 pb-6 mb-8">
             {/* Nombres de los equipos */}
             <div className="flex justify-center items-center gap-12 text-2xl font-bold mb-4">
                <span>{match.home_team_name}</span>
                <span>{match.away_team_name}</span>
             </div>

             {/* Marcador */}
             <div className="text-6xl font-black my-2 tracking-widest">
               {match.score?.home ?? 0} - {match.score?.away ?? 0}
             </div>

            {/* Estado del partido */}
            <p className={`text-sm font-medium ${match.status === 'not_started' ? 'text-yellow-500' : 'text-gray-400'}`}>
                {match.status === 'not_started' ? 'NO INICIADO' : 'FINALIZADO'}
            </p>
        </div>
      {/* Formación Inicial */}
      <h2 className="text-lg font-bold mb-4 uppercase text-gray-400">Formación Inicial</h2>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          {homePlayers.map((p, i) => <PlayerRow key={i} player={p} />)}
        </div>
        <div className="space-y-2">
          {awayPlayers.map((p, i) => <PlayerRow key={i} player={p} reverse />)}
        </div>
      </div>

      {/* Suplentes */}
      <h2 className="text-lg font-bold mt-8 mb-4 uppercase text-gray-400">Suplentes</h2>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          {homeBench.map((p, i) => <PlayerRow key={i} player={p} />)}
        </div>
        <div className="space-y-2">
          {awayBench.map((p, i) => <PlayerRow key={i} player={p} reverse />)}
        </div>
      </div>

      {/* Footer Técnicos */}
      <div className="mt-10 pt-6 border-t border-gray-700 flex justify-between text-sm">
        <span>DT Home: {homeCoach}</span>
        <span>DT Away: {awayCoach}</span>
      </div>
    </div>
  );
}

// Sub-componente corregido
function PlayerRow({ player, reverse }) {
  return (
    <div className={`flex items-center gap-3 ${reverse ? 'flex-row-reverse' : ''}`}>
      <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-xs font-bold">
        {player.jersey_number}
      </div>
      <div className={reverse ? 'text-right' : ''}>
        <p className="text-sm">{player.name}</p>
        <p className="text-[10px] text-gray-500 uppercase">{player.pos}</p>
      </div>
    </div>
  );
}