import MatchCard from './MatchCard';
import { teams } from './teamsData';

export default function FullFixture({ matches }) {
  // Ordenamos todos los partidos por fecha
  const allMatches = [...matches].sort((a, b) => new Date(a.local_date) - new Date(b.local_date));

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-8">
      <h1 className="text-4xl font-black text-center mb-12 uppercase tracking-widest text-green-500">
        Calendario Completo 2026
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {allMatches.map(match => (
          <MatchCard 
            key={match._id} 
            match={match} 
            isLive={match.status === 'live'}
            isFinished={match.status === 'finished'}
            home={teams[match.home_team_id]} 
            away={teams[match.away_team_id]} 
          />
        ))}
      </div>
    </div>
  );
}