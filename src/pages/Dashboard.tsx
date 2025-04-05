import React, { useState } from 'react';
import { 
  BarChart2, 
  Search, 
  User, 
  Home, 
  Settings, 
  Bell, 
  Plus, 
  Minus, 
  Wifi, 
  Monitor, 
  Volume2, 
  Radio, 
  Power, 
  ThermometerSun
} from 'lucide-react';

const Dashboard = () => {
  const [activeRoom, setActiveRoom] = useState('Living Room');
  const [temperature, setTemperature] = useState(24);
  const [deviceStates, setDeviceStates] = useState({
    'Smart TV': false,
    'Speaker': false,
    'Router': false,
    'WiFi': true,
    'Heater': false,
    'Socket': true
  });

  const rooms = ['Living Room', 'Bath Room', 'Bed Room', 'Movie Room', 'Game Room'];

  type DeviceKey = keyof typeof deviceStates;

  const toggleDevice = (device: DeviceKey) => {
    setDeviceStates(prev => ({
      ...prev,
      [device]: !prev[device]
    }));
  };

  // Monthly energy usage data for the chart
  const energyData = [45, 58, 62, 78, 90, 110, 95, 82, 70, 64, 68, 72];
  const maxEnergy = Math.max(...energyData);
  
  return (
    <div className="bg-black text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-800 rounded-md flex items-center justify-center mr-2">
            <Home size={18} />
          </div>
          <span className="font-bold">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-800 rounded-md p-1">
            <Search size={18} />
          </div>
          <div className="bg-gray-800 rounded-md p-1">
            <Bell size={18} />
          </div>
          <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden">
            <User size={18} className="mx-auto my-1" />
          </div>
        </div>
      </div>

      {/* Room Selector */}
      <div className="px-4 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {rooms.map(room => (
            <button
              key={room}
              className={`px-4 py-1 rounded-full whitespace-nowrap text-sm ${
                activeRoom === room ? 'bg-blue-500' : 'bg-gray-800'
              }`}
              onClick={() => setActiveRoom(room)}
            >
              {room}
            </button>
          ))}
          <button className="px-2 py-1 rounded-full bg-gray-800 whitespace-nowrap text-sm">
            + Add
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {/* Air Conditioner */}
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span>Air Conditioner</span>
            <div className="w-12 h-6 bg-blue-500 rounded-full relative px-1">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-4xl font-bold">
              {temperature}°C
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => setTemperature(prev => Math.min(prev + 1, 30))}
                className="bg-gray-800 w-8 h-8 rounded-md flex items-center justify-center"
              >
                <Plus size={18} />
              </button>
              <button 
                onClick={() => setTemperature(prev => Math.max(prev - 1, 16))}
                className="bg-gray-800 w-8 h-8 rounded-md flex items-center justify-center"
              >
                <Minus size={18} />
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="h-2 bg-gray-800 rounded-full w-full">
              <div 
                className="h-2 bg-blue-500 rounded-full" 
                style={{ width: `${(temperature - 16) * 100 / 14}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>16°C</span>
              <span>30°C</span>
            </div>
          </div>
          
          <div className="flex mt-4 justify-between">
            {['Auto', 'Cool', 'Heat', 'Fan', 'Dry'].map((mode, idx) => (
              <div 
                key={mode} 
                className={`w-8 h-8 rounded-md flex items-center justify-center text-xs ${
                  idx === 0 ? 'bg-blue-500' : 'bg-gray-800'
                }`}
              >
                {mode.charAt(0)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Usage Status */}
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span>Usage Status</span>
            <div className="flex items-center text-xs text-gray-400">
              <span className="mr-2">35.02Kwh</span>
              <span>22h</span>
            </div>
          </div>
          
          <div className="flex items-end h-32 gap-1">
            {energyData.map((value, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full ${idx === 6 ? 'bg-blue-500' : 'bg-gray-700'} rounded-sm`}
                  style={{ height: `${(value / maxEnergy) * 100}%` }}
                ></div>
                <div className="text-xs text-gray-400 mt-1">{idx + 1}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* My Devices */}
        <div className="mb-4">
          <h2 className="font-bold mb-3">My Devices</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Smart TV', icon: Monitor, status: 'Standby' },
              { name: 'Speaker', icon: Volume2, status: 'Standby' },
              { name: 'Router', icon: Wifi, status: 'Active' },
              { name: 'WiFi', icon: Radio, status: 'Active' },
              { name: 'Heater', icon: ThermometerSun, status: 'Standby' },
              { name: 'Socket', icon: Power, status: 'Active' }
            ].map((device) => (
              <div key={device.name} className="bg-gray-900 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <device.icon size={18} />
                  <div className="w-12 h-6 bg-gray-800 rounded-full relative px-1">
                    {device.status && (
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                    )}
                  </div>
                </div>
                <div className="text-sm">{device.name}</div>
                <div className="text-xs text-gray-400">{device.status}</div>
                <div className="text-xs text-gray-400 mt-2">
                  {device.status ? 'On' : 'Off'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Light Control */}
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span>Light</span>
            <div className="w-12 h-6 bg-blue-500 rounded-full relative px-1">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-2 mb-3">
            <div className="text-2xl font-bold">32%</div>
            <div className="flex gap-2">
              <button className="bg-gray-800 w-8 h-8 rounded-md flex items-center justify-center">
                <Minus size={18} />
              </button>
              <button className="bg-gray-800 w-8 h-8 rounded-md flex items-center justify-center">
                <Plus size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-2 bg-gray-800 rounded-full flex-1">
              <div className="h-2 bg-gray-400 rounded-full w-1/3"></div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(dot => (
                <div key={dot} className={`w-1 h-1 rounded-full ${dot <= 3 ? 'bg-white' : 'bg-gray-600'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="flex justify-around items-center p-4 bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
            <Home size={18} />
          </div>
          <span className="text-xs mt-1">Dashboard</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <div className="w-8 h-8 bg-gray-800 rounded-md flex items-center justify-center">
            <BarChart2 size={18} />
          </div>
          <span className="text-xs mt-1">Analytics</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <div className="w-8 h-8 bg-gray-800 rounded-md flex items-center justify-center">
            <Settings size={18} />
          </div>
          <span className="text-xs mt-1">Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;