var citySearchEl = document.querySelector("#city-search");
var currentCityWeatherEl = document.querySelector("#current-city-weather");
var fiveDayCityWeatherEl = document.querySelector("#fiveday-city-weather");



//current date 
var date = $("#currentDay").text(`${moment().format("MM/DD/YYYY")}`);
console.log(date);

var temperature = 0
var humidity = 0
var windSpeed = 0
var uvIndex = 0
// var icon = function () {
//     if (X = "sunny") {
//         value = <i class="fas fa-sun"></i>
//     }
// }


var currentIconEl = document.querySelector("#currenticon");

//display the responses/ create elements ( how to pull in parameters)
var displayWeather = function () {
    var currentNameDateIconEl = document.createElement("div");
    currentNameDateIconEl.className = "current-city";

    var nameEl = document.createElement("p")
    nameEl.id = "currentName"
    nameEl.textContent = currentName;
    console.log(nameEl);

    currentNameDateIconEl.appendChild(nameEl);

    var dateEl = document.createElement("span")
    dateEl.id = "currentDay";
    dateEl.textContent = `${moment().format("MM/DD/YYYY")}`
    console.log(dateEl);

    currentNameDateIconEl.appendChild(dateEl);

    var iconEl = document.createElement("span")
    iconEl.id = "currentIcon";

    //append children
    currentNameDateIconEl.appendChild(iconEl);
    currentCityWeatherEl.appendChild(currentNameDateIconEl);

    //create stats ex:temperature div
    var currentTemperatureEl = createElement("div");
    currentTemperatureEl.innerHTML("Temperature: " + temperature + " F");
    currentCityWeatherEl.appendChild(currentTemperatureEl);

    var currentHumidityEl = createElement("div");
    currentHumidityEl.innerHTML("Humidity: " + humidity + "%");
    currentCityWeatherEl.appendChild(currentHumidityEl);

    var currentwindSpeedEl = createElement("div");
    currentwindSpeedEl.innerHTML("Wind Speed: " + windSpeed + " MPH");
    currentCityWeatherEl.appendChild(currentwindSpeedEl);

    //uv??

    //create 5 day forecast
    for (i = 0; i < 6; i++) {
        //create 5 cards
        var weatherCardEl = createElement("div");
        weatherCardEl.className = "card";

        //create date element
        var futureDateEl = createElement("div");
        futureDateEl.textContent = date;
        weatherCardEl.appendChild(futureDateEl);

        var futureIconEl = createElement("div");
        futureIconEl.innerHTML = icon;
        weatherCardEl.appendChild(futureIconEl);

        var futureTempEl = createElement("div");
        futureTempEl.textContent = "Temp: " + temperature + " F";
        weatherCardEl.appendChild(futureTempEl);

        var futureHumidityEl = createElement("div");
        futureHumidityEl.textContent = "Humidity: " + humidity + "%";
        weatherCardEl.appendChild(futureHumidityEl);
    

    }



    //saveSearch();

}

//**Add line 42 - 88?? */

//display search results from saved in local storage (get item, append to element created)
var displayCitySearch = function () {
    
}

//function to save search results in local storage
var saveSearch = function () {

}

