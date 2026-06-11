import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { coaches } from './coaches';

// --- COMPONENTE PRINCIPAL ---
// Cambiamos 'match' por 'initialMatch' en los props para evitar conflictos
export default function LineupComponent({ matches = [], homePlayers = [], awayPlayers = [], homeBench = [], awayBench = [], initialMatch = null, teams = {}, stats = [] }) {
  const { id } = useParams();
  
  // Buscamos el partido en la lista global 'matches' usando el id de la URL
  const selectedMatch = matches.find(m => String(m.id) === String(id)) || initialMatch;
  const [activeTab, setActiveTab] = useState('alineaciones');

  if (!selectedMatch) return <div className="text-white p-10 text-center">Cargando datos...</div>;

  const homeTeamData = teams[selectedMatch.home_team_id] || { name: selectedMatch.home_team_name, flag: '' };
  const awayTeamData = teams[selectedMatch.away_team_id] || { name: selectedMatch.away_team_name, flag: '' };
  const homeCoach = coaches[selectedMatch.home_team_id] || "DT no asignado";
  const awayCoach = coaches[selectedMatch.away_team_id] || "DT no asignado";

  // Usamos los datos del partido seleccionado, o los que vienen por defecto
  const displayHomePlayers = selectedMatch.home_players || homePlayers;
  const displayAwayPlayers = selectedMatch.away_players || awayPlayers;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#05070a] text-white">
      <div className="bg-[#0f1115] p-8 rounded-3xl border border-white/10 shadow-2xl mb-8 text-center">
        <h1 className="text-2xl font-bold">{homeTeamData.name} vs {awayTeamData.name}</h1>
      </div>

      <div className="bg-[#0b0e14] rounded-2xl p-6 border border-white/5 shadow-2xl mt-8">
        <div className="flex justify-center gap-10 mb-10 border-b border-white/20 pb-4">
           <button onClick={() => setActiveTab('alineaciones')} className={`text-xl font-bold uppercase ${activeTab === 'alineaciones' ? 'text-white border-b-2' : 'text-gray-500'}`}>Alineaciones</button>
           <button onClick={() => setActiveTab('estadisticas')} className={`text-xl font-bold uppercase ${activeTab === 'estadisticas' ? 'text-white border-b-2' : 'text-gray-500'}`}>Estadísticas</button>
        </div>

        <div className="mt-10">
          {activeTab === 'alineaciones' ? (
            <LineupView 
              homePlayers={displayHomePlayers} 
              awayPlayers={displayAwayPlayers} 
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

// --- VISTAS AUXILIARES ---
function LineupView({ homePlayers, awayPlayers, homeBench, awayBench, homeCoach, awayCoach }) {
  return (
    <>
      <h2 className="text-white text-center text-sm font-bold tracking-widest uppercase mb-6">Formación Inicial</h2>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        <div className="space-y-1">
          {homePlayers.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg">
              <span className="w-7 h-7 flex items-center justify-center bg-[#1e2329] rounded-full text-xs font-bold text-white shadow-md">{p.jersey_number}</span>
              <span className="text-sm text-gray-200">{p.name}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {awayPlayers.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-2 justify-end hover:bg-white/5 rounded-lg">
              <span className="text-sm text-gray-200">{p.name}</span>
              <span className="w-7 h-7 flex items-center justify-center bg-[#1e2329] rounded-full text-xs font-bold text-white shadow-md">{p.jersey_number}</span>
            </div>
          ))}
        </div>
      </div>
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

function StatsView({ stats }) {
  return (
    <div className="space-y-6">
      {stats.length > 0 ? stats.map((s, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1 font-bold">
            <span className="text-white">{s.home}</span>
            <span className="text-gray-400 uppercase text-xs">{s.label}</span>
            <span className="text-white">{s.away}</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full flex overflow-hidden">
            <div style={{ width: `${(s.home / (s.home + s.away || 1)) * 100}%` }} className="bg-blue-500 h-full"></div>
            <div style={{ width: `${(s.away / (s.home + s.away || 1)) * 100}%` }} className="bg-red-500 h-full"></div>
          </div>
        </div>
      )) : <p className="text-center text-gray-500">No hay estadísticas disponibles</p>}
    </div>
  );
}