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
  const isDataLoaded = matchStore?.titulares_home && matchStore.titulares_home.length > 0;
  const loading = !isDataLoaded;

const loadAll = useCallback(async () => {
  if (!match) return;
  try {
    const fetchSquad = async (teamId) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/players/${teamId}`);
      const result = await response.json();
      
      // LA CORRECCIÓN: 
      // El API devuelve { "squad": [...] }, así que accedemos a result.squad
      // Si result es un array (como en la captura de South Africa), lo usamos, si no, buscamos .squad
      const players = Array.isArray(result) ? result[0]?.squad : (result.squad || []);
      
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
    console.error("Error al cargar:", error);
  }
}, [match, setInitialData]);

  useEffect(() => {
    if (match && !isDataLoaded) {
      loadAll();
    }
  }, [match, isDataLoaded, loadAll]);

  if (!match) {
    return <div className="text-white p-10 text-center">Partido no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 md:p-12">
      <button 
        onClick={() => navigate('/')} 
        className="text-gray-400 hover:text-white mb-8 transition-colors"
      >
        ← Volver a Inicio
      </button>

      {loading ? (
        <div className="text-center p-10 text-gray-500 animate-pulse">Cargando alineaciones...</div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <LineupComponent 
            homePlayers={matchStore.titulares_home || []} 
            awayPlayers={matchStore.titulares_away || []} 
          />
        </div>
      )}
    </div>
  );
}