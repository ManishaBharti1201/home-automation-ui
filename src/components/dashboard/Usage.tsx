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
        const response = await axios.get('/api/utility-bills'); // Replace with your actual API endpoint
        const data = response.data as {
          electricity: number[];
          gas: number[];
          water: number[];
        };
        setUtilityData(data);
      } catch (error) {
        console.error('Error fetching utility data:', error);
        console.log("Set dummy data for demonstration");
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

  const chartData = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: 'Electricity (kWh)',
        data: utilityData.electricity,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      {
        label: 'Gas (m³)',
        data: utilityData.gas,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
      {
        label: 'Water (Liters)',
        data: utilityData.water,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Monthly Utility Bills (Electricity, Gas, Water)',
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default Usage;