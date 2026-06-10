import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // navigate vuelve a estar activo
import { teams } from './teamsData';
import { coaches } from './coaches'; // coaches vuelve a estar activo
import { useMatchStore } from "./store/useMatchStore";
import SquadList from './SquadList'; 

export default function MatchDetail({ matches }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. RENOMBRAMOS lo que viene de Zustand a 'matchStore' para evitar confusión
  const { match: matchStore, setInitialData } = useMatchStore();
  
  // 2. Esta variable 'match' es la que buscas en el array de partidos (matches)
  const match = matches.find(m => m._id === id);

  // 3. Usamos 'matchStore' para verificar si los datos de alineación ya cargaron
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

      const [homeData, awayData] = await Promise.all([
        fetchSquad(match.home_team_id),
        fetchSquad(match.away_team_id)
      ]);

      setInitialData(homeData, awayData);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  }, [match, setInitialData]);

  useEffect(() => {
    // Si tenemos el partido pero los datos del store están vacíos, cargamos
    if (match && !isDataLoaded) {
      loadAll();
    }
  }, [match, isDataLoaded, loadAll]);

  if (!match) return <div className="text-white p-10">Partido no encontrado</div>;

  const home = teams[match.home_team_id];
  const away = teams[match.away_team_id];

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 md:p-12">
      <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-8">
        ← Volver a Inicio
      </button>

      {loading ? (
        <div className="text-center p-10 text-gray-500">Cargando alineaciones...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <SquadList 
            title={`Alineación ${home?.name}`} 
            players={matchStore?.titulares_home || []} 
            coachName={coaches[match.home_team_id]} 
          />
          <SquadList 
            title={`Alineación ${away?.name}`} 
            players={matchStore?.titulares_away || []} 
            coachName={coaches[match.away_team_id]} 
          />
        </div>
      )}
    </div>
  );
}