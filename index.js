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
  try {
    const response = await fetch(URL, { mode: "cors" });
    const data = await response.json();
    const weatherData = processData(data);
    console.log(weatherData);
  } catch (error) {
    console.log(error);
  }
}

function processData(weatherData) {
  const data = {
    location: weatherData.name,
    minTemp: Math.round(weatherData.main.temp_min),
    maxTemp: Math.round(weatherData.main.temp_max),
    humidity: weatherData.main.humidity,
    description: weatherData.weather[0].description,
  };
  return data;
}

// get wanted location weather
async function getTargetCityWeather() {
  const cityName = document.querySelector("input").value;
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`;
  try {
    const response = await fetch(URL, { mode: "cors" });
    const data = await response.json();
    const locationWeather = processData(data);
    console.log(locationWeather);
    cityName = "";
  } catch (error) {
    console.log(error);
  }
}

document
  .querySelector(".search-btn")
  .addEventListener("click", getTargetCityWeather);

async function getForecast() {
  const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${API_key}`;
  const res = await fetch(URL);
  const data = await res.json();
  console.log(data);
}
