import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatchStore } from "./store/useMatchStore";
import LineupComponent from './LineupView';
import { teams } from './teamsData';

export default function MatchDetail({ matches }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Extraemos resetStore aquí
  const { match: matchStore, setInitialData, resetStore } = useMatchStore();
  
  // 2. Buscamos el partido (asegúrate de que el ID sea el correcto, a veces es match.id, a veces match._id)
  const match = matches.find(m => m._id === id || m.id === id);

  const isDataLoaded = matchStore?.titulares_home?.length > 0 || matchStore?.titulares_away?.length > 0;
  const loading = !isDataLoaded;

  // 3. Definimos loadAll ANTES de usarlo en el useEffect
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
      console.error("Error crítico:", error);
    }
  }, [setInitialData]);

  // 4. Un solo useEffect para manejar la carga y limpieza
  useEffect(() => {
    if (match) {
      resetStore(); // Limpia los datos anteriores
      loadAll(match); // Carga los nuevos
    }
  }, [id, match, resetStore, loadAll]); // Se dispara cuando cambia el ID

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
          teams={teams} // Pasa 'teams' directamente
          // En el return de MatchDetail.jsx:
          stats={[
              { label: "Posesión", home: match.stats?.possession_home || 50, away: match.stats?.possession_away || 50 },
              { label: "Remates", home: match.stats?.shots_home || 0, away: match.stats?.shots_away || 0 }
         ]}
       />
      )}
    </div>
  );
}