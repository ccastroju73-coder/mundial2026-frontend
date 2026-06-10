import { coaches } from './coaches';

export default function LineupComponent({ homePlayers, awayPlayers, homeBench, awayBench, match }) {
  if (!match) return null;

  const homeCoach = coaches[match.home_team_id];
  const awayCoach = coaches[match.away_team_id];

  // Identificamos si el partido ya terminó o no
  // Ajusta 'match.status' según el nombre que tenga en tu base de datos (ej: 'finished', 'finalized', etc.)
  const isFinished = match.status === 'finished' || match.status === 'Finalizado';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#1a1c21] text-white rounded-lg">
      {/* Header Dinámico */}
      <div className="text-center border-b border-gray-700 pb-6 mb-8">
        {/* Nombres de los equipos */}
        <div className="flex justify-center items-center gap-12 text-2xl font-bold mb-4">
          <span>{match.home_team_name}</span>
          <span>{match.away_team_name}</span>
        </div>

        {/* Marcador o VS */}
        {isFinished ? (
          <div className="text-6xl font-black my-2 tracking-widest">
            {match.score?.home ?? 0} - {match.score?.away ?? 0}
          </div>
        ) : (
          <div className="text-2xl font-bold text-gray-500 my-6">VS</div>
        )}

        {/* Etiqueta de estado */}
        <p className="text-sm font-medium uppercase text-gray-400">
          {isFinished ? 'FINALIZADO' : 'PRÓXIMO PARTIDO'}
        </p>
      </div>

      {/* ... resto de tu código de alineaciones (Formación Inicial y Suplentes) ... */}
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