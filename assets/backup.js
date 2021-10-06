


//empty list until given command
var searchHistory= [];
var city;

//search for city and add search history to local storage


var searchCity = $("#search-city");

console.log(searchCity)

var searchButton = $("#select-city");

console.log(searchButton)

var APIKey = "a0a3b5554f618303f07d45c1f746b0ac";

var searchHistory = [];

// returns local storage search history
function getItems() {
    var storedCities = JSON.parse(localStorage.getItem("searchHistory"));

    if (storedCities !== null) {
        searchHistory = storedCities;
    };
     // lists up to 8 locations
    for (i = 0; i < searchHistory.length; i++) {
        if (i == 8) {
            break;
          };
    };
}
getItems();
// for (var i = 0; i < localStorage.length; i++) {

//     var city = localStorage.getItem(i);

//     var cityName = $(".list-group").addClass("list-group-item");

//     cityName.append("<li>" + city + "</li>");
// }

//key count for local storage
var keyCount =  0;

//click event
searchButton.click(function(event){


    console.log(event);

    event.preventDefault();


    var searchInput = $(".form-control").val();
        // Variable for current weather working 
        var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + APIKey + "&units=imperial";
        // Variable for 5 day forecast working
        var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + APIKey + "&units=imperial";

    // var checkArray =searchHistory.includes(city);
    //check to see if search history has any cities
    if (searchInput == "") {
        console.log(searchInput);
    } else {
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function (response) {
            // list-group append an li to it with just set text
            // console.log(response.name);
            var cityName = $(".list-group").addClass("list-group-item");
            cityName.prepend("<li>" + response.name + "</li>");
            // Local storage
            // var local = localStorage.setItem(keyCount, response.name);
            keyCount = keyCount + 1;

            // Start Current Weather append 
            var currentCard = $(".card").append("<div>").addClass("card-body");
            currentCard.empty();
            var currentName = currentCard.append("<p>");
            // .addClass("card-text");
            currentCard.append(currentName);

            // Adjust Date 
            var timeUTC = new Date(response.dt * 1000);
            currentName.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));


            // //current icon
            var iconCode = response.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            currentName.append($("<img>").attr("src", iconUrl));
            
            
            // Add Temp 
            var currentTemp = currentName.append("<p>");
            // .addClass("card-text");
            currentName.append(currentTemp);
            currentTemp.append("<p>" + "Temperature: " + response.main.temp + "</p>");
            // Add Humidity
            currentTemp.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");
            // // Add Wind Speed: 
            currentTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");


            // takes from the response and creates a var used in the next request for UV index
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            // UV Index URL
            var UVurl = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
            // UV Index
            $.ajax({
                url: UVurl,
                method: "GET"
            }).then(function (response) {
                var currentUV = currentTemp;
                currentUV.append($("<p>").html("UV Index: <span>" + response.value + "</span>"));
                //if statements for uv index color 
                if (response.value <= 2) {
                    $("span").attr("class", "btn btn-outline-success");
                };
                if (response.value > 2 && response.value <= 5) {
                    $("span").attr("class", "btn btn-outline-warning");
                };
                if (response.value > 5) {
                    $("span").attr("class", "btn btn-outline-danger");
                };
            });

        })
    }
});
$("#searchCity").click(function() {
    city = $("#city").val().trim();
    getData();
    var checkArray = searchHistory.includes(city);
    if (checkArray == true) {
        return
    }
    else {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        var cityListButton = $("<a>").attr({
            // list-group-item-action keeps the search history buttons consistent
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        cityListButton.text(city);
        $(".list-group").append(cityListButton);
    };
});