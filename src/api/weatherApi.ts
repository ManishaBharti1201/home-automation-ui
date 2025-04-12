import axios from "axios";

const API_BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const fetchWeatherData = async (latitude: number, longitude: number) => {
    const params = {
        latitude,
        longitude,
        hourly: [
            "temperature_2m",
            "relative_humidity_2m",
            "dew_point_2m",
            "apparent_temperature",
            "wind_speed_10m",
            "rain",
            "showers",
            "snowfall",
        ],
    };

    try {
        console.log("Fetching weather data with params:", params);
        // Make the API request
        const response = await axios.get(API_BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
};

export { };