require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api"); //Using the Spotify api and getting the key from keys.js
var spotify = new Spotify(keys.spotify);

var moment = require("moment"); //Both required to use moment for node
moment().format();

var axios = require("axios"); //To get the information from the APIs for movie and concert-this

var fs = require("fs"); //To read the random.txt file for the do-what-it-says function

var command = process.argv[2]; // for the switch case
var value = process.argv[3]; // to send value to the proper functions

// switch case to take in command
switch (command) {
  case "concert-this":
    concertThis();
    break;

  case "spotify-this-song":
    spotifyThis();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    whatSays();
    break;
}

// create function for commands

function concertThis() {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        value +
        "/events?app_id=codingbootcamp"
    )
    .then(function (response) {
      // console.log(response.data);
      for (let i = 0; i < response.data.length; i++) {
        console.log("\n**************************************");
        console.log("Venue: " + response.data[i].venue.name);

        console.log(
          "Location: " +
            response.data[i].venue.city +
            ", " +
            response.data[i].venue.region
        );

        console.log(
          "Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY")
        );
        console.log("**************************************\n");
      }
    });
}

function spotifyThis() {
  spotify
    .search({
      type: "track",
      query: value,
    })
    .then(function (response) {
      console.log("\n**************************************");
      console.log("\nArtist: " + response.tracks.items[0].artists[0].name);
      console.log("Track: " + response.tracks.items[0].name);
      console.log("Album: " + response.tracks.items[0].album.name);
      console.log("URL: " + response.tracks.items[0].preview_url);
      console.log("**************************************\n");
    });
}

function movieThis() {
  if (!value) {
    value = "Mr. Nobody";
  }
  axios
    .get(
      "https://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy"
    )
    .then(function (response) {
      console.log("\n**************************************");
      console.log("Title: " + response.data.Title);
      console.log("Release year: " + response.data.Year);
      console.log("IMDb rating: " + response.data.imdbRating);
      console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);
      console.log("Country produced in: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
      console.log("**************************************\n");
    });
}

function whatSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(',');
        spotifySong(dataArr[0], dataArr[1]);
    });
}
