// Jag ska skapa dessa filer för dig. Låt mig börja med dataHelpers.js.

// Innan jag skapar filerna kan jag ge en enkel minnesregel för att komma ihåg dessa tre huvudfiler:

//**DHC-A** (Data, Handling, Coating, Assembly):
//-  **D**ataHelpers.js - Hanterar all data (som skogen som ger virke)
// - **H**Dashboard.jsx - Hanterar logik och struktur (som snickare som bygger själva huset)
//-  **C**Dashboard.css - Coating/färg som ger det visuella utseendet (som målaren som fixar fasaden)
//- **App.jsx - Assembly/montering som sätter ihop allt (som byggmästaren som samordnar projektet)

//Låt oss börja med dataHelpers.js:


// src/utils/dataHelpers.js

// Funktion för att simulera prisdata
export function simuleraPrisdata() {
  const år = Array.from({length: 31}, (_, i) => 1994 + i);
  let priser = [];
  let basPris = 25000;
  
  const händelser = [
    { år: 1999, faktor: 1.15, beskrivning: "Ökat intresse för skogsägande" },
    { år: 2005, faktor: 1.2, beskrivning: "Ökad efterfrågan på biobränsle" },
    { år: 2007, faktor: 1.3, beskrivning: "Stark högkonjunktur" },
    { år: 2009, faktor: 0.95, beskrivning: "Finanskris" },
    { år: 2011, faktor: 1.15, beskrivning: "Återhämtning" },
    { år: 2014, faktor: 1.1, beskrivning: "Låga räntor ökar investeringar" },
    { år: 2018, faktor: 1.15, beskrivning: "Stark efterfrågan på skogsfastigheter" },
    { år: 2020, faktor: 1.05, beskrivning: "Covid-19 ökar intresset för landsbygdsboende" },
    { år: 2022, faktor: 1.12, beskrivning: "Inflation och råvarubrist" }
  ];
  
  for (let i = 0; i < år.length; i++) {
    const åretNu = år[i];
    let årligTillväxt = 1.03 + (Math.random() * 0.04);
    
    const händelse = händelser.find(h => h.år === åretNu);
    if (händelse) {
      årligTillväxt *= händelse.faktor;
    }
    
    if (i === 0) {
      priser.push({ 
        år: åretNu, 
        pris: basPris,
        händelse: händelse ? händelse.beskrivning : null 
      });
    } else {
      const förraPris = priser[i-1].pris;
      const nyttPris = Math.round(förraPris * årligTillväxt);
      priser.push({ 
        år: åretNu, 
        pris: nyttPris,
        händelse: händelse ? händelse.beskrivning : null 
      });
    }
  }
  
  return priser;
}

// Funktion för att simulera avkastningsdata
export function simuleraAvkastningsdata() {
  const år = Array.from({length: 31}, (_, i) => 1994 + i);
  let avkastningBas = 1200;
  
  const händelser = [
    { år: 1995, faktor: 1.1, beskrivning: "Höga virkespriser" },
    { år: 1999, faktor: 0.9, beskrivning: "Stormfällning påverkar priserna" },
    { år: 2002, faktor: 0.95, beskrivning: "Lågkonjunktur i byggsektorn" },
    { år: 2005, faktor: 1.15, beskrivning: "Ökad efterfrågan på massaved" },
    { år: 2007, faktor: 1.2, beskrivning: "Höga virkespriser" },
    { år: 2009, faktor: 0.8, beskrivning: "Finanskris sänker efterfrågan" },
    { år: 2013, faktor: 1.15, beskrivning: "Återhämtning i byggbranschen" },
    { år: 2018, faktor: 1.1, beskrivning: "Stark trävarumarknad" },
    { år: 2020, faktor: 0.9, beskrivning: "Covid-19-effekter" },
    { år: 2021, faktor: 1.25, beskrivning: "Extremt höga virkespriser" },
    { år: 2023, faktor: 0.95, beskrivning: "Svag byggmarknad" }
  ];
  
  let avkastningar = [];
  
  for (let i = 0; i < år.length; i++) {
    const åretNu = år[i];
    let årligFörändring = 1.01 + (Math.random() * 0.02);
    
    const händelse = händelser.find(h => h.år === åretNu);
    if (händelse) {
      årligFörändring *= händelse.faktor;
    }
    
    if (i === 0) {
      avkastningar.push({ 
        år: åretNu, 
        avkastning: avkastningBas,
        händelse: händelse ? händelse.beskrivning : null 
      });
    } else {
      const förraAvkastning = avkastningar[i-1].avkastning;
      const nyAvkastning = Math.round(förraAvkastning * årligFörändring);
      avkastningar.push({ 
        år: åretNu, 
        avkastning: nyAvkastning,
        händelse: händelse ? händelse.beskrivning : null 
      });
    }
  }
  
  return avkastningar;
}

// Funktion för att beräkna värdeökning
export function beräknaVärdeökning(prisData) {
  const värdeökningar = [];
  
  for (let i = 1; i < prisData.length; i++) {
    const förraPris = prisData[i-1].pris;
    const nyttPris = prisData[i].pris;
    const procentuellÖkning = ((nyttPris - förraPris) / förraPris) * 100;
    
    värdeökningar.push({
      år: prisData[i].år,
      ökning: parseFloat(procentuellÖkning.toFixed(2)),
      händelse: prisData[i].händelse
    });
  }
  
  return värdeökningar;
}

// Funktion för att beräkna avkastning som procent av marknadsvärde
export function beräknaAvkastningsProcent(prisData, avkastningData) {
  const avkastningsProcent = [];
  
  for (let i = 0; i < prisData.length; i++) {
    const pris = prisData[i].pris;
    const avkastning = avkastningData[i].avkastning;
    const procentAvkastning = (avkastning / pris) * 100;
    
    avkastningsProcent.push({
      år: prisData[i].år,
      procentAvkastning: parseFloat(procentAvkastning.toFixed(2)),
      händelse: avkastningData[i].händelse || prisData[i].händelse
    });
  }
  
  return avkastningsProcent;
}
