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

  getLocationWeather(latitude, longitude);
}

async function getLocationWeather(lat, lon) {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`;
  try {
    const response = await fetch(URL, { mode: "cors" });
    const weatherData = await response.json();
    console.log(weatherData);
    const test = processData(weatherData);
    console.log(test);
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
