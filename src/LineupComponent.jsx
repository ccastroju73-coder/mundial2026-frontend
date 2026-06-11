import { coaches } from './coaches';

export default function LineupComponent({ homePlayers = [], awayPlayers = [], homeBench = [], awayBench = [], match, teams = [] }) {
  if (!match) return <div className="text-white p-10 text-center">Cargando datos del encuentro...</div>;

  // 1. Aseguramos que teams siempre sea un array, incluso si llega nulo
 // const safeTeams = Array.isArray(teams) ? teams : [];

  // 2. Buscamos el equipo con seguridad
// En lugar de safeTeams.find(...)
// Accedemos directamente a la propiedad del objeto usando el ID
const homeTeamData = teams[match.home_team_id] || { name: match.home_team_name, flag: '' };
const awayTeamData = teams[match.away_team_id] || { name: match.away_team_name, flag: '' };

// En tu JSX:
<span className="text-xl font-bold">{homeTeamData.name || homeTeamData.name_en}</span>
{homeTeamData.flag ? (
    <img src={homeTeamData.flag} alt="Bandera" className="w-16 h-12 object-contain mb-2" />
) : (
    <div className="w-16 h-12 bg-gray-800 flex items-center justify-center text-[10px]">Sin Bandera</div>
)}
  const homeCoach = coaches[match.home_team_id] || "DT no asignado";
  const awayCoach = coaches[match.away_team_id] || "DT no asignado";

  // Lógica de estado
  const isFinished = String(match.finished).toUpperCase() === "TRUE" || match.time_elapsed === "finished";
  const isLive = match.time_elapsed !== "notstarted" && !isFinished;
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#1a1c21] text-white rounded-lg">
      <div className="text-center border-b border-gray-700 pb-6 mb-8">
        <div className="flex justify-center items-center gap-12 mb-6">
  
          {/* Equipo Local */}
          <div className="flex flex-col items-center">
             {homeTeamData.flag ? (
               <img src={homeTeamData.flag} alt={homeTeamData.name_en} className="w-16 h-12 object-contain mb-2" />
             ) : (
               <div className="w-16 h-12 bg-gray-800 rounded mb-2 flex items-center justify-center text-[10px]">Sin Bandera</div>
             )}
             <span className="text-xl font-bold">{homeTeamData.name_en}</span>
          </div>

          {/* Marcador Central */}
          <div className="text-4xl font-black">
             <span>{match.home_score ?? 0} - {match.away_score ?? 0}</span>
          </div>

          {/* Equipo Visitante */}
          <div className="flex flex-col items-center">
             {awayTeamData.flag ? (
                <img src={awayTeamData.flag} alt={awayTeamData.name_en} className="w-16 h-12 object-contain mb-2" />
             ) : (
                <div className="w-16 h-12 bg-gray-800 rounded mb-2 flex items-center justify-center text-[10px]">Sin Bandera</div>
             )}
             <span className="text-xl font-bold">{awayTeamData.name_en}</span>
          </div>
        </div>

        <p className="text-sm font-medium uppercase text-gray-400">
          {isFinished ? 'FINALIZADO' : isLive ? 'EN VIVO' : 'PRÓXIMO PARTIDO'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {match.local_date}
        </p>
      </div>
      
      {/* Alineaciones */}
      <h2 className="text-lg font-bold mb-4 uppercase text-gray-400">Formación Inicial</h2>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          {homePlayers.map((p, i) => <PlayerRow key={i} player={p} />)}
        </div>
        <div className="space-y-2">
          {awayPlayers.map((p, i) => <PlayerRow key={i} player={p} reverse />)}
        </div>
      </div>

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