import { useEffect, useState } from "react";
import { fetchWeatherData } from "../../api/weatherApi";
import "../../styles/Weather.css"; // Assuming you have a CSS file for styling
import React from "react";

// Move weatherCodeMapping outside the component
const weatherCodeMapping: { [key: string]: { image: string; description: string } } = {
    "0": { image: require("../../assets/weather/clear.png"), description: "Clear sky" },
    "1": { image: require("../../assets/weather/mostly_clear_day.png"), description: "Mostly Clear" },
    "2": { image: require("../../assets/weather/partly_cloudy_day.png"), description: "Partly Cloudy" },
    "3": { image: require("../../assets/weather/cloudy.png"), description: "Overcast" },
    "45": { image: require("../../assets/weather/fog.png"), description: "Fog" },
    "48": { image: require("../../assets/weather/fog.png"), description: "Icy Fog" },
    "51": { image: require("../../assets/weather/drizzle.png"), description: "Little Drizzle" },
    "53": { image: require("../../assets/weather/drizzle.png" ), description: "Drizzle" },
    "55": { image: require("../../assets/weather/drizzle.png"), description: "High Drizzle" },
    "80": { image: require("../../assets/weather/showers.png"), description: "Little Shower" },
    "81": { image: require("../../assets/weather/showers.png"), description: "Shower" },
    "82": { image: require("../../assets/weather/showers.png"), description: "High Shower" },
    "61": { image: require("../../assets/weather/light_rain.png"), description: "Little Rain" },
    "63": { image: require("../../assets/weather/rain.png"), description: "Rain" },
    "65": { image: require("../../assets/weather/heavy_rain.png"), description: "High Rain" },
    "56": { image: require("../../assets/weather/flurries.png"), description: "Little Icy Drizzle" },
    "57": { image: require("../../assets/weather/flurries.png"), description: "Icy Drizzle" },
    "66": { image: require("../../assets/weather/rain_with_snow_light.png"), description: "Little Icy Rain" },
    "67": { image: require("../../assets/weather//rain_with_snow_light.png"), description: "Icy Rain" },
    "77": { image: require("../../assets/weather/snow.png"), description: "Snowy Grains" },
    "85": { image: require("../../assets/weather/snow_with_rain_light.png"), description: "Little Snow Showers" },
    "86": { image: require("../../assets/weather/snow_with_rain_light.png"), description: "Snow Showers" },
    "71": { image: require("../../assets/weather/snow_light.png"), description: "Little Snow" },
    "73": { image: require("../../assets/weather/snow.png"), description: "Snow" },
    "75": { image: require("../../assets/weather/snow_heavy.png"), description: "High Snow" },
    "95": { image: require("../../assets/weather/thunderstorm.png"), description: "Thunderstorm" },
    "96": { image: require("../../assets/weather/strong_tstorms.png"), description: "Thunderstorm + Little Hail" },
    "99": { image: require("../../assets/weather/thunderstorm.png"), description: "Thunderstorm + Hail" },
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
console.log("Weather Code:", weatherCode); // Debugging line
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