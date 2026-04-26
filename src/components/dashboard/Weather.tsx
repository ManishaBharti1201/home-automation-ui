import { useEffect, useState } from "react";
import { fetchWeatherData } from "../../api/weatherApi";
import React from "react";

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
    "56": { image: require("../../assets/weather/drizzle.png"), description: "Freezing Drizzle" },
    "57": { image: require("../../assets/weather/drizzle.png"), description: "Freezing Drizzle" },
    "61": { image: require("../../assets/weather/drizzle.png"), description: "Light Rain" },
    "63": { image: require("../../assets/weather/drizzle.png"), description: "Rain" },
    "65": { image: require("../../assets/weather/drizzle.png"), description: "Heavy Rain" },
    "66": { image: require("../../assets/weather/drizzle.png"), description: "Freezing Rain" },
    "67": { image: require("../../assets/weather/drizzle.png"), description: "Freezing Rain" },
    "71": { image: require("../../assets/weather/fog.png"), description: "Light Snow" },
    "73": { image: require("../../assets/weather/fog.png"), description: "Snow" },
    "75": { image: require("../../assets/weather/fog.png"), description: "Heavy Snow" },
    "77": { image: require("../../assets/weather/fog.png"), description: "Snow Grains" },
    "80": { image: require("../../assets/weather/drizzle.png"), description: "Rain Showers" },
    "81": { image: require("../../assets/weather/drizzle.png"), description: "Heavy Showers" },
    "82": { image: require("../../assets/weather/drizzle.png"), description: "Violent Showers" },
    "85": { image: require("../../assets/weather/fog.png"), description: "Snow Showers" },
    "86": { image: require("../../assets/weather/fog.png"), description: "Snow Showers" },
    "95": { image: require("../../assets/weather/thunderstorm.png"), description: "Thunderstorm" },
    "96": { image: require("../../assets/weather/thunderstorm.png"), description: "Storm & Hail" },
    "99": { image: require("../../assets/weather/thunderstorm.png"), description: "Heavy Storm" },
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
                
                // Use current_weather if available, fallback to hourly
                const temp = data.current_weather?.temperature || data.hourly?.temperature_2m?.[0];
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