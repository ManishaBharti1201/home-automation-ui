export interface WeatherMapping {
  image: string;
  description: string;
}

export const weatherCodeMapping: Record<string, WeatherMapping> = {
  "0": { image: "/weather/clear.gif", description: "Clear sky" },
  "1": { image: "/weather/mainly-clear.gif", description: "Mainly Clear" },
  "2": { image: "/weather/cloudy.gif", description: "Partly Cloudy" },
  "3": { image: "/weather/overcast.gif", description: "Overcast" },
  "45": { image: "/weather/fog.png", description: "Foggy" },
  "48": { image: "/weather/fog.png", description: "Rime Fog" },
  "51": { image: "/weather/light-rain.gif", description: "Light Drizzle" },
  "53": { image: "/weather/drizzle.gif", description: "Drizzle" },
  "55": { image: "/weather/heavy-drizzle.gif", description: "Heavy Drizzle" },
  "56": { image: "/weather/light-rain.gif", description: "Freezing Drizzle" },
  "57": { image: "/weather/light-rain.gif", description: "Freezing Drizzle" },
  "61": { image: "/weather/light-rain.gif", description: "Light Rain" },
  "63": { image: "/weather/rain.gif", description: "Rain" },
  "65": { image: "/weather/heavy-rain.gif", description: "Heavy Rain" },
  "66": { image: "/weather/freezing-rain.gif", description: "Freezing Rain" },
  "67": { image: "/weather/freezing-rain.gif", description: "Freezing Rain" },
  "71": { image: "/weather/light-snow.gif", description: "Light Snow" },
  "73": { image: "/weather/snowflake.gif", description: "Snow" },
  "75": { image: "/weather/snow-shower.gif", description: "Heavy Snow" },
  "77": { image: "/weather/snow-shower.gif", description: "Snow Grains" },
  "80": { image: "/weather/heavy-rain.gif", description: "Rain Showers" },
  "81": { image: "/weather/heavy.gif", description: "Heavy Showers" },
  "82": { image: "/weather/heavy-rain.gif", description: "Violent Showers" },
  "85": { image: "/weather/snow-shower.gif", description: "Snow Showers" },
  "86": { image: "/weather/snow-shower.gif", description: "Snow Showers" },
  "95": { image: "/weather/thunderstorm.gif", description: "Thunderstorm" },
  "96": { image: "/weather/hail.gif", description: "Storm & Hail" },
  "99": { image: "/weather/storm.gif", description: "Heavy Storm" },
};