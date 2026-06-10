import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatchStore } from "./store/useMatchStore";
import LineupComponent from './LineupComponent';

export default function MatchDetail({ matches }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const { match: matchStore, setInitialData } = useMatchStore();
  const match = matches.find(m => m._id === id);

  // Verificamos si ya hay datos cargados en el store
  // --- CORRECCIÓN EN MATCHDETAIL.JSX ---
// En lugar de verificar solo titulares_home, verificamos si matchStore tiene datos de cualquiera de los dos.
const isDataLoaded = matchStore?.titulares_home?.length > 0 || matchStore?.titulares_away?.length > 0;

// OJO: Si al poner esto sigue sin mostrarse, prueba comentando el if(loading) 
// y renderiza siempre el LineupComponent para ver si el error es el componente mismo.
  const loading = !isDataLoaded;

  const loadAll = useCallback(async () => {
    if (!match) return;
    
    try {
      const fetchSquad = async (teamId) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/players/${teamId}`);
        const rawData = await response.json();
        
        // Normalización: aseguramos que 'data' siempre sea un objeto
        const data = Array.isArray(rawData) ? rawData[0] : rawData;
        
        // Extraemos el 'squad' de forma segura
        const players = data?.squad || [];
        
        console.log(`Jugadores procesados para equipo ${teamId}:`, players);
        
        return Array.isArray(players) 
          ? players.sort((a, b) => a.jersey_number - b.jersey_number) 
          : [];
      };

      const [homePlayers, awayPlayers] = await Promise.all([
        fetchSquad(match.home_team_id),
        fetchSquad(match.away_team_id)
      ]);

      setInitialData(homePlayers, true);
      setInitialData(awayPlayers, false);
      
    } catch (error) {
      console.error("Error crítico en la carga:", error);
    }
  }, [match, setInitialData]);

  // --- ESTE ES EL BLOQUE QUE HABÍAS BORRADO ---
  useEffect(() => {
    if (match && !isDataLoaded) {
      loadAll();
    }
  }, [match, isDataLoaded, loadAll]);
  // --------------------------------------------

  if (!match) {
    return <div className="text-white p-10 text-center">Partido no encontrado</div>;
  }

// ... resto del código

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 md:p-12">
      <button onClick={() => navigate('/')}>← Volver</button>
      
      <div className="text-yellow-500">
        Titulares Home cargados: {matchStore?.titulares_home?.length || 0}
      </div>

      {loading ? (
        <div className="text-center p-10 text-gray-500">Cargando alineaciones...</div>
      ) : (
        <LineupComponent 
          homePlayers={matchStore.titulares_home || []} 
          awayPlayers={matchStore.titulares_away || []} 

          homeBench={matchStore.banca_home || []}
          awayBench={matchStore.banca_away || []}
          match={match}
        />
      )}
    </div>
  );
}