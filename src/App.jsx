import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import FullFixture from './FullFixture';
import MatchDetail from './MatchDetail';
import LineupComponent from './LineupComponent';
import Resultados from './Resultados';
import AdminDashboard from './AdminDashboard';
import StandingsPage from './StandingsTable';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/matches`);
        setMatches(response.data);
      } catch (err) {
        console.error("Error al cargar partidos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Cargando partidos...</div>;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Routes>
          <Route path="/" element={<Home matches={matches} />} />
          <Route path="/calendario" element={<FullFixture matches={matches} />} />
          <Route path="/partido/:id" element={<MatchDetail matches={matches} />} />
          {/* RUTA CORREGIDA: Incluye los datos y es única */}
          <Route path="/partido/:id/lineup" element={<LineupComponent matches={matches} />} />
          <Route path="/resumen" element={<Resultados matches={matches} />} />
          {/* Tu link secreto será: tuweb.com/admin-secreto-2026 */}
          <Route path="/admin-secreto-2026" element={<AdminDashboard />} />
          <Route path="/standingstable" element={<StandingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;