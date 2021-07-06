const API_key = "7ad8fbf6434376408725f165c56e002d";
let latitude;
let longitude;

getLocation();

function getLocation() {
  if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(
      successfulLookup,
      console.log
    );
  }
}

function successfulLookup(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  getCurrrentLocationWeather(latitude, longitude);
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
    currentTemp.innerHTML = weatherData.currentTemp;
    maxTemp.innerHTML = weatherData.maxTemp;
    minTemp.innerHTML = weatherData.minTemp;
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
    humidity: weatherData.main.humidity,
    description: weatherData.weather[0].description,
    icon: weatherData.weather[0].icon,
  };
  return data;
}

// get wanted location weather
async function getTargetCityWeather() {
  let cityName = document.querySelector("input");
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.value}&appid=${API_key}&units=metric`;
  try {
    const response = await fetch(URL, { mode: "cors" });
    const data = await response.json();
    const locationWeather = processData(data);
    console.log(data);
    cityName.value = "";
  } catch (error) {
    console.log(error);
  }
}

document.querySelector(".search-btn").addEventListener("click", getForecast);

async function getForecast() {
  const card = document.querySelector(".card");
  const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${API_key}`;
  const res = await fetch(URL);
  const data = await res.json();
  card.innerHTML = data.daily[0].temp.max;
  // const weatherForecast = processData(data);
  // console.log(weatherForecast);
  console.log(data);
}
