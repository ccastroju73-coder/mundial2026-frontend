import { create } from 'zustand';

export const useMatchStore = create((set) => ({
  // Estado inicial unificado
  match: {
    titulares_home: [],
    titulares_away: [],
    banca_home: [],
    banca_away: [],
    score: { home: 0, away: 0 },
    stats: { possession: [50, 50], shots: [0, 0], corners: [0, 0], fouls: [0, 0] },
    cambios: []
  },

  // Función única y correcta
  setInitialData: (homeData, awayData) => set((state) => ({
    match: {
      ...state.match,
      titulares_home: homeData,
      titulares_away: awayData
    }
  })),

  // Acción para hacer cambios (ajustada para usar titulares_home/away)
  hacerCambio: (idSale, idEntra, esLocal) => set((state) => {
    const keyTitulares = esLocal ? 'titulares_home' : 'titulares_away';
    const keyBanca = esLocal ? 'banca_home' : 'banca_away';
    
    const titulares = state.match[keyTitulares];
    const banca = state.match[keyBanca];
    
    const jugadorSale = titulares.find(j => j.id === idSale);
    const jugadorEntra = banca.find(j => j.id === idEntra);
    
    return {
      match: {
        ...state.match,
        [keyTitulares]: titulares.filter(j => j.id !== idSale).concat(jugadorEntra),
        [keyBanca]: banca.filter(j => j.id !== idEntra).concat(jugadorSale),
        cambios: [...state.match.cambios, { sale: jugadorSale.name, entra: jugadorEntra.name, min: new Date().toLocaleTimeString() }]
      }
    };
  })
}));