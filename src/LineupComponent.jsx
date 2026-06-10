import { coaches } from './coaches';

export default function LineupComponent({ homePlayers = [], awayPlayers = [], homeBench = [], awayBench = [], match, teams = [] }) {
  // 1. Si no hay partido, mostramos carga
  if (!match) return <div className="text-white p-10 text-center">Cargando datos del encuentro...</div>;

  // 2. Valores de coaches y equipos
  const homeCoach = coaches[match.home_team_id] || "DT no asignado";
  const awayCoach = coaches[match.away_team_id] || "DT no asignado";

  const homeTeamData = teams.find(t => t.id === match.home_team_id) || { name_en: match.home_team_name, flag: '' };
  const awayTeamData = teams.find(t => t.id === match.away_team_id) || { name_en: match.away_team_name, flag: '' };

  // 3. LÓGICA DE ESTADO Y MARCADOR (Ajustada a tus datos reales)
  // Usamos 'time_elapsed' y los campos directos de score
  const homeScore = match.home_score ?? 0;
  const awayScore = match.away_score ?? 0;
  
  // El partido está terminado si 'finished' es "TRUE" o 'time_elapsed' es "finished"
  const isFinished = match.finished === "TRUE" || match.time_elapsed === "finished";
  const isLive = match.time_elapsed !== "notstarted" && !isFinished;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#1a1c21] text-white rounded-lg">
      <div className="text-center border-b border-gray-700 pb-6 mb-8">
        <div className="flex justify-center items-center gap-12 mb-6">
          {/* Equipo Local */}
          <div className="flex flex-col items-center">
            {homeTeamData.flag && <img src={homeTeamData.flag} alt={match.home_team_name} className="w-16 h-12 object-contain mb-2" />}
            <span className="text-xl font-bold">{match.home_team_name}</span>
          </div>

          {/* Marcador dinámico */}
          <div className="text-4xl font-black">
            {(isFinished || isLive) ? (
              <span>{homeScore} - {awayScore}</span>
            ) : (
              <span className="text-2xl text-gray-500">VS</span>
            )}
          </div>

          {/* Equipo Visitante */}
          <div className="flex flex-col items-center">
            {awayTeamData.flag && <img src={awayTeamData.flag} alt={match.away_team_name} className="w-16 h-12 object-contain mb-2" />}
            <span className="text-xl font-bold">{match.away_team_name}</span>
          </div>
        </div>

        <p className="text-sm font-medium uppercase text-gray-400">
          {isFinished ? 'FINALIZADO' : isLive ? 'EN VIVO' : 'PRÓXIMO PARTIDO'}
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

      <div className="mt-10 pt-6 border-t border-gray-700 flex justify-between text-sm">
        <span>DT Home: {homeCoach}</span>
        <span>DT Away: {awayCoach}</span>
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
        <p className="text-sm">{player.name}</p>
        <p className="text-[10px] text-gray-500 uppercase">{player.pos}</p>
      </div>
    </div>
  );
}