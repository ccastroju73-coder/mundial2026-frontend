// Asegúrate de usar todas las variables que recibes
export default function LineupComponent({ homePlayers, awayPlayers, homeBench, awayBench }) {
  return (
    <div className="space-y-8">
      {/* --- TITULARES --- */}
      <div className="grid grid-cols-2 gap-4">
        {/* Aquí usas homePlayers */}
        <div className="space-y-2">
          {homePlayers.map((p, i) => (
            <div key={i}>{p.name}</div>
          ))}
        </div>
        {/* Aquí usas awayPlayers (esto quitará el aviso) */}
        <div className="space-y-2">
          {awayPlayers.map((p, i) => (
            <div key={i}>{p.name}</div>
          ))}
        </div>
      </div>

      {/* --- SUPLENTES --- */}
       // En tu sección de suplentes dentro de LineupComponent.jsx
       <div className="space-y-2">
         {homeBench.map((p, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-white/10 rounded">
               {/* AQUÍ ACCEDEMOS A LAS PROPIEDADES, NO AL OBJETO 'p' */}
               <span className="font-bold text-gray-500">{p.jersey_number}</span>
               <span className="text-white">{p.name}</span>
            </div>
          ))}
        </div>
        {/* Aquí usas awayBench (esto quitará el aviso) */}
        <div className="space-y-2">
          {awayBench.map((p, i) => (
            <div key={i}>{p.name}</div>
          ))}
        </div>
      </div>
 
  );
}