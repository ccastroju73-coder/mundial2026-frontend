import MatchResultCard from './MatchResultCard';


export default function Resultados({ matches }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {matches.map((match) => (
        <MatchResultCard key={match._id || match.id} match={match} />
      ))}
    </div>
  );
}