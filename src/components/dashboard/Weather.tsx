import { useEffect, useState } from "react";
import { fetchWeatherData } from "../../api/weatherApi";
import React from "react";

const weatherCodeMapping: { [key: string]: { image: string; description: string } } = {
    "0": { image: require("../../assets/weather/clear.png"), description: "Clear sky" },
    "1": { image: require("../../assets/weather/mostly_clear_day.png"), description: "Mostly Clear" },
    "2": { image: require("../../assets/weather/partly_cloudy_day.png"), description: "Partly Cloudy" },
    "3": { image: require("../../assets/weather/cloudy.png"), description: "Overcast" },
    "45": { image: require("../../assets/weather/fog.png"), description: "Fog" },
    "48": { image: require("../../assets/weather/fog.png"), description: "Icy Fog" },
    "51": { image: require("../../assets/weather/drizzle.png"), description: "Drizzle" },
    "61": { image: require("../../assets/weather/light_rain.png"), description: "Light Rain" },
    "63": { image: require("../../assets/weather/rain.png"), description: "Rain" },
    "65": { image: require("../../assets/weather/heavy_rain.png"), description: "Heavy Rain" },
    "71": { image: require("../../assets/weather/snow_light.png"), description: "Light Snow" },
    "95": { image: require("../../assets/weather/thunderstorm.png"), description: "Thunderstorm" },
    // ... add others as needed
};

const Weather: React.FC = () => {
    const [weather, setWeather] = useState({
        condition: "Syncing...",
        temperature: "--",
        icon: "",
    });

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Centerton, AR coordinates
                const data: any = await fetchWeatherData(36.36, -94.29); 
                
                // Use current_weather if available, fallback to hourly
                const temp = data.current_weather?.temperature || data.hourly?.temperature_2m?.[0];
                const code = data.current_weather?.weathercode?.toString() || data.hourly?.weather_code?.[0]?.toString() || "0";

                const details = weatherCodeMapping[code] || {
                    image: "",
                    description: "Unknown",
                };

                setWeather({
                    condition: details.description,
                    temperature: temp ? `${Math.round(temp)}°` : "--°",
                    icon: details.image,
                });
            } catch (error) {
                setWeather(prev => ({ ...prev, condition: "Offline" }));
            }
        };

        fetchWeather();
        // Increased interval to 5 minutes to reduce network-driven UI stutters
        const interval = setInterval(fetchWeather, 300000); 
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-5 px-6 py-3 bg-back/40 border border-white/20 rounded-3xl shadow-2xl">
            {/* LARGE ICON - FIXED SIZE */}
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-black/20 border border-white/10">
                {weather.icon ? (
                    <img src={weather.icon} alt="Weather" className="w-10 h-10 object-contain" />
                ) : (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-cyan-400 rounded-full" />
                )}
            </div>

            {/* TEXT CONTENT - BUMPED FOR DISTANCE */}
            <div className="flex flex-col justify-center">
                <span className="text-white font-black text-3xl leading-none italic tracking-tighter">
                    {weather.temperature}
                </span>
                <span className="text-[11px] text-cyan-400 font-black uppercase tracking-[0.2em] mt-1 italic">
                    {weather.condition}
                </span>
            </div>
        </div>
    );
};

export default Weather;