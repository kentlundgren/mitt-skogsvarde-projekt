/**
 * Hjälpfunktioner för beräkning av skogsvärden
 * 
 * Denna fil innehåller funktioner för att beräkna olika värden 
 * relaterade till skogsmark och dess avkastning.
 */

/**
 * Beräknar årlig värdeökning baserat på initial investering och tillväxtfaktor
 * @param {number} initialVarde - Det initiala värdet i kronor
 * @param {number} arligTillvaxt - Årlig tillväxt i procent (ex: 3.5 för 3.5%)
 * @param {number} antalAr - Antal år att beräkna tillväxten för
 * @returns {Object} Ett objekt med värden för varje år samt total tillväxt
 */
export const beraknaVardeUtveckling = (initialVarde, arligTillvaxt, antalAr) => {
  // Konvertera procent till decimalform
  const tillvaxtFaktor = 1 + (arligTillvaxt / 100);
  
  // Skapa resultatobjekt
  const resultat = {
    arligaVarden: [],
    totalTillvaxt: 0,
    slutvarde: 0
  };
  
  let aktuelltVarde = initialVarde;
  
  // Beräkna värde för varje år
  for (let ar = 1; ar <= antalAr; ar++) {
    aktuelltVarde = aktuelltVarde * tillvaxtFaktor;
    
    // Avrunda till närmaste krona
    aktuelltVarde = Math.round(aktuelltVarde);
    
    // Lägg till i resultatarrayen
    resultat.arligaVarden.push({
      ar: ar,
      varde: aktuelltVarde
    });
  }
  
  // Beräkna slutvärde och total tillväxt
  resultat.slutvarde = aktuelltVarde;
  resultat.totalTillvaxt = aktuelltVarde - initialVarde;
  
  return resultat;
};

/**
 * Beräknar optimal gallringstidpunkt baserat på tillväxtkurva
 * @param {number} alder - Skogens nuvarande ålder i år
 * @param {number} tillvaxtTakt - Tillväxttakt i procent
 * @returns {number} Rekommenderad ålder för gallring
 */
export const beraknaOptimalGallring = (alder, tillvaxtTakt) => {
  // Enkel modell - i verkligheten skulle detta vara mer komplext
  if (tillvaxtTakt > 5) {
    return alder + 5; // Snabb tillväxt - gallra snart
  } else if (tillvaxtTakt > 3) {
    return alder + 8; // Medel tillväxt
  } else {
    return alder + 12; // Långsam tillväxt - vänta längre
  }
};

/**
 * Jämför avkastning mellan skogsmark och alternativa investeringar
 * @param {number} skogsvardeArligAvkastning - Skogsinvesteringens årliga avkastning i procent
 * @param {number} alternativArligAvkastning - Alternativ investerings årliga avkastning i procent
 * @param {number} tidshorisont - Investeringshorisont i år
 * @returns {Object} Jämförelse mellan investeringarna
 */
export const jamforInvesteringar = (skogsvardeArligAvkastning, alternativArligAvkastning, tidshorisont) => {
  const skog = beraknaVardeUtveckling(100000, skogsvardeArligAvkastning, tidshorisont);
  const alternativ = beraknaVardeUtveckling(100000, alternativArligAvkastning, tidshorisont);
  
  return {
    skogsvarde: skog.slutvarde,
    alternativ: alternativ.slutvarde,
    skillnad: skog.slutvarde - alternativ.slutvarde,
    skogBattre: skog.slutvarde > alternativ.slutvarde
  };
};

export default {
  beraknaVardeUtveckling,
  beraknaOptimalGallring,
  jamforInvesteringar
}; 