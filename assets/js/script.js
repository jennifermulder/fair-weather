var searchButtonEl = document.querySelector("#search-button");
var nameInputEl = document.querySelector("#cityname");
var citySearchEl = document.querySelector("#city-search");
var currentCityWeatherEl = document.querySelector("#current-city-weather");
var fiveDayCityWeatherEl = document.querySelector("#fiveday-city-weather");


//passing cityName parameter into the function so that it can be searched
var getCurrentWeather = function (cityName) {
    var apiCurrentUrl = "https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=a514515ab34188949832b8c89e71bb2e";

    fetch(apiCurrentUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayCurrentWeather(data.items, cityName);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        // incase theres any issues with the request
        .catch(function (error) {
            alert("Unable to connect to Weather Data");
        });
};

var getFiveDayWeather = function (cityName) {
    var apiFiveDayUrl = "https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=a514515ab34188949832b8c89e71bb2e";

    fetch(apiFiveDayUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayCurrentWeather(data.items, cityName);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        // incase theres any issues with the request
        .catch(function (error) {
            
            alert("Unable to connect to Weather Data");
        });
};

var formSubmitHandler = function (event) {
    console.log("works");
    event.preventDefault();
    // get value from input element
    var cityName = nameInputEl.value.trim();

    if (cityName) {
        getCurrentWeather(cityName);
        getFiveDayWeather(cityName);

        //to clear the form 
        nameInputEl.value = "";
    } else {
        alert("Please enter a valid city name");
    }
};

//current date 
var date = $("#currentDay").text(`${moment().format("MM/DD/YYYY")}`);
console.log(date);

var temperature = 0
var humidity = 0
var windSpeed = 0
var uvIndex = 0
var icon = function () {
    if (X = "sunny") {
        value = `<i class="fas fa-sun"></i>`;
    }
}


// var currentIconEl = document.querySelector("#currenticon");

//display the responses/ create elements ( how to pull in parameters)
var displayCurrentWeather = function (data, cityName) {
    console.log(displayCurrentWeather);
    console.log(data);
    console.log(cityName);
    var currentNameDateIconEl = document.createElement("div");
    currentNameDateIconEl.className = "current-city";

    var nameEl = document.createElement("p")
    nameEl.id = "currentName"
    nameEl.textContent = cityName.textContent;
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
    var currentTemperatureEl = document.createElement("div");
    currentTemperatureEl.innerHTML("Temperature: " + temperature + " F");
    currentCityWeatherEl.appendChild(currentTemperatureEl);

    var currentHumidityEl = document.createElement("div");
    currentHumidityEl.innerHTML("Humidity: " + humidity + "%");
    currentCityWeatherEl.appendChild(currentHumidityEl);

    var currentwindSpeedEl = document.createElement("div");
    currentwindSpeedEl.innerHTML("Wind Speed: " + windSpeed + " MPH");
    currentCityWeatherEl.appendChild(currentwindSpeedEl);

    //uv??
}

var displayCurrentWeather = function () {
    //create 5 day forecast
    for (i = 0; i < 6; i++) {
        //create 5 cards
        var weatherCardEl = document.createElement("div");
        weatherCardEl.className = "card";

        //create date element
        var futureDateEl = document.createElement("div");
        futureDateEl.textContent = date;
        weatherCardEl.appendChild(futureDateEl);

        var futureIconEl = document.createElement("div");
        futureIconEl.innerHTML = `<i class="fas fa-sun"></i>`;
        weatherCardEl.appendChild(futureIconEl);

        var futureTempEl = document.createElement("div");
        futureTempEl.textContent = "Temp: " + temperature + " F";
        weatherCardEl.appendChild(futureTempEl);

        var futureHumidityEl = document.createElement("div");
        futureHumidityEl.textContent = "Humidity: " + humidity + "%";
        weatherCardEl.appendChild(futureHumidityEl);
    
    }

    //saveSearch();

}




// //display search results from saved in local storage (get item, append to element created) DISPLAY AS BUTTON
// var displayCitySearch = function () {
    
//     var weatherButtonsEl = document.createElement("button");
//     weatherButtonsEl.textContent = cityName;
// }

// //function to save search results in local storage
// var saveSearch = function () {

// }


// //looks for event (button click event listener below, when you click on a saved weather button)
// var buttonClickHandler = function(event) {
//     //identifies the target of the event (what was clicked on) and gets value of that "data-city-name" attribute
//     var cityName = event.target.getAttribute("data-city-name")
//     //value that is retrieved
//     //console.log(language);
//     if (cityName) {
//         //pass this specified language into the getFeaturedRepos function (use as input)
//         getCurrentWeather(cityName);
//         getFiveDayWeather(cityName);

//         // clear old content (clears it first - asynchronous)
//         currentCityWeatherEl.textContent = "";
//         fiveDayCityWeatherEl.textContent = "";
//       }
// }

searchButtonEl.addEventListener("click", formSubmitHandler);

// weatherButtonsEl.addEventListener("click", buttonClickHandler);
