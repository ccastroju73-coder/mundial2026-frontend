import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import { teams } from './teamsData';
import { useMatchStore } from "./store/useMatchStore";
// Importamos el nuevo componente
import LineupComponent from './LineupComponent'; 

export default function MatchDetail({ matches }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const { match: matchStore, setInitialData } = useMatchStore();
  const match = matches.find(m => m._id === id);

  const isDataLoaded = matchStore?.titulares_home && matchStore.titulares_home.length > 0;
  const loading = !isDataLoaded;

  const loadAll = useCallback(async () => {
    if (!match) return;
    try {
      const fetchSquad = async (teamId) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/players/${teamId}`);
        const data = await response.json();
        return Array.isArray(data) ? data.sort((a, b) => a.jersey_number - b.jersey_number) : [];
      };

      const [homePlayers, awayPlayers] = await Promise.all([
        fetchSquad(match.home_team_id),
        fetchSquad(match.away_team_id)
      ]);

      setInitialData(homePlayers, true);
      setInitialData(awayPlayers, false);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  }, [match, setInitialData]);

  useEffect(() => {
    if (match && !isDataLoaded) {
      loadAll();
    }
  }, [match, isDataLoaded, loadAll]);

  if (!match) return <div className="text-white p-10">Partido no encontrado</div>;

  // Si decides usar estas variables para mostrar el nombre del equipo, 
  // simplemente descoméntalas o úsalas en el return.
  // const home = teams[match.home_team_id];
  // const away = teams[match.away_team_id];

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 md:p-12">
      <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-8">
        ← Volver a Inicio
      </button>

       // En el return de MatchDetail.jsx
       {loading ? (
          <div className="text-center p-10 text-gray-500">Cargando...</div>
        ) : (
          (() => {
            console.log("Cargando LineupComponent con:", matchStore.titulares_home);
            return <LineupComponent 
                    homePlayers={matchStore.titulares_home || []} 
                    awayPlayers={matchStore.titulares_away || []} 
                  />;
          })()
     )}
    </div>
  );
}