import { create } from 'zustand';

export const useMatchStore = create((set) => ({
  match: {
    titulares_home: [],
    titulares_away: [],
    banca_home: [],
    banca_away: [],
    score: { home: 0, away: 0 },
    stats: { possession: [50, 50], shots: [0, 0], corners: [0, 0], fouls: [0, 0] },
    cambios: []
  },

  // ESTO ES LO QUE NECESITABAS: Limpiar el estado
  resetStore: () => set({
    match: {
      titulares_home: [],
      titulares_away: [],
      banca_home: [],
      banca_away: [],
      score: { home: 0, away: 0 },
      stats: { possession: [50, 50], shots: [0, 0], corners: [0, 0], fouls: [0, 0] },
      cambios: []
    }
  }),

  setInitialData: (todosLosJugadores, esLocal) => set((state) => ({
    match: {
      ...state.match,
      [esLocal ? 'titulares_home' : 'titulares_away']: todosLosJugadores.slice(0, 11),
      [esLocal ? 'banca_home' : 'banca_away']: todosLosJugadores.slice(11)
    }
  })),

  hacerCambio: (idSale, idEntra, esLocal) => set((state) => {
    const keyTitulares = esLocal ? 'titulares_home' : 'titulares_away';
    const keyBanca = esLocal ? 'banca_home' : 'banca_away';
    
    const titulares = state.match[keyTitulares] || [];
    const banca = state.match[keyBanca] || [];
    
    const jugadorSale = titulares.find(j => j.id === idSale);
    const jugadorEntra = banca.find(j => j.id === idEntra);
    
    return {
      match: {
        ...state.match,
        // CORRECCIÓN: Cambiamos 'jid' por 'j.id'
        [keyTitulares]: titulares.filter(j => j.id !== idSale).concat(jugadorEntra),
        [keyBanca]: banca.filter(j => j.id !== idEntra).concat(jugadorSale),
        cambios: [...state.match.cambios, { 
            sale: jugadorSale?.name, 
            entra: jugadorEntra?.name, 
            min: new Date().toLocaleTimeString() 
        }]
      }
    };
  })
}));