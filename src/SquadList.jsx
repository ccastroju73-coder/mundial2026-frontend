export default function SquadList({ title, players, coachName }) {
  // 1. Aseguramos que tenemos un array, si no, devolvemos un array vacío
  const safePlayers = Array.isArray(players) ? players : [];
  
  // 2. Ordenamos y asignamos a una constante que SÍ vamos a usar abajo
  const sortedPlayers = [...safePlayers].sort((a, b) => a.jersey_number - b.jersey_number);

  return (
    <div className="bg-[#1a1d23] p-6 rounded-3xl border border-white/10 shadow-xl">
      <h3 className="text-gray-400 uppercase text-xs tracking-widest mb-6 font-semibold">{title}</h3>
      <div className="flex items-center gap-4 mb-8 p-3 bg-white/5 rounded-2xl">
        <div className="w-10 h-10 bg-green-500/20 flex items-center justify-center rounded-full text-green-500 text-lg">👨‍💼</div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold">Director Técnico</p>
          <p className="text-white font-medium">{coachName || "No asignado"}</p>
        </div>
      </div>
      <div className="space-y-3">
        {/* AQUÍ es donde usamos 'sortedPlayers' */}
        {sortedPlayers.length > 0 ? (
          sortedPlayers.map(p => (
            <div key={p._id || p.jersey_number} className="flex items-center gap-4 p-2 hover:bg-white/5 rounded-xl transition-colors">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg text-white font-black text-sm border border-white/5">
                {p.jersey_number}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{p.name}</p>
                <p className="text-green-500 text-[10px] uppercase font-bold">{p.pos}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">Sin jugadores registrados.</p>
        )}
      </div>
    </div>
  );
}