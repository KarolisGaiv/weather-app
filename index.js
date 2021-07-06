// Global variables
const API_key = "7ad8fbf6434376408725f165c56e002d";
let latitude;
let longitude;
const celsius = "&#8451";

// Selectors and event listeners
document.querySelector(".search-btn").addEventListener("click", getForecast);

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

function successfulLookup(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  getCurrrentLocationWeather(latitude, longitude);
}

function defaultLookup() {
  getDefaultCityWeather();
}

async function getCurrrentLocationWeather(lat, lon) {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`;
  const weatherDescription = document.querySelector(".weather-description");
  const locationName = document.querySelector(".location-name");
  const currentTemp = document.querySelector(".current-temp");
  const maxTemp = document.querySelector(".max-temp");
  const minTemp = document.querySelector(".min-temp");
  try {
    const response = await fetch(URL, { mode: "cors" });
    const data = await response.json();
    console.log(data);
    const weatherData = processData(data);
    weatherDescription.innerHTML = weatherData.description;
    locationName.innerHTML = `${weatherData.location}, ${weatherData.country}`;
    currentTemp.innerHTML = weatherData.currentTemp + celsius;
    maxTemp.innerHTML = weatherData.maxTemp + celsius;
    minTemp.innerHTML = weatherData.minTemp + celsius;
    console.log(weatherData);
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

async function getDefaultCityWeather() {
  const defaultCity = "Harare";
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${API_key}&units=metric`;
  const weatherDescription = document.querySelector(".weather-description");
  const locationName = document.querySelector(".location-name");
  const currentTemp = document.querySelector(".current-temp");
  const maxTemp = document.querySelector(".max-temp");
  const minTemp = document.querySelector(".min-temp");
  try {
    const response = await fetch(URL, { mode: "cors" });
    const data = await response.json();
    const weatherData = processData(data);
    weatherDescription.innerHTML = weatherData.description;
    locationName.innerHTML = `${weatherData.location}, ${weatherData.country}`;
    currentTemp.innerHTML = weatherData.currentTemp + celsius;
    maxTemp.innerHTML = weatherData.maxTemp + celsius;
    minTemp.innerHTML = weatherData.minTemp + celsius;
  } catch (error) {
    console.log(error);
  }
}

async function getForecast() {
  const card = document.querySelector(".card");
  const cityCoordinates = await getCoordinates();
  const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityCoordinates.lat}&lon=${cityCoordinates.lon}&exclude=minutely,hourly,alerts&appid=${API_key}`;
  const res = await fetch(URL);
  const data = await res.json();
  console.log(data);
  card.innerHTML = data.daily[0].temp.max;
}

async function getCoordinates() {
  const targetCity = document.querySelector("input");
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${targetCity.value}&appid=${API_key}&units=metric`;
  const response = await fetch(URL);
  const data = await response.json();
  targetCity.value = "";
  const coord = {
    lat: data.coord.lat,
    lon: data.coord.lon,
  };
  return coord;
}
