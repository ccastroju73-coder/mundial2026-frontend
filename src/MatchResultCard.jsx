import { teams } from './teamsData'; // Asegúrate de importar tu fuente de datos

export default function MatchResultCard({ match }) {
  // Buscamos los datos de los equipos usando los IDs de tu base de datos
  const homeTeam = teams[match.home_team_id] || { name: "Home", flag: "" };
  const awayTeam = teams[match.away_team_id] || { name: "Away", flag: "" };

  const isFinished = String(match.finished).toUpperCase() === "TRUE";
  const isLive = match.time_elapsed !== "notstarted" && !isFinished;
  const statusColor = isFinished ? "border-gray-500" : (isLive ? "border-red-500" : "border-green-500");
  const statusText = isFinished ? "Finalizado" : (isLive ? "En Vivo" : "Programado");

  return (
    <div className={`bg-[#0b0e14] p-6 rounded-2xl border-t-4 ${statusColor} border-white/5 shadow-xl`}>
      <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isFinished ? "text-gray-500" : (isLive ? "text-red-500" : "text-green-500")}`}>
        {statusText}
      </div>

      <div className="flex justify-between items-center px-2">
        {/* Equipo Local */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <img src={homeTeam.flag} className="w-12 h-8 object-cover rounded shadow-md" alt={homeTeam.name} />
          <span className="text-sm font-bold text-center">{homeTeam.name}</span>
        </div>
        
        {/* Marcador */}
        <div className="px-4 text-xl font-black font-mono">
          {match.home_score} - {match.away_score}
        </div>
        
        {/* Equipo Visitante */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <img src={awayTeam.flag} className="w-12 h-8 object-cover rounded shadow-md" alt={awayTeam.name} />
          <span className="text-sm font-bold text-center">{awayTeam.name}</span>
        </div>
      </div>

      <div className="text-gray-500 text-xs text-center mt-6 border-t border-white/5 pt-4">
        {match.local_date}
      </div>
    </div>
  );
}