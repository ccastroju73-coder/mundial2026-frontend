import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatchStore } from "./store/useMatchStore";
import LineupComponent from './LineupComponent';

export default function MatchDetail({ matches }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const { match: matchStore, setInitialData } = useMatchStore();
  const match = matches.find(m => m._id === id);

  const isDataLoaded = matchStore?.titulares_home?.length > 0 || matchStore?.titulares_away?.length > 0;
  const loading = !isDataLoaded;

  const loadAll = useCallback(async () => {
    if (!match) return;
    try {
      const fetchSquad = async (teamId) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/players/${teamId}`);
        const rawData = await response.json();
        const data = Array.isArray(rawData) ? rawData[0] : rawData;
        const players = data?.squad || [];
        return Array.isArray(players) ? players.sort((a, b) => a.jersey_number - b.jersey_number) : [];
      };

      const [homePlayers, awayPlayers] = await Promise.all([
        fetchSquad(match.home_team_id),
        fetchSquad(match.away_team_id)
      ]);

      setInitialData(homePlayers, true);
      setInitialData(awayPlayers, false);
    } catch (error) {
      console.error("Error crítico:", error);
    }
  }, [match, setInitialData]);

  useEffect(() => {
    if (match && !isDataLoaded) loadAll();
  }, [match, isDataLoaded, loadAll]);

  if (!match) return <div className="text-white p-10 text-center">Partido no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 md:p-12">
      <button onClick={() => navigate('/')}>← Volver</button>
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