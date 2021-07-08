// Global variables
const API_key = "7ad8fbf6434376408725f165c56e002d";
let latitude;
let longitude;
const celsius = "&#8451";

// Selectors and event listeners
document.querySelector(".search-btn").addEventListener("click", (e) => {
  showForecast();
});

// Functions
getUserLocation();

function getUserLocation() {
  if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(
      successfulLookup,
      defaultLookup
    );
  }
}

async function successfulLookup(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  const city = await getLocationName(latitude, longitude);
  const cityWeather = await getCurrentWeather(city);
  showCurrentWeather(cityWeather);
}

async function defaultLookup() {
  let city = "Boston";
  const cityWeather = await getCurrentWeather(city);
  showCurrentWeather(cityWeather);
}

async function getLocationName(lat, lon) {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`;
  try {
    const response = await fetch(URL, { mode: "cors" });
    const data = await response.json();
    const locationName = data.name;
    return locationName;
  } catch (error) {
    console.log(error);
  }
}

async function getCurrentWeather(city) {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`;
  try {
    const response = await fetch(URL, { mode: "cors" });
    const data = await response.json();
    const currentWeatherData = processData(data);
    return currentWeatherData;
  } catch (error) {
    console.log(error);
  }
}

function showCurrentWeather(weatherInfo) {
  const weatherIcon = document.querySelector(".weather-icon");
  const weatherDescription = document.querySelector(".weather-description");
  const locationName = document.querySelector(".location-name");
  const currentTemp = document.querySelector(".current-temp");
  const maxTemp = document.querySelector(".max-temp");
  const minTemp = document.querySelector(".min-temp");

  weatherIcon.src = `icons/${weatherInfo.icon}.png`;
  weatherDescription.innerHTML = weatherInfo.description;
  locationName.innerHTML = `${weatherInfo.location}, ${weatherInfo.country}`;
  currentTemp.innerHTML = weatherInfo.currentTemp + celsius;
  maxTemp.innerHTML = weatherInfo.maxTemp + celsius;
  minTemp.innerHTML = weatherInfo.minTemp + celsius;
}

async function showForecast() {
  // get and display forecast data for searched place
  const coordinates = await getCoordinates();
  const forecastData = await getForecastData(coordinates);
  const forecastArray = processForecastData(forecastData);
  displayForecast(forecastArray);
  // get and display searched place current weather
  const city = await getLocationName(coordinates.lat, coordinates.lon);
  const cityWeather = await getCurrentWeather(city);
  showCurrentWeather(cityWeather);
}

async function getCoordinates() {
  const cityName = document.querySelector("input");
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.value}&appid=${API_key}&units=metric`;
  try {
    const response = await fetch(URL);
    const data = await response.json();
    cityName.value = "";
    const coord = {
      lat: data.coord.lat,
      lon: data.coord.lon,
    };
    return coord;
  } catch (error) {
    console.log(error);
  }
}

async function getForecastData(coordinates) {
  const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&appid=${API_key}&units=metric`;
  try {
    const res = await fetch(URL);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

function processData(weatherData) {
  const data = {
    location: weatherData.name,
    country: weatherData.sys.country,
    currentTemp: Math.round(weatherData.main.temp),
    minTemp: Math.round(weatherData.main.temp_min),
    maxTemp: Math.round(weatherData.main.temp_max),
    description: weatherData.weather[0].description,
    icon: weatherData.weather[0].icon,
  };
  return data;
}

function processForecastData(forecastData) {
  let weekForecasts = forecastData.daily;
  let forecastArray = [];

  weekForecasts.forEach((forecast, index) => {
    // exclude today's data
    if (index > 0) {
      let dayName = new Date(forecast.dt * 1000).toLocaleDateString("en", {
        weekday: "long",
      });
      const dayForecast = {
        minTemp: Math.round(forecast.temp.min),
        maxTemp: Math.round(forecast.temp.max),
        description: forecast.weather[0].description,
        icon: forecast.weather[0].icon,
        day: dayName,
      };
      forecastArray.push(dayForecast);
    }
    return forecastArray;
  });

  return forecastArray;
}

function displayForecast(forecast) {
  const forecastContainer = document.querySelector(".cards-wrapper");
  forecastContainer.innerHTML = " ";
  for (let day of forecast) {
    createForecastCard(day);
  }
}

function createForecastCard(object) {
  const card = document.createElement("div");
  card.className = "card";
  const header = document.createElement("h2");
  header.className = "weather-day";
  header.innerHTML = object.day;
  card.appendChild(header);
  const cardBottom = document.createElement("div");
  cardBottom.className = "card-bottom";
  card.appendChild(cardBottom);
  const iconWrapper = document.createElement("div");
  iconWrapper.className = "weather-icon";
  const weatherIcon = document.createElement("img");
  weatherIcon.src = `icons/${object.icon}.png`;
  iconWrapper.appendChild(weatherIcon);
  cardBottom.appendChild(iconWrapper);
  const infoContainer = document.createElement("div");
  infoContainer.className = "info";
  cardBottom.appendChild(infoContainer);
  const weatherDescription = document.createElement("p");
  weatherDescription.innerHTML = object.description;
  infoContainer.appendChild(weatherDescription);
  const maxTemp = document.createElement("h4");
  maxTemp.innerHTML = "Highest: " + object.maxTemp + celsius;
  infoContainer.appendChild(maxTemp);
  const minTemp = document.createElement("h5");
  minTemp.innerHTML = "Lowest: " + object.minTemp + celsius;
  infoContainer.appendChild(minTemp);

  const cardContainer = document.querySelector(".cards-wrapper");
  cardContainer.appendChild(card);
}
