var searchFormEl = document.querySelector("#search-form");
var cityLookupEl = document.querySelector("#city-lookup");
var currentWeatherEl = document.querySelector("#current-weather");
var dailyHeadlineEl = document.querySelector("#daily-headline");
var forecastEl = document.querySelector("#five-day");
var historyEl = document.querySelector("#search-history");
var search = [];
function formSubmitHandler(event) {
  // Prevent page from refreshing
  event.preventDefault();

  // Get value from input element
  var city = cityLookupEl.value.trim();

  if (city) {
    getCoordinates(city);

    // Clear old content
    currentWeatherEl.textContent = "";
    dailyHeadlineEl.textContent = "";
    forecastEl.textContent = "";
    cityLookupEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

function getCoordinates(city) {
  saveData(city);

  // OpenWeather One Call API uses city entered by user
  var cityApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=de9cd9d56e193581933f3ce342ee3860";

  fetch(cityApi)
    .then(function (response) {
      return response.json();

    }).then(function (data) {
      // Set latitude and longitude information from city to variables
      lat = data.coord.lat;
      lon = data.coord.lon;
      getWeather(data);
    })
}

function getWeather(data) {
  // Use lat and long variables to get current conditions and seven day weather
  console.log(data);
  var city = data.name;
  var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=de9cd9d56e193581933f3ce342ee3860";

  fetch(weatherApi)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        alert("Error: City not found");
      }
    }).then(function (data) {
      console.log(data);
      renderCurrentResults(data, city);
    })
    .catch(function (error) {
      alert("Unable to connect");
    });
}

function renderCurrentResults(data, city) {
  currentWeatherEl.setAttribute("class", "outline");

  // src for the weather icon img
  var iconUrl = "https://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png";
  var iconDescription = data.current.weather[0].description;

  // Convert unix timestamp into human-readable time (reference: MDN contributors)
  var currentDate = new Date(data.current.dt * 1000).toLocaleDateString("en-US");

  // New dynamic HTML elements for current conditions
  var currentInfoEl = document.createElement("h2");
  var currentIconEl = document.createElement("img");
  var currentTempEl = document.createElement("p");
  var currentWindEl = document.createElement("p");
  var currentHumidityEl = document.createElement("p");
  var currentUvEl = document.createElement("p");
  var uvIndexEl = document.createElement("span");

  // Set src and alt for weather icon img
  currentIconEl.setAttribute("src", iconUrl);
  currentIconEl.setAttribute("alt", iconDescription);

  // Color-code UV Index (reference: World Health Organization)
  if (data.current.uvi < 3) {
    $(uvIndexEl).addClass("uv-mild");
  } else if (data.current.uvi >= 3 && data.current.uvi < 6) {
    $(uvIndexEl).addClass("uv-moderate");
  } else if (data.current.uvi >= 6 && data.current.uvi < 8) {
    $(uvIndexEl).addClass("uv-severe");
  } else if (data.current.uvi >= 8 && data.current.uvi < 11) {
    $(uvIndexEl).addClass("uv-super-severe");
  } else {
    $(uvIndexEl).addClass("uv-extreme");
  }

  // Set content for dynamic elements
  currentInfoEl.textContent = city + " " + currentDate;
  currentTempEl.textContent = "Temp: " + data.current.temp + "°F";
  currentWindEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
  currentHumidityEl.textContent = "Humidity: " + data.current.humidity + "%";
  currentUvEl.textContent = "UV Index: ";
  uvIndexEl.textContent = data.current.uvi;

  // Clear any previous data
  currentWeatherEl.innerHTML = "";

  // Print city, date and current conditions to page
  currentWeatherEl.appendChild(currentInfoEl);
  currentInfoEl.appendChild(currentIconEl);
  currentWeatherEl.appendChild(currentTempEl);
  currentWeatherEl.appendChild(currentWindEl);
  currentWeatherEl.appendChild(currentHumidityEl);
  currentWeatherEl.appendChild(currentUvEl);
  currentUvEl.appendChild(uvIndexEl);

  renderDailyWeather(data);
}

function renderDailyWeather(data) {
  dailyHeadlineEl.textContent = "5-Day Forecast:"

  forecastEl.innerHTML = "";

  for (var i = 1; i < 6; i++) {
    // Dynamically create divs to hold five-day forecast
    var dailyDiv = document.createElement("div");
    forecastEl.append(dailyDiv);
    dailyDiv.setAttribute("class", "col-sm daily");

    // src and alt for the weather icon img
    var forecastIconUrl = "https://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png";
    var forecastIconDescription = data.daily[i].weather[0].description;

    // Convert unix timecode into human-readable time
    var date = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");

    // Dynamic HTML elements for five-day forecast
    var dateH4 = document.createElement("h4");
    var iconNewLine = document.createElement("p");
    var forecastIconEl = document.createElement("img");
    var dailyTempEl = document.createElement("p");
    var dailyWindEl = document.createElement("p");
    var dailyHumidityEl = document.createElement("p");

    // Set src and alt for weather icon img
    forecastIconEl.setAttribute("src", forecastIconUrl);
    forecastIconEl.setAttribute("alt", forecastIconDescription);

    // Set content for dynamic elements
    dateH4.textContent = date;
    dailyTempEl.textContent = "Temp: " + data.daily[i].temp.day + "°F";
    dailyWindEl.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
    dailyHumidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";

    // Print city, date and forecast to page
    dailyDiv.append(dateH4);
    dailyDiv.appendChild(iconNewLine);
    iconNewLine.appendChild(forecastIconEl);
    dailyDiv.appendChild(dailyTempEl);
    dailyDiv.appendChild(dailyWindEl);
    dailyDiv.appendChild(dailyHumidityEl);
  }
}

// Save weather data to localStorage
function saveData(data) {
  search.push(data);
  localStorage.setItem("search-history", JSON.stringify(data));
  renderSearchHistory();
}

// Create dynamic buttons storing the city searched
function renderSearchHistory() {
  historyEl.innerHTML = "";
  for (var i = search.length - 1; i >= 0; i--) {
    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.textContent = search[i];
    button.setAttribute("data-search", search[i]);
    button.setAttribute("class", "history-btn");
    historyEl.appendChild(button);
  }
}

// Handles dynaminc buttons in search history
function handleSearchHistory(e) {
  if (!e.target.matches(".history-btn")) {
    return
  }

  var historyBtn = e.target;
  var search = historyBtn.getAttribute("data-search");
  getCoordinates(search);
}

// Add event listener to form
searchFormEl.addEventListener("submit", formSubmitHandler);

// Add event listener to city search dynamic buttons
historyEl.addEventListener("click", handleSearchHistory);