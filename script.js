const apiKey = "a337983d5f925cddb713b1f69c4a5500";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const getLocationBtn = document.getElementById("getLocation");

async function checkWeather(city) {
  let url = `${apiUrl}&q=${city}&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("API Response:", data);
    updateWeatherUI(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.querySelector(".error").innerHTML =
      "Error fetching weather data. Please try again.";
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  }
}

function updateWeatherUI(data) {
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

  const weatherMain = data.weather[0].main.toLowerCase();
  const weatherDescription = data.weather[0].description.toLowerCase();
  console.log("Weather condition:", weatherMain);
  console.log("Weather description:", weatherDescription);

  const iconMap = {
    clouds: "clouds.png",
    clear: "clear.png",
    rain: "rain.png",
    drizzle: "drizzle.png",
    mist: "mist.png",
    haze: "mist.png", // Adding haze, which is common in Kolkata
    smoke: "mist.png", // Adding smoke, also possible in Kolkata
  };

  if (iconMap[weatherMain]) {
    weatherIcon.src = iconMap[weatherMain];
  } else if (iconMap[weatherDescription]) {
    weatherIcon.src = iconMap[weatherDescription];
  } else {
    weatherIcon.src = "default.png";
  }

  console.log("Icon set to:", weatherIcon.src);

  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";
}

async function getLocationWeather(lat, lon) {
  const url = `${apiUrl}&lat=${lat}&lon=${lon}&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Geolocation API Response:", data);
    updateWeatherUI(data);
  } catch (error) {
    console.error("Error fetching weather data for location:", error);
    document.querySelector(".error").innerHTML =
      "Error fetching weather data for your location. Please try again.";
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log("Geolocation coordinates:", lat, lon);
        getLocationWeather(lat, lon);
      },
      (error) => {
        console.error("Geolocation error:", error);
        document.querySelector(".error").innerHTML =
          "Unable to retrieve your location: " + error.message;
        document.querySelector(".error").style.display = "block";
      }
    );
  } else {
    document.querySelector(".error").innerHTML =
      "Geolocation is not supported by this browser";
    document.querySelector(".error").style.display = "block";
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value);
  }
});

getLocationBtn.addEventListener("click", getLocation);

// Get weather for user's location on page load
window.addEventListener("load", getLocation);
