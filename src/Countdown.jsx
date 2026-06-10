import { useState, useEffect } from 'react';

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState("");
  // 1. Guardamos el objeto fecha en un estado para usarlo en el return
  const [displayDate, setDisplayDate] = useState(null); 

  useEffect(() => {
    const calculateTime = () => {
      const [datePart, timePart] = targetDate.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');
      
      const targetDateObj = new Date(
        parseInt(year),
        parseInt(day) - 1, // Mes (Junio)
        parseInt(month),   // Día (11)
        parseInt(hours),
        parseInt(minutes)
      );

      // 2. Actualizamos el estado con el objeto fecha
      setDisplayDate(targetDateObj); 
      
      const target = targetDateObj.getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${weeks}w ${days}d ${hours}h ${mins}m ${secs}s`);
      } else {
        setTimeLeft("¡En juego!");
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Función para formatear la fecha
  const formatDate = (dateObj) => {
    if (!dateObj) return "";
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-green-400 font-mono font-bold text-sm md:text-base">
        {timeLeft}
      </span>
      {/* 3. Usamos el estado displayDate que ahora sí es accesible aquí */}
      <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
        {formatDate(displayDate)}
      </span>
    </div>
  );
}