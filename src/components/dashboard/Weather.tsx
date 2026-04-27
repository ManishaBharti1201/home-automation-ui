import { useEffect, useState } from "react";
import { fetchWeatherData } from "../../api/weatherApi";
import React from "react";

const weatherCodeMapping: { [key: string]: { image: string; description: string } } = {
    "0": { image: "/weather/clear.gif", description: "Clear sky" },
    "1": { image: "/weather/clear.gif", description: "Mainly Clear" },
    "2": { image: "/weather/clear.gif", description: "Partly Cloudy" },
    "3": { image: "/weather/fog.png", description: "Overcast" },
    "45": { image: "/weather/fog.gif", description: "Foggy" },
    "48": { image: "/weather/fog.gif", description: "Rime Fog" },
    "51": { image: "/weather/light-rain.gif", description: "Light Drizzle" },
    "53": { image: "/weather/light-rain.gif", description: "Drizzle" },
    "55": { image: "/weather/light-rain.gif", description: "Heavy Drizzle" },
    "56": { image: "/weather/light-rain.gif", description: "Freezing Drizzle" },
    "57": { image: "/weather/light-rain.gif", description: "Freezing Drizzle" },
    "61": { image: "/weather/light-rain.gif", description: "Light Rain" },
    "63": { image: "/weather/rain.gif", description: "Rain" },
    "65": { image: "/weather/heavy-rain.gif", description: "Heavy Rain" },
    "66": { image: "/weather/freezing-rain.gif", description: "Freezing Rain" },
    "67": { image: "/weather/freezing-rain.gif", description: "Freezing Rain" },
    "71": { image: "/weather/light-snow.gif", description: "Light Snow" },
    "73": { image: "/weather/fog.gif", description: "Snow" },
    "75": { image: "/weather/fog.gif", description: "Heavy Snow" },
    "77": { image: "/weather/fog.gif", description: "Snow Grains" },
    "80": { image: "/weather/heavy-rain.gif", description: "Rain Showers" },
    "81": { image: "/weather/heavy-rain.gif", description: "Heavy Showers" },
    "82": { image: "/weather/heavy-rain.gif", description: "Violent Showers" },
    "85": { image: "/weather/fog.gif", description: "Snow Showers" },
    "86": { image: "/weather/fog.gif", description: "Snow Showers" },
    "95": { image: "/weather/thunderstorm.gif", description: "Thunderstorm" },
    "96": { image: "/weather/thunderstorm.gif", description: "Storm & Hail" },
    "99": { image: "/weather/thunderstorm.gif", description: "Heavy Storm" },
};

interface WeatherProps {
    onConditionChange?: (code: string) => void;
    onLog?: (type: 'API' | 'UPDATE' | 'SYSTEM' | 'ERROR', message: string, detail?: string) => void;
}

const Weather: React.FC<WeatherProps> = ({ onConditionChange, onLog }) => {
    const [weather, setWeather] = useState({
        condition: "Syncing...",
        temperature: "--",
        icon: "",
    });

    useEffect(() => {
        const fetchWeather = async () => {
            onLog?.('API', 'Fetching weather data', 'GET /v1/forecast');
            try {
                // Centerton, AR coordinates
                const data: any = await fetchWeatherData(36.36, -94.29); 
                console.log("[Weather.tsx] Received API data:", data);
                
                // Use current_weather if available, fallback to the hourly slot closest to now
                const now = new Date();
                const currentHourIndex = data.hourly?.time.findIndex((t: string) => {
                    const time = new Date(t);
                    return time.getTime() >= now.getTime() - 1800000; // Find slot within 30 mins of now
                }) || 0;

                const temp = data.current_weather?.temperature || data.hourly?.temperature_2m?.[currentHourIndex];
                const code = data.current_weather?.weathercode?.toString() || data.hourly?.weather_code?.[0]?.toString() || "0";

                if (onConditionChange) {
                    onConditionChange(code);
                }

                const details = weatherCodeMapping[code] || {
                    image: "",
                    description: "Unknown",
                };

                setWeather({
                    condition: details.description,
                    temperature: temp ? `${Math.round(temp)}°C` : "--°C",
                    icon: details.image,
                });
                onLog?.('UPDATE', 'Weather updated', details.description);
            } catch (error) {
                onLog?.('ERROR', 'Weather API Failure', 'Service offline');
                setWeather(prev => ({ ...prev, condition: "Offline" }));
            }
        };

        fetchWeather();
        // Update weather data every hour (3600000 ms)
        const interval = setInterval(fetchWeather, 3600000); 
        return () => clearInterval(interval);
    }, [onConditionChange, onLog]);

    return (
        <div className="flex items-center gap-5 px-6 py-3 bg-white/5 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md">
            {/* LARGE ICON - FIXED SIZE */}
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-transparent border border-white/20 shadow-inner">
                {weather.icon ? (
                    <img src={weather.icon} alt="Weather" className="w-full h-full object-contain" />
                ) : (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-cyan-400 rounded-full" />
                )}
            </div>

            {/* TEXT CONTENT - BUMPED FOR DISTANCE */}
            <div className="flex flex-col justify-center">
                <span className="text-white font-black text-3xl leading-none italic tracking-tighter">
                    {weather.temperature}
                </span>
                <span className="text-[15px] text-cyan-400 font-black uppercase tracking-[0.2em] mt-1 italic">
                    {weather.condition}
                </span>
            </div>
        </div>
    );
};

export default Weather;