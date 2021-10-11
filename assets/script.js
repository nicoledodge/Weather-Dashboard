
    var city;
    var mainCard = $(".card-body");
    var searchHistory = [];


// local storage history
    function getItems() {
        var storedCities = JSON.parse(localStorage.getItem("searchHistory"));
        if (storedCities !== null) {
            searchHistory = storedCities;
        }
        ;
        // lists up to 8 locations in search history / left side column
        for (i = 0; i < searchHistory.length; i++) {
            if (i == 8) {
                break;
            }
            //  creates links/buttons to the previous searched cities
            cityRedirect = $("<a>").attr({class: "list-group-item list-group-item-action", href: "#"});
            // makes the history list into buttons
            cityRedirect.text(searchHistory[i]);
            // console.log(cityRedirect);
            $(".list-group").append(cityRedirect);
        }
    };
    getItems();

    function getData() {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=a0a3b5554f618303f07d45c1f746b0ac"
        mainCard.empty();
        $("#weeklyForecast").empty();
        // requests
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            var date = moment().format("- LL");

            var iconCode = response.weather[0].icon;

            var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";

            var name = $("<h3>").html(city + date);

            mainCard.prepend(name);

            mainCard.append($("<img>").attr("src", iconURL));

            var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
            mainCard.append($("<p>").html("Temperature: " + temp + " &#8457"));
            var humidity = response.main.humidity;
            mainCard.append($("<p>").html("Humidity: " + humidity + "%"));
            var windSpeed = response.wind.speed;
            mainCard.append($("<p>").html("Wind Speed: " + windSpeed + " MPH"));

            var lat = response.coord.lat;
            var lon = response.coord.lon;

            $.ajax({
                url:"https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current&appid=a0a3b5554f618303f07d45c1f746b0ac&lat=&units=standard",
                method: "GET"
                // projects UV and severity with colors
            }).then(function (response) {
                console.log(response);
                mainCard.append($("<p>").html("UV Index: <span>" + response.daily[0].uvi + "</span>"));
                if (response.daily[0].uvi <= 2) {
                    $("span").attr("class", "btn btn-outline-success");
                }
                if (response.daily[0].uvi > 2 && response.daily[0].uvi <= 5) {
                    $("span").attr("class", "btn btn-outline-warning");
                }
                if (response.daily[0].uvi > 5) {
                    $("span").attr("class", "btn btn-outline-danger");
                }

            })
            // another call for the 5-day (forecast)
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=a0a3b5554f618303f07d45c1f746b0ac&units=imperial",
                method: "GET"
                // displays 5 separate columns from the forecast response for 5 days
            }).then(function (response) {
                let icon;
                var results = response.list;
                //empty 5day div--------
                $("#weeklyForecast").empty();
                //create HTML for 5day forcast................
                for (var i = 0; i < results.length; i += 8) {
                    // Creating a div
                    var fiveDayDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem; color: purple;'>");
                    var date = results[i].dt_txt;
                    var setD = date.substr(0, 10)
                    var temp = results[i].main.temp;
                    var hum = results[i].main.humidity;
                    var h5date = $("<h5 class='card-title'>").text(setD);
                    const pTemp = $("<p class='card-text'>").text("Temp: " + temp);
                    const pHum = $("<p class='card-text'>").text("Humidity " + hum);

                    const weather = results[i].weather[0].main;

                    if (weather === "Rain") {
                        icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
                        icon.attr("style", "height: 40px; width: 40px");
                    } else if (weather === "Clouds") {
                        icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
                        icon.attr("style", "height: 40px; width: 40px");
                    } else if (weather === "Clear") {
                        icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
                        icon.attr("style", "height: 40px; width: 40px");
                    } else if (weather === "Drizzle") {
                        icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
                        icon.attr("style", "height: 40px; width: 40px");
                    } else if (weather === "Snow") {
                        icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
                        icon.attr("style", "height: 40px; width: 40px");
                    }

                    //append items to.......
                    fiveDayDiv.append(h5date);
                    fiveDayDiv.append(icon);
                    fiveDayDiv.append(pTemp);
                    fiveDayDiv.append(pHum);
                    $("#weeklyForecast").append(fiveDayDiv);
                }
            })
        })
    }

    // searches and adds to history(event)
    $("#searchCity").click(function () {
        city = $("#city").val().trim();
        getData();
        var doubleCheck = searchHistory.includes(city);
        if (doubleCheck == true) {
            return
        } else {
            searchHistory.push(city);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            console.log(searchHistory);

            var cityRedirect = $("<a>").attr({
                class: "list-group-item list-group-item-action",
                href: "#"
            });

            cityRedirect.text(city);
            $(".list-group").append(cityRedirect);
        }
        ;
    });
// listens for action on the history buttons(event)
    $(".list-group-item").click(function () {
        city = $(this).text();
        getData();
    });
