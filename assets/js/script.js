var searchEl = document.querySelector("#search");
var cityLookUpEl = document.querySelector("#city-lookUp");
var currentDayEl = document.querySelector("#current-day");
var searchHisoryEl = document.querySelector("#search-history");
var dailyInfoEl = document.querySelector("#daily-info");
var forecastEl = document.querySelector("#forecast");
var search = [];

function formSubmit(event) {
  // prevent page reloading
  event.preventDefault();
  // get value of city from user input
  var city = cityLookUpEl.ariaValueMax.trim();

  if (city) {
    getCoordinates(city);
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
  saveLocation(city);

  // OpenWeather call API
  var userInput = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=7ab439372a6b7834b1058543aced3bee";
}