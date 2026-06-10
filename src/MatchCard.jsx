import Countdown from './Countdown';

export default function MatchCard({ match, home, away, isLive, isFinished }) {
  return (
    <div className={`bg-[#111827] border rounded-2xl p-4 shadow-xl transition-all ${isLive ? 'border-green-500' : 'border-gray-800'}`}>
      
      {/* Título del partido (Siempre visible) */}
      <h3 className="text-green-500 font-semibold text-center mb-4 text-sm">
        {home?.name} vs {away?.name}
      </h3>

      {/* Cuerpo central: Banderas, Nombres y Marcador */}
      <div className="flex justify-between items-center mb-4">
        {/* Equipo Local */}
        <div className="flex flex-col items-center w-5/12">
          <img src={home?.flag} className="w-10 h-6 object-cover rounded-sm mb-1" alt={home?.name} />
          <span className="text-white text-[11px] font-medium truncate">{home?.name}</span>
          {(isLive || isFinished) && (
            <span className="text-white font-bold text-lg mt-1">{match.home_score}</span>
          )}
        </div>
        
        {/* VS o Marcador central */}
        <span className="text-gray-600 text-xs font-bold w-2/12 text-center">
          {isLive || isFinished ? "-" : "VS"}
        </span>
        
        {/* Equipo Visitante */}
        <div className="flex flex-col items-center w-5/12">
          <img src={away?.flag} className="w-10 h-6 object-cover rounded-sm mb-1" alt={away?.name} />
          <span className="text-white text-[11px] font-medium truncate">{away?.name}</span>
          {(isLive || isFinished) && (
            <span className="text-white font-bold text-lg mt-1">{match.away_score}</span>
          )}
        </div>
      </div>

      {/* Footer: Estado Dinámico */}
      <div className="border-t border-gray-800 pt-2 text-center">
        {!isFinished && !isLive && (
          <div className="text-center">
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Inicia en:</p>
            <div className="text-green-400 font-mono font-bold text-xs">
              <Countdown targetDate={match.local_date} />
            </div>
          </div>
        )}
        
        {isLive && (
          <p className="text-red-500 text-xs font-bold animate-pulse uppercase">● En Vivo - {match.time_elapsed}'</p>
        )}
        
        {isFinished && (
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Finalizado</p>
        )}
      </div>
    </div>
  );
}