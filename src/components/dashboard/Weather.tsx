import { useEffect, useState } from "react";
import { fetchWeatherData } from "../../api/weatherApi";
import React from "react";

// Move weatherCodeMapping outside the component
const weatherCodeMapping: { [key: string]: { image: string; description: string } } = {
    "0": { image: require("../../assets/weather/clear.png"), description: "Clear sky" },
    "1": { image: require("../../assets/weather/few-clouds.png"), description: "Few clouds" },
    "45": { image: require("../../assets/weather/fog.png"), description: "Scattered clouds" },
    "51": { image: require("../../assets/weather/fog.png"), description: "Broken clouds" },
    "56": { image: require("../../assets/weather/fog.png"), description: "Shower rain" },
    "61": { image: require("../../assets/weather/fog.png"), description: "Rain" },
    "67": { image: require("../../assets/weather/thunderstorm.png"), description: "Thunderstorm" },
    "71": { image: require("../../assets/weather/fog.png"), description: "Snow" },
    "77": { image: require("../../assets/weather/fog.png"), description: "Mist" },
    "80": { image: require("../../assets/weather/fog.png"), description: "Thunderstorm" },
    "85": { image: require("../../assets/weather/fog.png"), description: "Snow" },
    "95": { image: require("../../assets/weather/fog.png"), description: "Mist" },
    "96": { image: require("../../assets/weather/fog.png"), description: "Mist" },
};

const Weather: React.FC = () => {
    const [weather, setWeather] = useState<{
        condition: string;
        temperature: string;
        icon: string;
    }>({
        condition: "Loading...",
        temperature: "--°C",
        icon: "",
    });

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const data = await fetchWeatherData(36.2, -94.29); // Pass latitude and longitude
                const hourly = (data as { hourly: { temperature_2m: number[]; weather_code: string[] } }).hourly;

                // Extract temperature and weather code
                const temperature2m = hourly?.temperature_2m?.[0];
                const weatherCode = hourly?.weather_code?.[0]; // Replace with actual weather_code from the API response

                const weatherCodeValue = weatherCode || "0"; // Default to "0" if no weather code is available
                const weatherDetails = weatherCodeMapping[weatherCodeValue] || {
                    image: "",
                    description: "Unknown",
                };

                setWeather({
                    condition: weatherDetails.description,
                    temperature: temperature2m ? `${Math.round(temperature2m)}°C` : "--°C",
                    icon: weatherDetails.image,
                });
            } catch (error) {
                console.error("Error fetching weather data:", error);
                setWeather({ condition: "Error", temperature: "--°C", icon: "" });
            }
        };

        // Fetch weather immediately
        fetchWeather();

        // Set up an interval to fetch weather every 30 seconds
        const interval = setInterval(fetchWeather, 30000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []); // No need to include weatherCodeMapping in the dependency array

    return (
        <div className="weather-container" style={{ display: "flex", alignItems: "center" }}>
            <div className="weather-icon">
                {weather.icon ? (
                    <img src={weather.icon} alt="Weather Icon" />
                ) : (
                    <span>No Icon</span>
                )}
            </div>
            <div className="weather">
                <div className="weather-condition">{weather.condition}</div>
                <div className="weather-temperature">{weather.temperature}</div>
            </div>
        </div>
    );
};

export default Weather;