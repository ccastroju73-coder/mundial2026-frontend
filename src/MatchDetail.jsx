import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatchStore } from "./store/useMatchStore";
import LineupComponent from './LineupView';
import { teams } from './teamsData';

export default function MatchDetail({ matches }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const { match: matchStore, setInitialData, resetStore } = useMatchStore();
  
  const match = matches.find(m => m._id === id || m.id === id);

  // Mantenemos la lógica de carga
  const loadAll = useCallback(async (targetMatch) => {
    if (!targetMatch) return;
    try {
      const fetchSquad = async (teamId) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/players/${teamId}`);
        const rawData = await response.json();
        const data = Array.isArray(rawData) ? rawData[0] : rawData;
        const players = data?.squad || [];
        return Array.isArray(players) ? players.sort((a, b) => a.jersey_number - b.jersey_number) : [];
      };

      const [homePlayers, awayPlayers] = await Promise.all([
        fetchSquad(targetMatch.home_team_id),
        fetchSquad(targetMatch.away_team_id)
      ]);

      setInitialData(homePlayers, true);
      setInitialData(awayPlayers, false);
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    }
  }, [setInitialData]);

  // useEffect con intervalo para refresco automático
  useEffect(() => {
    if (match) {
      // Carga inicial
      resetStore();
      loadAll(match);

      // Intervalo de 30 segundos (30000ms)
      const interval = setInterval(() => {
        loadAll(match);
      }, 30000);

      return () => clearInterval(interval); // Limpieza al desmontar
    }
  }, [id, match, resetStore, loadAll]);

  const isDataLoaded = matchStore?.titulares_home?.length > 0 || matchStore?.titulares_away?.length > 0;
  const loading = !isDataLoaded;

  if (!match) return <div className="text-white p-10 text-center">Partido no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 md:p-12">
      <button onClick={() => navigate('/')}>← Volver</button>
      {loading ? (
        <div className="text-center p-10 text-gray-500">Cargando datos del partido...</div>
      ) : (
        <LineupComponent 
          homePlayers={matchStore.titulares_home || []} 
          awayPlayers={matchStore.titulares_away || []}
          homeBench={matchStore.banca_home || []}
          awayBench={matchStore.banca_away || []}
          match={match}
          teams={teams}
          stats={[
             { label: "Posesión", home: match.stats?.possession_home || 50, away: match.stats?.possession_away || 50 },
             { label: "Remates", home: match.stats?.shots_home || 0, away: match.stats?.shots_away || 0 }
          ]}
        />
      )}
    </div>
  );
}