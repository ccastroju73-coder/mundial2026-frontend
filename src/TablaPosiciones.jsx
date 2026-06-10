import { useState, useEffect } from 'react';
import axios from 'axios';
import { teams as teamsData } from './teamsData'; // Importamos como teamsData

export default function TablaPosiciones({ grupo }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    axios.get('https://api-mundial-2026-iwfn.onrender.com/api/groups')
      .then(res => {
        const grupoEncontrado = res.data.find(g => g.group === grupo);
        if (grupoEncontrado) {
          setData(grupoEncontrado);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [grupo]);

  if (loading) return <div className="text-gray-400 p-4">Cargando datos...</div>;
  if (!data) return <div className="text-red-400 p-4">No se encontró el grupo {grupo}</div>;

// En TablaPosiciones.jsx
return (
  // Cambiamos p-6 por p-8 y añadimos un ancho base más generoso
  <div className="bg-[#111827] p-8 rounded-2xl border border-gray-800 shadow-xl w-full">
    <h3 className="text-xl font-bold text-white mb-6">Grupo {data.group}</h3>
    
    {/* Ajustamos la tabla para que sea más fluida */}
    <table className="w-full text-sm text-gray-300 table-auto border-separate border-spacing-y-2">
      <thead>
        <tr className="text-gray-500 text-left">
          <th className="py-2 px-2">Equipo</th>
          <th className="py-2 px-2 text-center">PJ</th>
          <th className="py-2 px-2 text-center">G</th>
          <th className="py-2 px-2 text-center">E</th>
          <th className="py-2 px-2 text-center">P</th>
          <th className="py-2 px-2 text-center">DG</th>
          <th className="py-2 px-2 text-center">Pts</th>
        </tr>
      </thead>
      <tbody>
        {data.teams.map((t) => (
          <tr key={t.team_id} className="bg-gray-800/20 hover:bg-gray-700/30 transition-colors">
            <td className="py-3 px-2 flex items-center gap-3 truncate">
              {teamsData[t.team_id]?.flag && (
                 <img src={teamsData[t.team_id].flag} className="w-6 h-4 object-cover rounded-sm" alt="" />
              )}
              <span className="font-medium">{teamsData[t.team_id]?.name || `Equipo ${t.team_id}`}</span>
            </td>
            <td className="py-3 px-2 text-center text-gray-400">{t.mp}</td>
            <td className="py-3 px-2 text-center text-gray-400">{t.w}</td>
            <td className="py-3 px-2 text-center text-gray-400">{t.d}</td>
            <td className="py-3 px-2 text-center text-gray-400">{t.l}</td>
            <td className="py-3 px-2 text-center text-gray-400">{t.gd}</td>
            <td className="py-3 px-2 text-center font-bold text-green-400">{t.pts}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}