// Innan jag skapar filerna kan jag ge en enkel minnesregel för att komma ihåg dessa tre huvudfiler:
//  DHC-A (Data, Handling, Coating, Assembly):

// DataHelpers.js - Hanterar all data (som skogen som ger virke)
//  HDashboard.jsx - Hanterar logik och struktur (som snickare som bygger själva huset)
// CDashboard.css - Coating/färg som ger det visuella utseendet (som målaren som fixar fasaden)
// App.jsx - Assembly/montering som sätter ihop allt (som byggmästaren som samordnar projektet)
// ___________________
// src/components/SkogsvärdeDashboard.jsx
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
         Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { simuleraPrisdata, simuleraAvkastningsdata, 
         beräknaVärdeökning, beräknaAvkastningsProcent } from '../utils/dataHelpers';
import './SkogsvardeDashboard.css';

const SkogsvardeDashboard = () => {
  const [skogsdata, setSkogsdata] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulera datahämtning när komponenten monteras
  useEffect(() => {
    // Simulera en kort laddningstid
    setTimeout(() => {
      const data = generateData();
      setSkogsdata(data);
      setLoading(false);
    }, 1000);
  }, []);

  // Funktion för att generera simulerad data
  const generateData = () => {
    // Simulera prisdata
    const prisData = simuleraPrisdata();
    
    // Simulera avkastningsdata
    const avkastningData = simuleraAvkastningsdata();
    
    // Beräkna värdeökning i procent
    const värdeökningar = beräknaVärdeökning(prisData);
    
    // Beräkna avkastning som procent av marknadsvärdet
    const avkastningsProcent = beräknaAvkastningsProcent(prisData, avkastningData);
    
    // Sammanställ kombinerad data för grafer
    const combinedData = prisData.map((item, index) => {
      return {
        ...item,
        avkastning: avkastningData[index]?.avkastning || 0,
        värdeökningProcent: index > 0 ? värdeökningar[index - 1]?.ökning : 0,
        avkastningProcent: avkastningsProcent[index]?.procentAvkastning || 0
      };
    });

    return {
      combinedData,
      prisData,
      avkastningData,
      värdeökningar,
      avkastningsProcent
    };
  };

  // Formatera värden för y-axel (priser)
  const formatSEK = (value) => {
    return `${value / 1000} tkr`;
  };

  // Formatera procent
  const formatPercent = (value) => {
    return `${value}%`;
  };

  // Anpassad tooltip-komponent för graferna
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip">
          <p className="tooltip-label">{`År: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
              {entry.name.includes('procent') || entry.dataKey.includes('Procent') ? '%' : 
               entry.name === 'Pris per hektar' ? ' kr/ha' : ' kr/ha/år'}
            </p>
          ))}
          {payload[0]?.payload?.händelse && (
            <p className="tooltip-event">{payload[0].payload.händelse}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Om data fortfarande laddas
  if (loading) {
    return (
      <div className="container">
        <div className="loading">Laddar data och bygger grafer...</div>
      </div>
    );
  }

  // Beräkna sammanfattande statistik
  const genomsnittligÅrligÖkning = ((skogsdata.prisData[skogsdata.prisData.length-1].pris / skogsdata.prisData[0].pris) ** (1/30) * 100 - 100).toFixed(1);
  const totalÖkning = (((skogsdata.prisData[skogsdata.prisData.length-1].pris / skogsdata.prisData[0].pris) - 1) * 100).toFixed(0);
  const startPris = skogsdata.prisData[0].pris.toLocaleString();
  const slutPris = skogsdata.prisData[skogsdata.prisData.length-1].pris.toLocaleString();
  
  const genomsnittligAvkastning = (skogsdata.avkastningData.reduce((sum, item) => sum + item.avkastning, 0) / skogsdata.avkastningData.length).toFixed(0);
  const högstaAvkastning = Math.max(...skogsdata.avkastningData.map(item => item.avkastning)).toLocaleString();
  const lägstaAvkastning = Math.min(...skogsdata.avkastningData.map(item => item.avkastning)).toLocaleString();
  const avkastning2024 = skogsdata.avkastningData[skogsdata.avkastningData.length-1].avkastning.toLocaleString();

  return (
    <div className="container">
      <h1>Skogsvärde och avkastning i Skåne 1994-2024</h1>
      <p className="note">
        Notera: Denna visualisering baseras på simulerade data utifrån kända trender. 
        För exakta värden rekommenderas data från Skogsstyrelsen, LRF Konsult/Ludvig & Co och Lantmäteriet.
      </p>

      {/* Prisutveckling för skogsmark */}
      <div className="card">
        <h2>Prisutveckling för skogsmark i Skåne (kr/ha)</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={skogsdata.combinedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="år"
                tickCount={10} 
                interval={3}
              />
              <YAxis 
                tickFormatter={formatSEK} 
                domain={[0, 'dataMax + 20000']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="pris" 
                name="Pris per hektar" 
                stroke="#2563eb" 
                strokeWidth={2} 
                dot={{ r: 2 }} 
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p>
          Betydande händelser markerade i tooltips. Priserna har överlag visat en uppåtgående trend med vissa 
          fluktuationer under ekonomiska kriser och speciella marknadsförhållanden.
        </p>
      </div>

      {/* Avkastning från skogsbruk */}
      <div className="card">
        <h2>Avkastning från skogsbruk (kr/ha/år)</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={skogsdata.combinedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="år"
                tickCount={10} 
                interval={3}
              />
              <YAxis domain={[0, 'dataMax + 500']} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avkastning" 
                name="Avkastning från skogsbruk" 
                stroke="#16a34a" 
                strokeWidth={2} 
                dot={{ r: 2 }} 
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p>
          Avkastningen från skogsbruket (gallring, slutavverkning etc.) har påverkats av virkespriser, 
          stormskador och marknadsefterfrågan.
        </p>
      </div>

      {/* Värdeökning per år */}
      <div className="card">
        <h2>Årlig värdeökning på skogsmark (%)</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={skogsdata.värdeökningar}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="år"
                tickCount={10} 
                interval={3}
              />
              <YAxis 
                domain={[-10, 30]} 
                tickFormatter={formatPercent}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine y={0} stroke="#000" />
              <Bar 
                dataKey="ökning" 
                name="Värdeökning (%)" 
                fill="#d97706" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p>
          Diagrammet visar den årliga procentuella värdeökningen på skogsmark. 
          Negativa värden representerar år med värdeminskning.
        </p>
      </div>

      {/* Avkastning som procent av marknadsvärde */}
      <div className="card">
        <h2>Avkastning som procent av marknadsvärde (%)</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={skogsdata.avkastningsProcent}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="år"
                tickCount={10} 
                interval={3}
              />
              <YAxis 
                domain={[0, 'dataMax + 1']}
                tickFormatter={formatPercent}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="procentAvkastning" 
                name="Avkastning av marknadsvärde" 
                stroke="#8b5cf6" 
                strokeWidth={2} 
                dot={{ r: 2 }} 
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p>
          Diagrammet visar hur stor del av markens värde som den årliga avkastningen från skogsbruket utgör.
          Trenden är nedåtgående eftersom markpriserna har ökat snabbare än avkastningen.
        </p>
      </div>

      {/* Sammanfattande statistik */}
      <div className="card">
        <h2>Sammanfattande statistik och nyckeltal</h2>
        <div className="stats-panel">
          <div className="stats-box blue">
            <h3>Markprisutveckling 1994-2024</h3>
            <div className="stats-content">
              <p className="stats-item">
                <span className="stats-label">Genomsnittlig årlig ökning:</span> {genomsnittligÅrligÖkning}%
              </p>
              <p className="stats-item">
                <span className="stats-label">Total ökning:</span> {totalÖkning}%
              </p>
              <p className="stats-item">
                <span className="stats-label">Startpris (1994):</span> {startPris} kr/ha
              </p>
              <p className="stats-item">
                <span className="stats-label">Slutpris (2024):</span> {slutPris} kr/ha
              </p>
            </div>
          </div>
          <div className="stats-box green">
            <h3>Avkastning från skogsbruk</h3>
            <div className="stats-content">
              <p className="stats-item">
                <span className="stats-label">Genomsnittlig årlig avkastning:</span> {genomsnittligAvkastning} kr/ha/år
              </p>
              <p className="stats-item">
                <span className="stats-label">Högsta avkastning:</span> {högstaAvkastning} kr/ha/år
              </p>
              <p className="stats-item">
                <span className="stats-label">Lägsta avkastning:</span> {lägstaAvkastning} kr/ha/år
              </p>
              <p className="stats-item">
                <span className="stats-label">Avkastning 2024:</span> {avkastning2024} kr/ha/år
              </p>
            </div>
          </div>
        </div>
      
        <div className="conclusions">
          <h3>Slutsatser och trender</h3>
          <ul className="conclusions-list">
            <li>Skogsfastighetspriserna i Skåne har ökat betydligt mer än avkastningen från skogsbruket de senaste 30 åren.</li>
            <li>Avkastningen som andel av fastighetsvärdet (direktavkastningen) har därför minskat över tid.</li>
            <li>Värdeökningen på själva marken har blivit en allt viktigare del av den totala avkastningen för skogsägare.</li>
            <li>Stora händelser som finanskriser och stormskador har tydligt påverkat både priser och avkastning.</li>
            <li>Skogsfastigheter har i allt högre grad blivit en kapitalplacering snarare än enbart en produktionsresurs.</li>
          </ul>
        </div>
      </div>

      <div className="footer">
        Detta är en simulering baserad på trender från officiell statistik. 
        För mer exakta värden konsultera Skogsstyrelsen, Lantmäteriet eller Ludvig & Co.
      </div>
    </div>
  );
};

export default SkogsvardeDashboard; 