import { coaches } from './coaches';

export default function LineupComponent({ homePlayers, awayPlayers, homeBench, awayBench, match, teams }) {
  if (!match) return null;

  // Calculamos los coaches usando el objeto importado y el ID del partido
  const homeCoach = coaches[match.home_team_id];
  const awayCoach = coaches[match.away_team_id];

  // Buscamos los datos del equipo en la tabla 'teams' usando el ID
  const homeTeamData = teams.find(t => t.id === match.home_team_id);
  const awayTeamData = teams.find(t => t.id === match.away_team_id);

  const isFinished = match.status === 'finished' || match.status === 'Finalizado';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#1a1c21] text-white rounded-lg">
      
      {/* Header Unificado */}
      <div className="text-center border-b border-gray-700 pb-6 mb-8">
        
        {/* Nombres y Banderas desde DB */}
        <div className="flex justify-center items-center gap-12 mb-6">
          <div className="flex flex-col items-center">
            {homeTeamData && <img src={homeTeamData.flag} alt={homeTeamData.name_en} className="w-16 h-12 object-contain mb-2" />}
            <span className="text-xl font-bold">{match.home_team_name}</span>
          </div>

          <div className="text-4xl font-black">
            {isFinished ? (
              <span>{match.score?.home ?? 0} - {match.score?.away ?? 0}</span>
            ) : (
              <span className="text-2xl text-gray-500">VS</span>
            )}
          </div>

          <div className="flex flex-col items-center">
            {awayTeamData && <img src={awayTeamData.flag} alt={awayTeamData.name_en} className="w-16 h-12 object-contain mb-2" />}
            <span className="text-xl font-bold">{match.away_team_name}</span>
          </div>
        </div>

        {/* Estado del partido */}
        <p className="text-sm font-medium uppercase text-gray-400">
          {isFinished ? 'FINALIZADO' : 'PRÓXIMO PARTIDO'}
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
        <span>DT Home: {homeCoach || 'No asignado'}</span>
        <span>DT Away: {awayCoach || 'No asignado'}</span>
      </div>
    </div>
  );
}

// Sub-componente para las filas de jugadores
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