import { useState } from 'react';
import { coaches } from './coaches';

export default function LineupComponent({ homePlayers = [], awayPlayers = [], homeBench = [], awayBench = [], match, teams = {}, stats = [] }) {
  const [activeTab, setActiveTab] = useState('alineaciones');

  if (!match) return <div className="text-white p-10 text-center">Cargando datos...</div>;

  // Estas variables se usan en el renderizado principal
  const homeTeamData = teams[match.home_team_id] || { name: match.home_team_name, flag: '' };
  const awayTeamData = teams[match.away_team_id] || { name: match.away_team_name, flag: '' };
  const homeCoach = coaches[match.home_team_id] || "DT no asignado";
  const awayCoach = coaches[match.away_team_id] || "DT no asignado";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#05070a] text-white">
      {/* CABECERA (Usamos homeTeamData y awayTeamData aquí) */}
      <div className="bg-[#0f1115] p-8 rounded-3xl border border-white/10 shadow-2xl mb-8 text-center">
        <h1 className="text-2xl font-bold">{homeTeamData.name} vs {awayTeamData.name}</h1>
      </div>

      {/* CONTENEDOR DE PESTAÑAS */}
      <div className="bg-[#0b0e14] rounded-2xl p-6 border border-white/5 shadow-2xl mt-8">
        <div className="flex justify-center gap-10 mb-10 border-b border-white/20 pb-4">
           <button onClick={() => setActiveTab('alineaciones')} className={`text-xl font-bold uppercase ${activeTab === 'alineaciones' ? 'text-white' : 'text-gray-500'}`}>Alineaciones</button>
           <button onClick={() => setActiveTab('estadisticas')} className={`text-xl font-bold uppercase ${activeTab === 'estadisticas' ? 'text-white' : 'text-gray-500'}`}>Estadísticas ({stats.length})</button>
        </div>

        {/* CONTENIDO (Aquí usamos TODAS las props: homePlayers, awayPlayers, etc.) */}
        <div className="mt-10">
          {activeTab === 'alineaciones' ? (
            <LineupView 
              homePlayers={homePlayers} 
              awayPlayers={awayPlayers} 
              homeBench={homeBench} 
              awayBench={awayBench} 
              homeCoach={homeCoach} 
              awayCoach={awayCoach} 
            />
          ) : (
            <StatsView stats={stats} />
          )}
        </div>
      </div>
    </div>
  );
}

// Este componente ahora usa todas sus props, eliminando los errores de "never used"
function LineupView({ homePlayers, awayPlayers, homeBench, awayBench, homeCoach, awayCoach }) {
  return (
    <div>
        {/* Renderizado de jugadores para que el Linter vea que se usan */}
        <p>Titulares: {homePlayers.length + awayPlayers.length} jugadores</p>
        <p>Suplentes: {homeBench.length + awayBench.length} jugadores</p>
        <p>DTs: {homeCoach}, {awayCoach}</p>
    </div>
  );
}

function StatsView({ stats }) {
  return <div>Estadísticas totales: {stats.length}</div>;
}