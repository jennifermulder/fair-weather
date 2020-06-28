var searchButtonEl = document.querySelector("#search-button");
var nameInputEl = document.querySelector("#cityname");
var weatherButtonContainerEl = document.querySelector("#weather-buttons");
var citySearchEl = document.querySelector("#city-search");
var currentCityWeatherEl = document.querySelector("#current-city-weather");
var fiveDayCityContainerEl = document.querySelector("#fiveday-city-title");
var fiveDayCityWeatherEl = document.querySelector("#fiveday-city-weather");


//API Calls
var getCurrentWeather = function (cityName) {
    var apiCurrentUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&units=imperial&appid&appid=a514515ab34188949832b8c89e71bb2e";
    fetch(apiCurrentUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    //passing coordinated to nest UV Index API
                    getUVIndex(data.coord.lat, data.coord.lon);
                    displayCurrentWeather(data, cityName);
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
var getUVIndex = function (lat, lon) {
    var apiUVIUrl =
        "http://api.openweathermap.org/data/2.5/uvi?appid=a514515ab34188949832b8c89e71bb2e&lat=" +
        lat +
        "&lon=" +
        lon;
    fetch(apiUVIUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayCurrentUVWeather(data.value); //pass the uv into a separate HTML generator
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        // incase theres any issues with the request
        .catch(function (error) {
            alert("Unable to connect to Weather UV Index");
        });
};

var getFiveDayWeather = function (cityName) {
    var apiFiveDayUrl =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityName +
        "&units=imperial&appid&appid=a514515ab34188949832b8c89e71bb2e";
    fetch(apiFiveDayUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayFiveDayWeather(data, cityName);
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


//when search button is clicked, form is submitted
var formSubmitHandler = function (event) {
     event.preventDefault();
    // get value from input element
    var cityName = nameInputEl.value.trim();
    if (cityName) {
        startFunctions(cityName);
    } else {
        alert("Please enter a valid city name");
    }
};

var weatherButtonHandlers = function (event) {
    var cityName = event.target.value;
    startFunctions(cityName);
}

// do or handle the api logic and local storage save
var startFunctions = function(cityName) {
    getCurrentWeather(cityName);
    getFiveDayWeather(cityName);
    saveCityName(cityName);
    //to clear the form
    nameInputEl.value = ""
    ;
}
//current date
var date = moment().format("MM/DD/YYYY");


//display the responses/ create elements ( how to pull in parameters)
var displayCurrentWeather = function (data, cityName) {
    //dynamically create each element for current weather
    const icon = data.weather[0].icon;
    const createHtml = function (temp, humidity, windSpeed, uv) {

        const html = `<p class="current-city font-weight-bold">${cityName} (<span id="currentDay">${date}</span>) <img src=${
            "http://openweathermap.org/img/w/" + icon + ".png"}></img></p>
                <div id="current-temperature">${temp}</div>
                <div id="current-humidity">${humidity}</div>
                <div id="current-wind-speed">${windSpeed}</div>`;
        return html;
    };
    
    var currentNameDateIconEl = document.createElement("div");
    currentNameDateIconEl.classList.add("current-city", "font-weight-bold");

    currentCityWeatherEl.innerHTML = createHtml(
        "Temperature: " + data.main.temp + " •F",
        "Humidity: " + data.main.humidity + "%",
        "Wind Speed: " + data.wind.speed + " MPH"
    );

    //create stats ex:temperature div
    var currentTemperatureEl = document.createElement("div");

    currentCityWeatherEl.appendChild(currentTemperatureEl);
    var currentHumidityEl = document.createElement("div");

    currentCityWeatherEl.appendChild(currentHumidityEl);
    var currentwindSpeedEl = document.createElement("div");

    currentCityWeatherEl.appendChild(currentwindSpeedEl);

};
//display UV value from nested API call
var displayCurrentUVWeather = function (uv) {
    // decide if it's favorable, moderate or severe

    //create a div element
    var uvIndexContainerEl = document.createElement("div");
    // add it's text content "UV Index"
    uvIndexContainerEl.textContent = "UV Index: ";
    // create a span element
    var uvIndexEl = document.createElement("span");
    // set the textcontent or innertext or innerhtml to the uv variable
    uvIndexEl.textContent = uv;
    
    //if low
    if (uv < 3  ) {
    //if moderate
    // set the class attribute to the bootstrap class
    uvIndexEl.classList.add('badge',"badge-success");
    } else if( uv > 2 && uv < 6) {
    uvIndexEl.classList.add('badge',"badge-warning");
    } else {
    uvIndexEl.classList.add('badge',"badge-danger");
    }
    //add it to the div
    uvIndexContainerEl.appendChild(uvIndexEl);
    //add the div to the dom
    document.querySelector('#current-city-weather').appendChild(uvIndexContainerEl);
};


var displayFiveDayWeather = function (data, cityName) {
    // console.log(data);
    // console.log(cityName);

    var forecastTextEl = document.createElement("p");
    forecastTextEl.textContent = "5-Day Forecast:";
    forecastTextEl.classList.add("five-day", "font-weight-bold");
    fiveDayCityContainerEl.innerHTML = "";
    fiveDayCityWeatherEl.innerHTML = "";
    fiveDayCityContainerEl.appendChild(forecastTextEl);
    let createHTML = function (date, icon, temp, humidity) {
        //create elements
        let html = `
                <div id="five-date">
                   ${date}
                </div>
                <div id="five-icon">
               <img src=${
            "http://openweathermap.org/img/w/" + icon + ".png"}></img>
                </div>
                <div id="five-temp">
                       ${temp}
                </div>
                <div id="five-humidity">
                   ${humidity}
                </div>`;
        return html;
    };
    //create 5 day forecast
    // organize the forecasts by day

    var listOfForecastsOrganizedByDay = organizeMyDataByDay(data.list); // array of organized forecasts by day
    // console.log('LIST OF FORECASTS BY DAY=>', listOfForecastsOrganizedByDay);

    //add the forecasts to dom
    //loop through list of forecasts by day for the first 5 days (hard code the upper limit /or take a slice)
    for (let i = 0; i < 5; i++) {
        //take the first one for now
        let d = listOfForecastsOrganizedByDay[i][0];
        //create an element for each group 
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card", "mx-2", "p-2", "bg-primary", "text-white");
        //format the date to look like MM/DD/YYYY
        var formattedDate = new moment(d.dt_txt).format('MM/DD/YYYY');
        //pull the four data points
        cardDiv.innerHTML = createHTML(
            formattedDate,
            d.weather[0].icon,
            "Temp: " + d.main.temp + " •F",
            "Humidity: " + d.main.humidity + "%"
        );
        //add them to the card
        fiveDayCityWeatherEl.append(cardDiv);
    }

    //saveSearch();
};

//function to organize forecasts by day
function organizeMyDataByDay(listOfDates) {
    var groupOfForcastsByDate = {}; //map ex. new Map()
    // iterated through the 40 objects in the array
    for (let i = 0; i < listOfDates.length; i++) {
        // then take each object's time stamp and check to see if a map has the date key
        var forecast = listOfDates[i];
        var key = new moment(forecast.dt_txt).format('MM/DD/YYYY'); // 6/30/2020
        // if it does add it to a collection from that date
        if (groupOfForcastsByDate.hasOwnProperty(key)) {
            groupOfForcastsByDate[key].push(forecast);
        } else {
            // if it does not, create a new entry in the map
            groupOfForcastsByDate[key] = [forecast];
        }
    }
    // return a list not an object
    return convertObjectToArray(groupOfForcastsByDate);
}

// function to convert object to array of objects
function convertObjectToArray(groupOfForcastsByDate) {
    //we need to go through every entry in the map and add that to a list
    var keys = Object.keys(groupOfForcastsByDate); // here are my keys/dates
    //for every entry or date key, add it to a list
    var listOfDays = [];

    for (let i = 0; i < keys.length; i++) {
        var key = keys[i]; // 6/28/2020
        var threeHourForecast = groupOfForcastsByDate[key];
        // add the threeHourForecast collection to the list
        listOfDays.push(threeHourForecast);
    }
    // return list of days
    return listOfDays;
}

//function to save search results in local storage
var saveCityName = function (cityName) {
    var city = {
        name: cityName,
    };
    storeCityName(city);
};
//save task array to local storage
function storeCityName(city) {
    //find any items currently saved in local storage
    var cities = JSON.parse(localStorage.getItem("cities"));
    if (!cities) {
        cities = [];
    }

    //before we add the city, let's check it accross an array of keys with the citity names
    var inArray = checkIfCityAlreadyExists(city, cities);
    if(!inArray) {
        cities.push(city);
        addACityToTheDom(city.name);
    }
    localStorage.setItem("cities", JSON.stringify(cities));
}

//check to see if city exists in array
function checkIfCityAlreadyExists(cityObject, listOfCityObjects) {
    var cityName = cityObject.name;
    //before we add the city, let's check it accross an array of keys with the city names
    //convert listOfCityObjects into an array
    var cities = convertArrayOfObjectsIntoArrayOfKeys(listOfCityObjects);
    // console.log('cityName=>',cityName)
    // console.log('cities=>',cities)
    //check if cityName is in array already
    // return whether or not we should add this city to the local storage
    return cities.includes(cityName);
    
}

//convert the array of objects into an array of keys
function convertArrayOfObjectsIntoArrayOfKeys(listOfCityObjects) {
    //declare a list to return
    var cities = [];
    //loop throught the array of objects
    for (let i = 0; i < listOfCityObjects.length; i++) {
        var city = listOfCityObjects[i];
        //add just the city's name into the list
        cities.push(city.name);
    }

    //return the list
    return cities;
} 

//puts a city below searchbar
function addACityToTheDom(city) {
    var weatherButtonEl = document.createElement("input");
    // console.log(weatherButtonEl);
    weatherButtonEl.value = city;
    weatherButtonEl.type = 'button';
    weatherButtonEl.onclick = weatherButtonHandlers;
    // console.log(city);
    weatherButtonEl.setAttribute("data-city-name", city);
    weatherButtonContainerEl.appendChild(weatherButtonEl);
}

//on page load, pull from storage or create a blank array
function loadCities() {
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    // go through time collection, for every element in time collection find every element to be populated with local stoage data
    // loop through collection
    for (var i = 0; i < cities.length; i++) {
        // grab the task at each index
        var city = cities[i];
        addACityToTheDom(city.name);
    }
}
//looks for event (button click event listener below, when you click on a saved weather button)
var buttonClickHandler = function (event) {
    //identifies the target of the event (what was clicked on) and gets value of that "data-city-name" attribute
    var cityName = event.target.getAttribute("data-city-name");
    //value that is retrieved
    //console.log(language);
    if (cityName) {
        //pass this specified language into the getFeaturedRepos function (use as input)
        getCurrentWeather(cityName);
        getFiveDayWeather(cityName);
        // clear old content (clears it first - asynchronous)
        currentCityWeatherEl.textContent = "";
        fiveDayCityWeatherEl.textContent = "";
    }
};

function main() {
    searchButtonEl.addEventListener("click", formSubmitHandler);
    loadCities();
}

main();



// weatherButtonEl.addEventListener("click", buttonClickHandler);
