export default function PlayerRow({ player }) {
  if (!player) return <div className="h-10"></div>; // Espacio vacío si no hay jugador

  return (
    <div className="flex items-center gap-3">
      {/* Número de camiseta */}
      <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-lg text-white font-bold text-xs border border-white/10">
        {player.jersey_number}
      </div>
      
      {/* Nombre del jugador */}
      <div className="flex flex-col">
        <span className="text-white text-sm font-medium">{player.name}</span>
        <span className="text-[10px] text-green-500 uppercase">{player.pos}</span>
      </div>
    </div>
  );
}