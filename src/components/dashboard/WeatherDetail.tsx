import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from "../../api/weatherApi";
import { LogEntry } from './Logs';

const weatherCodeMapping: { [key: string]: { image: string; description: string } } = {
    "0": { image: require("../../assets/weather/clear.png"), description: "Clear sky" },
    "1": { image: require("../../assets/weather/clear.png"), description: "Mainly Clear" },
    "2": { image: require("../../assets/weather/clear.png"), description: "Partly Cloudy" },
    "3": { image: require("../../assets/weather/fog.png"), description: "Overcast" },
    "45": { image: require("../../assets/weather/fog.png"), description: "Foggy" },
    "48": { image: require("../../assets/weather/fog.png"), description: "Rime Fog" },
    "51": { image: require("../../assets/weather/drizzle.png"), description: "Light Drizzle" },
    "53": { image: require("../../assets/weather/drizzle.png"), description: "Drizzle" },
    "55": { image: require("../../assets/weather/drizzle.png"), description: "Heavy Drizzle" },
    "61": { image: require("../../assets/weather/drizzle.png"), description: "Light Rain" },
    "63": { image: require("../../assets/weather/drizzle.png"), description: "Rain" },
    "65": { image: require("../../assets/weather/drizzle.png"), description: "Heavy Rain" },
    "71": { image: require("../../assets/weather/fog.png"), description: "Light Snow" },
    "73": { image: require("../../assets/weather/fog.png"), description: "Snow" },
    "75": { image: require("../../assets/weather/fog.png"), description: "Heavy Snow" },
    "77": { image: require("../../assets/weather/fog.png"), description: "Snow Grains" },
    "95": { image: require("../../assets/weather/thunderstorm.png"), description: "Thunderstorm" },
};

interface WeatherDetailProps {
    onLog?: (type: LogEntry['type'], message: string, detail?: string) => void;
}

const WeatherDetail: React.FC<WeatherDetailProps> = ({ onLog }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFullWeather = async () => {
            onLog?.('API', 'Fetching Detailed Forecast', 'Centerton, AR');
            try {
                // Coordinates for Centerton, AR with extended daily/hourly parameters
                // latitude=36.36&longitude=-94.29
                // daily=weather_code,rain_sum,temperature_2m_max,temperature_2m_min,showers_sum,snowfall_sum,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant
                // hourly=temperature_2m,weather_code,rain,snowfall
                const result = await fetchWeatherData(36.36, -94.29);
                setData(result);
                onLog?.('UPDATE', 'Detailed Weather Synced', '7-Day Forecast Ready');
            } catch (err) {
                onLog?.('ERROR', 'Weather Detail Failed', 'Check API status');
            } finally {
                setLoading(false);
            }
        };
        loadFullWeather();
    }, [onLog]);

    if (loading || !data) return null;

    // Extract data from the new expanded API response
    const current = data.current_weather || {};
    const daily = data.daily || { 
        time: [], 
        temperature_2m_max: [], 
        temperature_2m_min: [], 
        weather_code: [],
        precipitation_probability_max: [],
        wind_speed_10m_max: [],
        wind_gusts_10m_max: [],
        rain_sum: []
    };
    
    // Extract the first index of hourly data for current "detailed" stats
    const hourly = data.hourly || { 
        time: [], 
        temperature_2m: [], 
        apparent_temperature: [],
        weather_code: [], 
        rain: [], 
        snowfall: [],
        relative_humidity_2m: [],
        visibility: [],
        surface_pressure: [],
        precipitation_probability: []
    };
    
    const weatherCode = current.weathercode?.toString() || daily.weather_code[0]?.toString() || "0";
    const weatherInfo = weatherCodeMapping[weatherCode] || { description: "Unknown", image: "" };

    const isThunderstormWarning = [95, 96, 99].includes(current.weathercode) || daily.weather_code.some((code: number) => [95, 96, 99].includes(code));

    const StatBox = ({ label, value, unit, icon }: any) => (
        <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center gap-4">
            <span className="text-2xl">{icon}</span>
            <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</p>
                <p className="text-lg font-black text-white italic leading-none mt-1">{value}<span className="text-xs ml-1 opacity-40">{unit}</span></p>
            </div>
        </div>
    );

    return (
        <div className="w-full p-8 rounded-[2.5rem] bg-slate-900/80 backdrop-blur-[30px] border-2 border-white/5 shadow-2xl transition-all relative text-white">
            {isThunderstormWarning && (
                <div className="absolute top-0 left-0 right-0 bg-red-600/80 backdrop-blur-sm text-white text-center py-3 rounded-t-[2.5rem] z-10 flex items-center justify-center gap-3">
                    <span className="text-xl animate-pulse">⚠️</span>
                    <span className="font-bold uppercase tracking-wide">Severe Weather Warning: Thunderstorms Expected!</span>
                    <span className="text-xl animate-pulse">⚠️</span>
                </div>
            )}

            <div className={`${isThunderstormWarning ? 'pt-16' : ''}`}> {/* Adjust padding if warning is present */}
            {/* TOP SECTION: CURRENT FOCUS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                <div className="flex items-center gap-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-[2.5rem] border border-white/10 flex items-center justify-center p-4">
                        <img src={weatherInfo.image} alt="current" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" />
                    </div>
                    <div>
                        <h2 className="text-6xl font-black text-white tracking-tighter italic uppercase leading-none">
                            {Math.round(current.temperature || daily.temperature_2m_max[0])}°C
                        </h2>
                        <div className="flex flex-col">
                            <p className="text-cyan-400 font-black uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                {weatherInfo.description}
                            </p>
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">
                                Feels like {Math.round(hourly.apparent_temperature[0] || current.temperature)}°C
                            </p>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">H: {Math.round(daily.temperature_2m_max[0])}°</span>
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">L: {Math.round(daily.temperature_2m_min[0])}°</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    <StatBox label="Max Wind" value={daily.wind_speed_10m_max[0]} unit="km/h" icon="🌬️" />
                    <StatBox label="Gusts" value={daily.wind_gusts_10m_max[0]} unit="km/h" icon="💨" />
                </div>
            </div>

            {/* MIDDLE SECTION: EXTRA METRICS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col justify-between min-h-[120px]">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest italic">Rain Chance</span>
                    <p className="text-3xl font-black text-white italic mt-2">{hourly.precipitation_probability[0] || daily.precipitation_probability_max[0]}%</p>
                    <div className="h-1.5 w-full bg-white/10 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${hourly.precipitation_probability[0] || daily.precipitation_probability_max[0]}%` }} />
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col justify-between min-h-[120px]">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest italic">Humidity</span>
                    <p className="text-3xl font-black text-white italic mt-2">{hourly.relative_humidity_2m[0]}%</p>
                    <div className="h-1.5 w-full bg-white/10 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${hourly.relative_humidity_2m[0]}%` }} />
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col justify-between min-h-[120px]">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest italic">Visibility</span>
                    <p className="text-3xl font-black text-white italic mt-2">
                        {Math.round((hourly.visibility[0] || 10000) / 1000)}<span className="text-sm ml-1 opacity-40 uppercase">km</span>
                    </p>
                    <p className="text-[10px] font-bold text-white/20 uppercase mt-auto">Horizon Range</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col justify-between min-h-[120px]">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest italic">Pressure</span>
                    <p className="text-3xl font-black text-white italic mt-2">
                        {Math.round(hourly.surface_pressure[0] || 1012)}<span className="text-sm ml-1 opacity-40 uppercase">hPa</span>
                    </p>
                    <p className="text-[10px] font-bold text-white/20 uppercase mt-auto">Surface Level</p>
                </div>
            </div>

            {/* BOTTOM SECTION: WEEKLY FORECAST */}
            <div className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-[2px] bg-cyan-400" />
                    <h3 className="text-lg font-black text-white uppercase tracking-[0.2em] italic">Weekly Forecast</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                    {daily.time.slice(1).map((time: string, i: number) => {
                        const code = daily.weather_code[i + 1]?.toString();
                        const info = weatherCodeMapping[code] || { image: "", description: "---" };
                        const date = new Date(time);
                        const precipProb = daily.precipitation_probability_max[i + 1];
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                        const isWeekend = dayName === 'Sat' || dayName === 'Sun';

                        return (
                            <div key={time} className="group relative flex flex-col items-center p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300">
                                <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isWeekend ? 'text-indigo-400' : 'text-white/40'}`}>
                                    {dayName}
                                </p>
                                <div className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <img src={info.image} alt="day" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-lg font-black text-white italic leading-none">
                                        {Math.round(daily.temperature_2m_max[i + 1])}°
                                    </p>
                                    <p className="text-[10px] font-bold text-white/20 mt-1 uppercase tracking-tighter">
                                        {Math.round(daily.temperature_2m_min[i + 1])}°
                                    </p>
                                    <p className="text-[9px] font-black text-cyan-400 mt-2">{precipProb}% 💧</p>
                                </div>
                                <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity pointer-events-none" />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* HOURLY FORECAST */}
            <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-[2px] bg-cyan-400" />
                    <h3 className="text-lg font-black text-white uppercase tracking-[0.2em] italic">Hourly Forecast</h3>
                </div>
                <div className="flex overflow-x-auto pb-4 space-x-4 no-scrollbar">
                    {hourly.time.slice(0, 24).map((time: string, i: number) => {
                        const hour = new Date(time);
                        const temp = hourly.temperature_2m[i];
                        const code = hourly.weather_code[i]?.toString();
                        const info = weatherCodeMapping[code] || { image: "", description: "---" };
                        const rainAmount = hourly.rain[i];
                        const snowfallAmount = hourly.snowfall[i];

                        const isSignificantPrecipitation = rainAmount > 0.1 || snowfallAmount > 0.1;

                        // Current hour formatting using native JS
                        const hourString = hour.toLocaleTimeString([], { hour: 'numeric', hour12: true }).toLowerCase().replace(' ', '');

                        return (
                            <div key={time} className="flex-none w-32 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center group hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300">
                                <p className="text-sm font-bold text-white/60 mb-2">{hourString}</p>
                                <div className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform duration-300">
                                    <img src={info.image} alt="hourly weather" className="w-full h-full object-contain" />
                                </div>
                                <p className="text-xl font-black text-white italic leading-none">{Math.round(temp)}°C</p>
                                {isSignificantPrecipitation && (
                                    <p className="text-xs font-bold text-cyan-400 mt-1">
                                        {rainAmount > 0.1 ? `${rainAmount.toFixed(1)}mm` : ''}
                                        {snowfallAmount > 0.1 ? `${snowfallAmount.toFixed(1)}cm` : ''}
                                    </p>
                                )}
                                <p className="text-[10px] font-bold text-white/30 uppercase mt-1">{info.description}</p>
                                <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
                            </div>
                        );
                    })}
                </div>
            </div>

            </div>
        </div>
    );
};

export default WeatherDetail;