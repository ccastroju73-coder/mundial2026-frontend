import MatchCard from './MatchCard';
import TablaPosiciones from './TablaPosiciones';
import { teams } from './teamsData';
import LogoMundial from './assets/LogoMundial.svg';
import LogoOficial from './assets/Logooficial.svg';
import { Link } from 'react-router-dom';

export default function Home({ matches }) {
  if (!matches || matches.length === 0) {
    return <div className="p-10 text-center text-white">Esperando conexión con la API...</div>;
  }

  const today = new Date();
  const todayString = today.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Lógica de filtrado
  let displayMatches = matches.filter(m => m.local_date?.includes(todayString));
  let messageTitle = "Jornada del";
  let messageDate = todayString;

  if (displayMatches.length === 0) {
    const sorted = [...matches].sort((a, b) => new Date(a.local_date) - new Date(b.local_date));
    const nextMatch = sorted.find(m => new Date(m.local_date) > today);
    
    if (nextMatch) {
      const nextDate = nextMatch.local_date.split(' ')[0];
      displayMatches = matches.filter(m => m.local_date.includes(nextDate));
      messageDate = nextDate;
    } else {
      messageTitle = "No hay partidos programados";
      messageDate = "";
    }
  }

  const uniqueGroups = [...new Set(displayMatches.map(m => m.group))];
  const isBusyDay = displayMatches.length > 2;
  const gamesSpan = isBusyDay ? 'lg:col-span-3' : 'lg:col-span-2';
  const tablesSpan = isBusyDay ? 'lg:col-span-2' : 'lg:col-span-3';

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
  {/* HEADER CON IMÁGENES INTEGRADO */}
<header className="relative py-16 flex flex-col items-center text-center overflow-hidden px-4">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent pointer-events-none" />
  
  {/* Fila 1: Fechas */}
  <p className="text-green-500/80 text-[10px] tracking-[0.3em] uppercase font-bold mb-6">
    11 de junio - 19 de julio de 2026
  </p>

{/* TÍTULO CON IMÁGENES A LOS LADOS */}
<div className="flex items-center justify-center gap-6 md:gap-10 mb-6">
  {/* Asegúrate de que los archivos estén en la carpeta /public */}
  <img 
    src={LogoMundial}
    alt="Emblema Mundial" 
    className="w-16 h-16 md:w-24 md:h-24 object-contain" 
    onError={(e) => { e.target.style.display = 'none'; }} 
  />
  
  <h1 className="text-center text-5xl md:text-7xl font-black text-white drop-shadow-2xl">
    Copa Mundial <br /> 
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
      FIFA 2026
    </span>
  </h1>
  
  <img 
    src={LogoOficial}
    alt="Trofeo Mundial" 
    className="w-16 h-16 md:w-24 md:h-24 object-contain" 
    onError={(e) => { e.target.style.display = 'none'; }} 
  />

</div>
  {/* Fila 3: Subtítulo */}
  <p className="text-gray-400 text-lg md:text-xl font-light max-w-xl leading-relaxed mb-8">
    El mayor evento deportivo del mundo: 48 selecciones, 104 partidos en EE. UU., Canadá y México.
  </p>

  {/* Fila 4: Badge */}
  <div className="group relative cursor-pointer">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-700 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
    <div className="relative bg-black px-6 py-2 rounded-full border border-green-500/20 shadow-xl">
      <span className="text-green-400 text-[11px] font-bold tracking-wider uppercase">
        {messageTitle} {messageDate}
      </span>
    </div>
  </div>
</header>

{/* CONTENIDO PRINCIPAL */}
      <div className="p-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          <div className={`${gamesSpan} grid grid-cols-1 gap-4`}>
            {displayMatches.map(match => (
              // <--- AQUÍ ESTÁ EL CAMBIO: Envolvemos el MatchCard en Link
              <Link 
                key={match._id} 
                to={`/partido/${match._id}`} 
                className="transition-transform hover:scale-[1.02] active:scale-[0.98] block"
              >
                <MatchCard 
                  match={match} 
                  isLive={match.status === 'live'}
                  isFinished={match.status === 'finished'}
                  home={teams[match.home_team_id]} 
                  away={teams[match.away_team_id]} 
                />
              </Link>
            ))}
          </div>
          
          <div className={`${tablesSpan} flex flex-col gap-4`}>
            {uniqueGroups.length > 0 ? (
              uniqueGroups.map(group => (
                <TablaPosiciones key={group} grupo={group} />
              ))
            ) : (
              <div className="text-gray-500 text-center">No hay tablas disponibles.</div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}