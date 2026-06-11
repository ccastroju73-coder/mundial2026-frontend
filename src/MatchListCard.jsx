import { Link } from 'react-router-dom';
import MatchCard from './MatchCard'; // Tu tarjeta existente

export default function MatchListCard({ match, home, away, isLive, isFinished }) {
  return (
    <Link 
      to={`/partido/${match.id}`} 
      className="block transition-transform hover:scale-[1.02] duration-200"
    >
      <MatchCard 
        match={match} 
        home={home} 
        away={away} 
        isLive={isLive} 
        isFinished={isFinished} 
      />
    </Link>
  );
}