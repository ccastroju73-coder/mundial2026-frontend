import { create } from 'zustand';

export const useMatchStore = create((set) => ({
  // Estado inicial
  match: {
    score: { home: 0, away: 0 },
    stats: { possession: [50, 50], shots: [0, 0], corners: [0, 0], fouls: [0, 0] },
    titulares: [], // Los 11 que están jugando
    banca: [],     // Los que esperan
    cambios: []    // Historial de cambios realizados
  },

  // Acciones (funciones para modificar el estado)
  setInitialData: (titulares, banca) => set({ match: { titulares, banca, score: { home: 0, away: 0 }, stats: { possession: [50, 50], shots: [0, 0], corners: [0, 0], fouls: [0, 0] }, cambios: [] } }),

  hacerCambio: (idSale, idEntra) => set((state) => {
    const { titulares, banca, cambios } = state.match;
    
    const jugadorSale = titulares.find(j => j.id === idSale);
    const jugadorEntra = banca.find(j => j.id === idEntra);
    
    return {
      match: {
        ...state.match,
        titulares: titulares.filter(j => j.id !== idSale).concat(jugadorEntra),
        banca: banca.filter(j => j.id !== idEntra).concat(jugadorSale),
        cambios: [...cambios, { sale: jugadorSale.name, entra: jugadorEntra.name, min: new Date().toLocaleTimeString() }]
      }
    };
  })
}));