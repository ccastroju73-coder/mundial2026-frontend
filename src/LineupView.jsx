import { useState } from 'react';
import { coaches } from './coaches';

export default function LineupComponent({ homePlayers = [], awayPlayers = [], homeBench = [], awayBench = [], match, teams = {}, stats = [] }) {
  // 1. ESTADO PARA CONTROLAR LAS PESTAÑAS
  const [activeTab, setActiveTab] = useState('alineaciones');

  if (!match) return <div className="text-white p-10 text-center">Cargando datos...</div>;

  const homeTeamData = teams[match.home_team_id] || { name: match.home_team_name, flag: '' };
  const awayTeamData = teams[match.away_team_id] || { name: match.away_team_name, flag: '' };
  const homeCoach = coaches[match.home_team_id] || "DT no asignado";
  const awayCoach = coaches[match.away_team_id] || "DT no asignado";
  const isFinished = String(match.finished).toUpperCase() === "TRUE" || match.time_elapsed === "finished";
  const isLive = match.time_elapsed !== "notstarted" && !isFinished;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#05070a] text-white">
      
      {/* CABECERA FIJA */}
      <div className="bg-[#0f1115] p-8 rounded-3xl border border-white/10 shadow-2xl mb-8 text-center">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col items-center gap-2 flex-1">
            <img src={homeTeamData.flag} className="w-20 h-14 object-cover rounded-md shadow-lg" />
            <span className="text-xl font-bold">{homeTeamData.name || homeTeamData.name_en}</span>
          </div>
          <div className="text-5xl font-black font-mono px-6">{match.home_score ?? 0} - {match.away_score ?? 0}</div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <img src={awayTeamData.flag} className="w-20 h-14 object-cover rounded-md shadow-lg" />
            <span className="text-xl font-bold">{awayTeamData.name || awayTeamData.name_en}</span>
          </div>
        </div>
        <p className="text-sm font-bold uppercase text-[#22c55e]">{isFinished ? 'FINALIZADO' : isLive ? 'EN VIVO' : 'PRÓXIMO PARTIDO'}</p>
      </div>

      {/* CONTENEDOR DE PESTAÑAS */}
      <div className="bg-[#0b0e14] rounded-2xl p-6 border border-white/5 shadow-2xl">
        
        {/* LOS BOTONES VAN AQUÍ */}
        <div className="flex justify-center gap-10 mb-8 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab('alineaciones')} 
            className={`text-lg font-bold uppercase ${activeTab === 'alineaciones' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
          >
            Alineaciones
          </button>
          <button 
            onClick={() => setActiveTab('estadisticas')} 
            className={`text-lg font-bold uppercase ${activeTab === 'estadisticas' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
          >
            Estadísticas
          </button>
        </div>

        {/* CONTENIDO DINÁMICO */}
        {activeTab === 'alineaciones' ? (
        <LineupView 
              homePlayers={homePlayers} 
              awayPlayers={awayPlayers} 
              homeBench={homeBench} 
              awayBench={awayBench} 
              homeCoach={homeCoach}   // <--- Añade esto
              awayCoach={awayCoach}  // <--- Añade esto
        />
      ) : (
             <StatsView stats={stats} />
    )}
      </div>
    </div>
  );
}

// COMPONENTE DE ALINEACIONES
function LineupView({ homePlayers, awayPlayers, homeBench, awayBench, homeCoach, awayCoach }) {
  return (
    <>
      <h2 className="text-white text-center text-sm font-bold tracking-widest uppercase mb-6">Formación Inicial</h2>
      
      {/* Contenedor principal del grid */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {/* Jugadores Locales */}
        <div className="space-y-1">
          {homePlayers.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
              <span className="w-7 h-7 flex items-center justify-center bg-[#1e2329] rounded-full text-xs font-bold text-white shadow-md">
                {p.jersey_number}
              </span>
              <span className="text-sm text-gray-200 font-medium">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Jugadores Visitantes */}
        <div className="space-y-1">
          {awayPlayers.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-2 justify-end hover:bg-white/5 rounded-lg transition-colors">
              <span className="text-sm text-gray-200 font-medium">{p.name}</span>
              <span className="w-7 h-7 flex items-center justify-center bg-[#1e2329] rounded-full text-xs font-bold text-white shadow-md">
                {p.jersey_number}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Suplentes (diseño consistente) */}
      <div className="grid grid-cols-2 gap-6 mt-8 mb-6">
        <div className="bg-[#0f1115] rounded-xl p-4 border border-white/5">
          <h3 className="text-center text-xs font-bold uppercase text-gray-400 mb-3">Suplentes</h3>
          {homeBench.map(p => <div key={p.id} className="text-sm py-1 text-gray-300">{p.name}</div>)}
        </div>
        <div className="bg-[#0f1115] rounded-xl p-4 border border-white/5">
          <h3 className="text-center text-xs font-bold uppercase text-gray-400 mb-3">Suplentes</h3>
          {awayBench.map(p => <div key={p.id} className="text-sm py-1 text-gray-300 text-right">{p.name}</div>)}
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 flex justify-between text-xs uppercase text-gray-500">
        <span>DT Local: {homeCoach}</span>
        <span>DT Visitante: {awayCoach}</span>
      </div>
    </>
  );
}

// COMPONENTE DE ESTADÍSTICAS
function StatsView({ stats }) {
  return (
    <div className="space-y-6">
      {stats.length > 0 ? stats.map((s, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1 font-bold"><span>{s.home}</span><span className="text-gray-400">{s.label}</span><span>{s.away}</span></div>
          <div className="h-2 bg-gray-800 rounded-full flex overflow-hidden">
            <div style={{ width: `${(s.home / (s.home + s.away)) * 100}%` }} className="bg-blue-500 h-full"></div>
            <div style={{ width: `${(s.away / (s.home + s.away)) * 100}%` }} className="bg-red-500 h-full"></div>
          </div>
        </div>
      )) : <p className="text-center text-gray-500">No hay estadísticas disponibles</p>}
    </div>
  );
}