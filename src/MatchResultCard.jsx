import { Link } from 'react-router-dom';

export default function MatchResultCard({ match }) {
  // Determinamos el estado para el indicador
  const isFinished = String(match.finished).toUpperCase() === "TRUE";
  const isLive = match.time_elapsed !== "notstarted" && !isFinished;
  
  // Definimos colores según el estado
  const statusColor = isFinished ? "border-gray-500" : (isLive ? "border-red-500" : "border-green-500");
  const statusText = isFinished ? "Finalizado" : (isLive ? "En Vivo" : "Programado");

  return (
    <Link to={`/partido/${match.id}`} className="block">
    <div className={`bg-[#0b0e14] p-6 rounded-2xl border-t-4 ${statusColor} border-white/5 shadow-xl transition-transform hover:scale-[1.02]`}>
      
      {/* Etiqueta de estado pequeña arriba */}
      <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isFinished ? "text-gray-500" : (isLive ? "text-red-500" : "text-green-500")}`}>
        {statusText}
      </div>

      <h3 className="text-white font-bold text-center mb-6">
        {match.home_team_name} vs {match.away_team_name}
      </h3>

      <div className="flex justify-between items-center px-4">
        <div className="flex flex-col items-center">
          <img src={match.home_flag} className="w-16 h-10 object-cover rounded shadow-md" alt="Home" />
          <span className="text-xs mt-2 font-medium">{match.home_team_name}</span>
        </div>
        
        {/* Marcador simplificado */}
        <div className="flex flex-col items-center">
           <span className="text-2xl font-black">{match.home_score} - {match.away_score}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <img src={match.away_flag} className="w-16 h-10 object-cover rounded shadow-md" alt="Away" />
          <span className="text-xs mt-2 font-medium">{match.away_team_name}</span>
        </div>
      </div>

      <div className="text-gray-500 text-xs text-center mt-6 border-t border-white/5 pt-4">
        {match.local_date}
      </div>
    </div>
   </Link>
  );
}