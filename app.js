const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { query } = require("express");
const { rmSync } = require("fs");
const app = express();


app.set('views', (__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.render("index");
})

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = "";
    const url = https.get("https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=metric");


    https.get(url, function (response) {
        console.log(response.statusCode);

        if (response.statusCode === 404) {
            res.render("failure");

        } else {

            response.on("data", function (data) {
                const weatherData = JSON.parse(data)
                const icon = weatherData.weather[0].icon
                const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
                const temp = weatherData.main.temp
                const weatherDescp = weatherData.weather[0].description
                res.render("weather", { weatherDescp: weatherDescp, query: query, temp: temp, imageURL: imageURL });


            })
        }


    })

});

app.post("/failure", function (req, res) {
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function () {
    console.log("server started at port 3000");
})
