import { coaches } from './coaches';

export default function LineupComponent({ homePlayers = [], awayPlayers = [], homeBench = [], awayBench = [], match, teams = {} }) {
  if (!match) return <div className="text-white p-10 text-center">Cargando datos...</div>;

  const homeTeamData = teams[match.home_team_id] || { name_en: match.home_team_name, flag: '' };
  const awayTeamData = teams[match.away_team_id] || { name_en: match.away_team_name, flag: '' };

  const homeCoach = coaches[match.home_team_id] || "DT no asignado";
  const awayCoach = coaches[match.away_team_id] || "DT no asignado";
  
  const isFinished = String(match.finished).toUpperCase() === "TRUE" || match.time_elapsed === "finished";
  const isLive = match.time_elapsed !== "notstarted" && !isFinished;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#05070a] text-white">
      
      {/* Cabecera con Marcador y Estado */}
      <div className="bg-[#0f1115] p-8 rounded-3xl border border-white/10 shadow-2xl mb-8 text-center">
        <div className="flex justify-between items-center mb-6">
          {/* Equipo Local */}
          <div className="flex flex-col items-center gap-4">
            <img src={homeTeamData.flag} className="w-20 h-14 object-cover rounded-md shadow-lg" />
            <span className="text-xl font-bold">{homeTeamData.name_en}</span>
          </div>

          <div className="text-5xl font-black text-white/90 font-mono">
            {match.home_score ?? 0} - {match.away_score ?? 0}
          </div>

          {/* Equipo Visitante */}
          <div className="flex flex-col items-center gap-4">
            <img src={awayTeamData.flag} className="w-20 h-14 object-cover rounded-md shadow-lg" />
            <span className="text-xl font-bold">{awayTeamData.name_en}</span>
          </div>
        </div>

        {/* Estado del partido */}
        <p className="text-sm font-bold uppercase tracking-widest text-[#22c55e]">
          {isFinished ? 'FINALIZADO' : isLive ? 'EN VIVO' : 'PRÓXIMO PARTIDO'}
        </p>
      </div>
      
      {/* Alineaciones */}
      <div className="bg-[#0b0e14] rounded-2xl p-6 border border-white/5 shadow-2xl mb-6">
        <h2 className="text-white text-center text-sm font-bold tracking-widest uppercase mb-6">Formación Inicial</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            {homePlayers.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg">
                <span className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-xs font-bold">{p.jersey_number}</span>
                <span className="text-sm text-gray-200">{p.name}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {awayPlayers.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2 justify-end hover:bg-white/5 rounded-lg">
                <span className="text-sm text-gray-200">{p.name}</span>
                <span className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-xs font-bold">{p.jersey_number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suplentes */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-[#0b0e14] rounded-2xl p-4 border border-white/5">
          <h3 className="text-white text-center text-sm font-bold uppercase mb-4">Suplentes</h3>
          {homeBench.map((p) => <div key={p.id} className="text-sm text-gray-300 py-1">{p.name}</div>)}
        </div>
        <div className="bg-[#0b0e14] rounded-2xl p-4 border border-white/5">
          <h3 className="text-white text-center text-sm font-bold uppercase mb-4">Suplentes</h3>
          {awayBench.map((p) => <div key={p.id} className="text-sm text-gray-300 py-1 text-right">{p.name}</div>)}
        </div>
      </div>

      {/* Pie de página */}
      <div className="mt-10 pt-6 border-t border-white/10 flex justify-between text-sm text-white font-medium uppercase">
          <span>DT Local: {homeCoach}</span>
          <span>DT Visitante: {awayCoach}</span>
      </div>
    </div>
  );
}