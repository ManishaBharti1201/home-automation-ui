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
  ChartOptions,
} from 'chart.js';
import axios from 'axios';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Usage: React.FC = () => {
  const [utilityData, setUtilityData] = useState<{
    electricity: number[];
    gas: number[];
    water: number[];
  }>({
    electricity: [],
    gas: [],
    water: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUtilityData = async () => {
      try {
        const response = await axios.get('/api/utility-bills');
        const data = response.data as {
          electricity: number[];
          gas: number[];
          water: number[];
        };
        setUtilityData(data);
      } catch (error) {
        console.error('Error fetching utility data:', error);
        // Fallback dummy data
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
  }, []);

  // 1. Define Glass Theme Chart Options
  const glassChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)', // Light text for legend
          font: { weight: 'bold', size: 10 },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        //backdropFilter: 'blur(10px)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false }, // Hide vertical grid lines for cleaner look
        ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' }, // Subtle horizontal lines
        ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } },
      },
    },
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Electricity',
        data: utilityData.electricity,
        borderColor: '#818cf8', // Indigo-400
        backgroundColor: 'rgba(129, 140, 248, 0.2)',
        fill: true, // Filled area looks better in glassmorphism
        tension: 0.4, // Smooth curves
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      {
        label: 'Gas',
        data: utilityData.gas,
        borderColor: '#f472b6', // Pink-400
        backgroundColor: 'rgba(244, 114, 182, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Water',
        data: utilityData.water,
        borderColor: '#2dd4bf', // Teal-400
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  if (loading) return null;

  return (
    <div className="w-full p-5 md:p-6 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all">
      <div className="flex justify-between items-start mb-4 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Energy Usage</h2>
          <p className="text-white/40 text-[10px] md:text-xs uppercase font-bold tracking-widest">Analytics Dashboard</p>
        </div>
        <div className="text-right">
          <span className="text-2xl md:text-3xl font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.3)]">$240</span>
          <p className="text-[10px] font-bold text-white/30">EST. BILL</p>
        </div>
      </div>
      
      <div className="h-[220px] md:h-[300px] w-full">
        <Line data={chartData} options={glassChartOptions} />
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {/* Quick Stats Summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex-shrink-0">
          <p className="text-[9px] text-white/40 font-bold">AVG POWER</p>
          <p className="text-sm font-bold text-white">165 kWh</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex-shrink-0">
          <p className="text-[9px] text-white/40 font-bold">PEAK WATER</p>
          <p className="text-sm font-bold text-white">105 L</p>
        </div>
      </div>
    </div>
  );
};

export default Usage;