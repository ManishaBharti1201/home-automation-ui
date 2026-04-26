import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import axios from 'axios';
import { LogEntry } from './Logs';

interface UtilityData {
  electricity: number[];
  gas: number[];
  water: number[];
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface UsageProps {
  onLog?: (type: LogEntry['type'], message: string, detail?: string) => void;
}

const Usage: React.FC<UsageProps> = ({ onLog }) => {
  const [utilityData, setUtilityData] = useState({
    electricity: [] as number[],
    gas: [] as number[],
    water: [] as number[],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUtilityData = async () => {
      onLog?.('API', 'Fetching utility data', 'GET /api/utility-bills');
      try {
        const response = await axios.get<UtilityData>('/api/utility-bills');
        setUtilityData(response.data as UtilityData);
        onLog?.('UPDATE', 'Utility data synced', 'Metrics updated');
      } catch (error) {
        onLog?.('ERROR', 'Utility API Failure', 'Using fallback mock data');
        setUtilityData({
          electricity: [120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230],
          gas: [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135],
          water: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUtilityData();
  }, [onLog]);

  const glassChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: { weight: 'bold', size: 10, family: 'Inter' },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 14, weight: 'bold' },
        padding: 12,
        cornerRadius: 12,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10, weight: 'bold' } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10, weight: 'bold' } },
      },
    },
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Electricity',
        data: utilityData.electricity,
        borderColor: '#22d3ee', // Cyan-400
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'Water',
        data: utilityData.water,
        borderColor: '#818cf8', // Indigo-400
        backgroundColor: 'rgba(129, 140, 248, 0.05)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: 'Gas',
        data: utilityData.gas,
        borderColor: '#f472b6', // Pink-400
        backgroundColor: 'rgba(244, 114, 182, 0.05)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  const StatCard = ({ label, value, icon, colorClass }: any) => (
    <div className="flex items-center gap-4 bg-slate-800/40 border border-white/5 rounded-[1.5rem] px-5 py-3 flex-shrink-0 min-w-[160px]">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colorClass} bg-opacity-20 shadow-inner`}>
            {icon}
        </div>
        <div>
            <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">{label}</p>
            <p className="text-sm font-black text-white italic">{value}</p>
        </div>
    </div>
  );

  if (loading) return null;

  return (
    <div className="w-full p-8 rounded-[2.5rem] bg-slate-900/60 backdrop-blur-3xl border-2 border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all">
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-cyan-400 text-[10px] uppercase font-black tracking-[0.3em] italic">Live Metrics</p>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Energy Usage</h2>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Estimated Bill</p>
          <div className="flex items-baseline justify-end gap-1">
             <span className="text-xs font-black text-cyan-400/50">$</span>
             <span className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">240</span>
          </div>
        </div>
      </div>
      
      {/* CHART AREA */}
      <div className="h-[280px] w-full mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none rounded-3xl" />
        <Line data={chartData} options={glassChartOptions} />
      </div>

      {/* QUICK STATS ROW */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pt-2">
        <StatCard 
            label="Avg Power" 
            value="165 kWh" 
            icon="⚡" 
            colorClass="bg-cyan-400 text-cyan-400" 
        />
        <StatCard 
            label="Peak Water" 
            value="105 Liters" 
            icon="💧" 
            colorClass="bg-indigo-400 text-indigo-400" 
        />
        <StatCard 
            label="Gas flow" 
            value="12.4 m³" 
            icon="🔥" 
            colorClass="bg-pink-400 text-pink-400" 
        />
      </div>
    </div>
  );
};

export default Usage;