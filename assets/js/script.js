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
                    //passing coordinates to nested UV Index API
                    getUVIndex(data.coord.lat, data.coord.lon);
                    //pass data into current day HTML generator
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
                    //pass the uv into a separate HTML generator
                    displayCurrentUVWeather(data.value);
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
                    //pass the data into 5-day card HTML generator
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


//when search button is clicked, the city name is submited to the functions
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

//when a generated city button is clicked, the city name is submited to the functions
var weatherButtonHandlers = function (event) {
    var cityName = event.target.value;
    startFunctions(cityName);
}

//city name is submited to the api logic for data to be fetched
//city name is submited to local storage save function
var startFunctions = function (cityName) {
    getCurrentWeather(cityName);
    getFiveDayWeather(cityName);
    saveCityName(cityName);
    //Input form is cleared
    nameInputEl.value = ""
        ;
}
//current date
var date = moment().format("MM/DD/YYYY");


//display the responses/ create elements
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
};

//display UV value from nested API call
var displayCurrentUVWeather = function (uv) {
    var uvIndexContainerEl = document.createElement("div");
    uvIndexContainerEl.textContent = "UV Index: ";
    var uvIndexEl = document.createElement("span");
    //set the textcontent or innertext or innerhtml to the uv variable
    uvIndexEl.textContent = uv;

    //determine if conditions are favorable, moderate, or severe
    if (uv < 3) {
        //if favorable
        //set the class attribute to the bootstrap class
        uvIndexEl.classList.add('badge', "badge-success");
    } else if (uv > 2 && uv < 6) {
        //if moderate
        uvIndexEl.classList.add('badge', "badge-warning");
    } else {
        //if severe
        uvIndexEl.classList.add('badge', "badge-danger");
    }

    uvIndexContainerEl.appendChild(uvIndexEl);
    document.querySelector('#current-city-weather').appendChild(uvIndexContainerEl);
};

//display the responses/ create elements
var displayFiveDayWeather = function (data, cityName) {
    //dynamically create each element for five-day weather
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
    // array of organized forecasts by day (response provides data every 3 hours for 6 days)
    var listOfForecastsOrganizedByDay = organizeMyDataByDay(data.list);

    //add the forecasts to dom
    //loop through list of forecasts by day for the first 5 days (hard code the upper limit)
    for (let i = 0; i < 5; i++) {
        //using the conditions from the first set of recorded data for each day card being generated
        let d = listOfForecastsOrganizedByDay[i][0];
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
        fiveDayCityWeatherEl.append(cardDiv);
    }
};

//Organize forecasts by day to be used in array creation to create weather cards
function organizeMyDataByDay(listOfDates) {
    //map ex. new Map()
    var groupOfForcastsByDate = {}; 
    //iterate through the 40 objects in the array
    for (let i = 0; i < listOfDates.length; i++) {
        //take each object's date stamp and check to see if a map already has the date key
        var forecast = listOfDates[i];
        var key = new moment(forecast.dt_txt).format('MM/DD/YYYY');
        //exists: add to an existing collection for that date
        if (groupOfForcastsByDate.hasOwnProperty(key)) {
            groupOfForcastsByDate[key].push(forecast);
        } else {
            //does not exist: create a new entry in the map
            groupOfForcastsByDate[key] = [forecast];
        }
    }
    //return an array not an object
    return convertObjectToArray(groupOfForcastsByDate);
}

//convert object to array of objects
function convertObjectToArray(groupOfForcastsByDate) {
    //to go through every entry in the map and add to a list
    //keys to iterate (dates)
    var keys = Object.keys(groupOfForcastsByDate);
    //for every date key, add it to a list
    var listOfDays = [];

    for (let i = 0; i < keys.length; i++) {
        //date
        var key = keys[i];
        var threeHourForecast = groupOfForcastsByDate[key];
        //add the threeHourForecast collection (all weather data for one day) to the list
        listOfDays.push(threeHourForecast);
    }
    // return list of days
    return listOfDays;
}

//save search results in local storage
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

    //check city searched, accross an array of keys with the city names
    var inArray = checkIfCityAlreadyExists(city, cities);
    if (!inArray) {
        //city does not exist: add city to array
        cities.push(city);
        addACityToTheDom(city.name);
    }
    localStorage.setItem("cities", JSON.stringify(cities));
}

//check to see if city exists in array
function checkIfCityAlreadyExists(cityObject, listOfCityObjects) {
    var cityName = cityObject.name;
    //convert listOfCityObjects into an array
    var cities = convertArrayOfObjectsIntoArrayOfKeys(listOfCityObjects);
    //return whether or not city should be added to the local storage 
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

//add city button below searchbar
function addACityToTheDom(city) {
    var weatherButtonEl = document.createElement("input");
    weatherButtonEl.value = city;
    weatherButtonEl.type = 'button';
    weatherButtonEl.onclick = weatherButtonHandlers;
    weatherButtonEl.setAttribute("data-city-name", city);
    weatherButtonContainerEl.appendChild(weatherButtonEl);
}

//on page load, pull from storage or create a blank array
function loadCities() {
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    //go through time collection, for every element in time collection find every element to be populated with local stoage data
    //loop through collection
    for (var i = 0; i < cities.length; i++) {
        //grab the city at each index
        var city = cities[i];
        addACityToTheDom(city.name);
    }
}
//looks for event (button click event listener below, when you click on a saved weather button)
var buttonClickHandler = function (event) {
    //identifies the target of the event and gets value of that "data-city-name" attribute
    var cityName = event.target.getAttribute("data-city-name");
    //value that is retrieved
    if (cityName) {
        getCurrentWeather(cityName);
        getFiveDayWeather(cityName);
        // clear old content 
        currentCityWeatherEl.textContent = "";
        fiveDayCityWeatherEl.textContent = "";
    }
};

//load cities on search
function main() {
    searchButtonEl.addEventListener("click", formSubmitHandler);
    loadCities();
}
main();

