import axios from "axios";

const API_BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const fetchWeatherData = async (latitude: number, longitude: number) => {
    const params = {
        latitude,
        longitude,
        current_weather: true,
        daily: [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_probability_max",
            "wind_speed_10m_max",
            "wind_gusts_10m_max",
            "rain_sum"
        ],
        hourly: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "weather_code",
            "rain",
            "snowfall",
            "precipitation_probability",
            "surface_pressure",
            "visibility",
            "wind_speed_10m",
        ],
    };

    try {
        console.log("Fetching weather data with params:", params);
        // Make the API request
        const response = await axios.get(API_BASE_URL, { params });
        console.log("Weather API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
};

export { };