import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teams } from './teamsData';
import { coaches } from './coaches';

export default function MatchDetail({ matches }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [homeSquad, setHomeSquad] = useState([]);
  const [awaySquad, setAwaySquad] = useState([]);
  const [loading, setLoading] = useState(true);

  const match = matches.find(m => m._id === id);

  useEffect(() => {
    if (match) {
      const fetchSquad = async (teamId, setter) => {
        try {
          // --- AQUÍ ESTÁ EL CAMBIO ---
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/players/${teamId}`);
          const data = await response.json();
          
          if (Array.isArray(data)) {
            const sortedSquad = [...data].sort((a, b) => a.jersey_number - b.jersey_number);
            setter(sortedSquad);
          }
        } catch (error) {
          console.error("Error al cargar jugadores:", error);
        }
      };

      const loadAll = async () => {
        setLoading(true);
        await Promise.all([
          fetchSquad(match.home_team_id, setHomeSquad),
          fetchSquad(match.away_team_id, setAwaySquad)
        ]);
        setLoading(false);
      };

      loadAll();
    }
  }, [match]);

  // ... resto de tu código (sin cambios)
  if (!match) return <div className="text-white p-10">Partido no encontrado</div>;

  const home = teams[match.home_team_id];
  const away = teams[match.away_team_id];

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 md:p-12">
      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-8">← Volver</button>

      <div className="flex flex-col items-center justify-center mb-12">
        <div className="flex items-center gap-8 md:gap-20">
          <div className="text-center"><img src={home?.flag} className="w-20 md:w-32 mb-4" alt={home?.name} /> <h2 className="text-xl font-bold">{home?.name}</h2></div>
          <div className="text-5xl md:text-8xl font-black">{match.home_score} - {match.away_score}</div>
          <div className="text-center"><img src={away?.flag} className="w-20 md:w-32 mb-4" alt={away?.name} /> <h2 className="text-xl font-bold">{away?.name}</h2></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
         {loading ? (
          <div className="col-span-2 text-center p-10 text-gray-500">Cargando alineaciones...</div>
        ) : (
          <>
            <SquadList title={`Alineación ${home?.name}`} players={homeSquad} teamId={match.home_team_id} />
            <SquadList title={`Alineación ${away?.name}`} players={awaySquad} teamId={match.away_team_id} />
          </>
        )}
      </div>
    </div>
  );
}

// SquadList (sin cambios, ya tiene la key correcta)
function SquadList({ title, players, teamId }) {
  const safePlayers = Array.isArray(players) ? players : [];
  const startingEleven = safePlayers.slice(0, 11);
  const coachName = coaches[teamId] || "Técnico no asignado";

  return (
    <div className="bg-[#1a1d23] p-6 rounded-3xl border border-white/10 shadow-xl">
      <h3 className="text-gray-400 uppercase text-xs tracking-widest mb-6 font-semibold">{title}</h3>
      <div className="flex items-center gap-4 mb-8 p-3 bg-white/5 rounded-2xl">
        <div className="w-10 h-10 bg-green-500/20 flex items-center justify-center rounded-full text-green-500 text-lg">👨‍💼</div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Director Técnico</p>
          <p className="text-white font-medium">{coachName}</p>
        </div>
      </div>
      <div className="space-y-3">
        {startingEleven.length > 0 ? (
          startingEleven.map(p => (
            <div key={p._id || p.jersey_number} className="flex items-center gap-4 p-2 hover:bg-white/5 rounded-xl transition-colors">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg text-white font-black text-sm border border-white/5">
                {p.jersey_number}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{p.name}</p>
                <p className="text-green-500 text-[10px] uppercase font-bold">{p.pos}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">Sin jugadores registrados.</p>
        )}
      </div>
    </div>
  );
}