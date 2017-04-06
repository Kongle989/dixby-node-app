// RUN NPM INIT AND INSTALL ALL NECESSARY PACKAGES
var twit = require("twitter"),
    spot = require("spotify"),
    req = require("request"),
    fs = require("fs"),
    // GET KEY FROM KEYS.JS
    twitKey = new twit(require("./keys.js").twitterKeys),
    action = process.argv[2],
    songMovie = process.argv[3],
    par = {screen_name: 'kongle989', count: 20};
// SWITCH ON ACTION TO SELECT WHICH ACTION TO EXECUTE
switch (action) {
    case "my-tweets":
        // USE TWITTER TO GET MY TWEETS
        twitKey.get("statuses/user_timeline", par, function (error, tweets, response) {
            if (!error) {
                for (var key in tweets) {
                    console.log(tweets[key].created_at);
                    console.log(tweets[key].text);
                }
            }
            else {
                console.log(error);
            }
        });
        break;
    case "spotify-this-song":
        // USE SPOTIFY TO SEARCH BY TRACK NAME
        spot.search({type: 'track', query: songMovie}, function (error, data) {
            // IF NOTHING IS FOUND. DEFAULT TO LOOKUP SPECIFIC TRACK BY ID
            if (data.tracks.items.length == 0) {
                spot.lookup({type: 'track', id: "3DYVWvPh3kGwPasp7yjahc"}, function (error, data) {
                    console.log(data.album.artists[0].name);
                    console.log(data.name);
                    console.log(data.preview_url);
                    console.log(data.album.name);

                });
            } // IF SOMETHING IS FOUND. DISPLAY FIRST SEARCH FOUND
            else {
                console.log((data.tracks.items[0].artists[0].name));
                console.log((data.tracks.items[0].name));
                console.log((data.tracks.items[0].preview_url));
                console.log((data.tracks.items[0].album.name));
            }
        });
        break;
    case "movie-this":
        // USE REQUIRE TO SEARCH OMDB FOR A MOVIE
        // IF LENGTH IS 3 NO SEARCH WAS MADE. DEFAULT TO MR NOBODY
        if (process.argv.length == 3) {
            req('http://www.omdbapi.com/?t=Mr.+Nobody', function (error, response, body) {
                body = JSON.parse(body);
                console.log(body.Title);
                console.log(body.Year);
                console.log(body.imdbRating);
                console.log(body.Country);
                console.log(body.Language);
                console.log(body.Plot);
                console.log(body.Actors);
                console.log(body.Ratings[1].Value);
                console.log('https://www.rottentomatoes.com/m/Mr_Nobody');
            });
            // SWITCH
            break;
        }
        var movie = songMovie.split(' ').join('+');
        req('http://www.omdbapi.com/?t=' + movie, function (error, response, body) {
            body = JSON.parse(body);
            // IF MOVIE FOUND. DISPLAY INFO
            if (body.Response == 'True') {
                console.log(body.Title);
                console.log(body.Year);
                console.log(body.imdbRating);
                console.log(body.Country);
                console.log(body.Language);
                console.log(body.Plot);
                console.log(body.Actors);
                console.log(body.Ratings[1].Value);
                console.log(body.imdbID);
            } // NOTHING WAS FOUND CONSOLE NO MOVIE FOUND
            else {
                console.log('no movie found');
            }
        });
        break;
    case "do-what-it-says":
        // READ FILE AND ASSIGN TO VARIABLE
        var random = fs.readFile('./random.txt', 'utf8', function (error, data) {
            // SPLIT STRING BETWEEN ACTION AND VALUE
            data = data.split(',');
            // IF SPOTIFY. SEARCH FOR SONG
            if (data[0] == 'spotify-this-song') {
                spot.search({type: 'track', query: data[1]}, function (error, data) {
                    console.log((data.tracks.items[0].artists[0].name));
                    console.log((data.tracks.items[0].name));
                    console.log((data.tracks.items[0].preview_url));
                    console.log((data.tracks.items[0].album.name));
                });
            }
        });
        break;
}