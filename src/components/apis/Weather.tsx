import React, { useState, useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";
import '../../styles/Weather.css'; // Adjust the path to your CSS file // Adjust the path to your icon

const Weather: React.FC = () => {
    const [weather, setWeather] = useState<{
        condition: string;
        temperature: string;
        icon: string;
    }>({
        condition: "Loading...",
        temperature: "--°C",
        icon: "", // Default empty icon
    });

    const weatherCodeMapping: { [key: string]: { image: string; description: string } } = {
        "0": { image: require("../../assets/weather/clear.png"), description: "Clear sky" },
        "01": { image: require("../../assets/weather/few-clouds.png"), description: "Few clouds" },
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

    useEffect(() => {
        const fetchWeatherData = async () => {
            const params = {
                latitude: 36.20,
                longitude: -94.29,
                hourly: [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "dew_point_2m",
                    "apparent_temperature",
                    "wind_speed_10m",
                    "rain",
                    "showers",
                    "snowfall"
                ],
            };
            const url = "https://api.open-meteo.com/v1/forecast";

            try {
                const responses = await fetchWeatherApi(url, params);

                // Process the first location's response
                const response = responses[0];
                const hourly = response.hourly();

                // Extract temperature and weather code
                const temperature2m = hourly?.variables(0)?.valuesArray();
                const weatherCode = hourly?.variables(1)!.valuesArray()!; // Replace with actual weather_code from the API response
                

                const weatherCodeValue = weatherCode[0]// Extract the first value and convert to string
                const weatherDetails = weatherCodeMapping[weatherCodeValue] || {
                    image: "",
                    night: "",
                    description: "Unknown",
                };
                console.log(weatherDetails.image);
                setWeather({
                    condition: weatherDetails.description,
                    temperature: temperature2m ? `${Math.round(temperature2m[0])}°C` : "--°C",
                    icon: `${weatherDetails.image}`, // Adjust the path to your icons folder
                });
            } catch (error) {
                console.error("Error fetching weather data:", error);
                setWeather({ condition: "Error", temperature: "--°C", icon: "" });
            }
        };

        fetchWeatherData();
    }, []);

    return (
        <div className="weather-container">
            <div className="weather-icon">
                {weather.icon ? (
                    <img src={weather.icon} alt="Weather Icon" />
                ) : (
                    <span>No Icon</span>
                )}
            </div>
            <div className="weather">
                <span className="weather-condition">{weather.condition}</span>
                <span className="weather-temperature">{weather.temperature}</span>
            </div>
        </div>
    );
};

export default Weather;