var searchEl = document.querySelector("#search");
var cityLookUpEl = document.querySelector("#city-lookUp");
var currentDayEl = document.querySelector("#current-day");
var searchHistoryEl = document.querySelector("#search-history");
var dailyInfoEl = document.querySelector("#daily-info");
var forecastEl = document.querySelector("#forecast");
var search = [];

function formSubmit(event) {
  // prevent page reloading
  event.preventDefault();
  // get value of city from user input
  var city = cityLookUpEl.value.trim();

  if (city) {
    getLocation(city);
    //clear old information
    forecastEl.textContent = "";
    dailyInfoEl.textContent = "";
    currentDayEl.textContent = "";
    cityLookUpEl.value = "";
  } else {
    // warn user if input is left blank
    alert("Please enter a Valid City");
  }
};

function getLocation(city) {
  save(city);

  // OpenWeather call API
  var userInput = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=7ab439372a6b7834b1058543aced3bee";

  fetch(userInput)
    .then(function (response) {
      return response.json();
    }).then(function (data) {
      // set geolocation info
      lat = data.coord.lat;
      lon = data.coord.lon;
      weatherInfo(data);
    })
};

function weatherInfo(data) {
  // gather lat and long data to get forecast and current weather
  var city = data.name;
  var weathApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=7ab439372a6b7834b1058543aced3bee";

  fetch(weathApi)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        alert("Please enter valid city");
      }
    }).then(function (data) {
      cityResult(data, city);
    })
    .catch(function (error) {
      alert("Unable to Connect to OpenWeather")
    });
}

function cityCurrentResult(data, city) {
  currentDayEl.setAttribute("class", "outline");

  var dayIcon = "https://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png";
  var dayIconDesc = data.current.weather[0].description;

  var currentWeatherEl = document.createElement("h2");
  var iconEl = document.createElement("img");
  var tempEl = document.createElement("p");
  var windEl = document.createElement("p");
  var humidityEl = document.createElement("p");
  var uvEl = document.createElement("p");
  var uvIndexEl = document.createElement("p")

  iconEl.setAttribute("src", dayIcon);
  iconEl.setAttribute("alt", dayIconDesc);

  var todayDate = new Date(data.current.dt * 1000).toLocaleDateString("en-US");

  currentWeatherEl.textContent = city + " " + todayDate;
  tempEl.textContent = "Temp: " + data.current.temp + "°F";
  windEl.textContent = "Wind: " + data.current.wind_speed + "MPH";
  humidityEl.textContent = "Humidity: " + data.current.humidity + "%";
  uvEl.textContent = "UV Index: "
  uvIndexEl.textContent = data.current.uvi;

  currentDayEl.appendChild(currentWeatherEl);
  currentWeatherEl.appendChild(iconEl);
  currentWeatherEl.appendChild(tempEl);
  currentWeatherEl.appendChild(windEl);
  currentWeatherEl.appendChild(humidityEl);
  currentWeatherEl.appendChild(uvEl);
  uvEl.appendChild(uvIndexEl);

  //clear the current date data
  currentDayEl.innerHTML = "";

  forecast(data);
}

function forecast(data) {
  dailyInfoEl.textContent = "5-Day Forecast";
  forecastEl.innerHTML = "";

  for (var i = 1; i < 6; i++) {
    var dailyCard = document.createElement("div");
    forecastEl.appendChild(dailyCard);
    dailyCard.setAttribute("class", "col-sm daily");

    forecastImgUrl = "https://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png";
    forecastImgDesc = data.daily[i].weather[0].description;

    var date = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");

    // create cards for the 5 day forecast
    var dateTitle = document.createElement("h3");
    // var dailyIcon = document.createElement("p");
    var forecastImg = document.createElement("img");
    var forecastTemp = document.createElement("p");
    var forecastWind = document.createElement("p");
    var forecastHumidity = document.createElement("p")

    forecastImg.setAttribute("src", forecastImgUrl);
    forecastImg.setAttribute("alt", foreCastImgDesc);

    dateTitle.textContent = date;
    forecastTemp.textContent = "Temp:" + data.daily[i].temp.day + "°F";
    forecastWind.textContent = "Wind: " + data.daily[i].wind_speed + "MPH";
    forecastHumidity.textContent = "Humidity: " + data.daily[i].humidity + "%";

    dailyCard.appendChild(dateTitle);
    // dailyCard.appendChild()
    dailyCard.appendChild(forecastTemp);
    dailyCard.appendChild(forecastWind);
    dailyCard.appendChild(forecastHumidity);
  }
};

// save weather data

function save(data) {
  search.push(data);
  localStorage.setItem("search-history", JSON.stringify(data));
  displaySearchHistory();
};

function displaySearchHistory() {
  searchHistoryEl.innerHTML = "";
  for (var i = search.length - 1; i >= 0; i--) {
    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.textContent = search[i];
    button.setAttribute("data-search", search[i]);
    button.setAttribute("class", "history-btn");
    searchHistoryEl.appendChild(button);
  }
};

function handleSearchHistory(e) {
  if (!e.target.matches("history.btn")) {
    return
  }

  var historyBtn = e.target;
  var search = historyBtn.getAttribute("data-search");
  getLocation(search);
}

searchEl.addEventListener("submit", formSubmit);
searchHistoryEl.addEventListener("click", handleSearchHistory);