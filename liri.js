var request = require("request");//Includes request npm package
var Twitter = require("twitter");//Include twitter package
var Spotify = require("node-spotify-api");//Include spotify package

var twitterKeys = require("./keys.js");//Keep twitterKeys private
//Create our Twitter client
var client = new Twitter({
  consumer_key: twitterKeys.twitterKeys.consumer_key,
  consumer_secret: twitterKeys.twitterKeys.consumer_secret,
  access_token_key: twitterKeys.twitterKeys.access_token_key,
  access_token_secret: twitterKeys.twitterKeys.access_token_secret,
});
//Create the Spotify client
var spotify = new Spotify({
  id: "7084abeda56d4bcb9b19cf6aa1e640c4",
  secret: "4911edbea69e4c989dae8b52fbe9581b"
});

var nodeArgs = process.argv;
//If movie-this is the third argument on the command line
if(nodeArgs[2] === "movie-this"){

	//Initializes var where we will store the movie name
	var movieName = "";

	//Starts a for loop that will patch the movie name together with '+'s
	for (var i = 3; i < nodeArgs.length; i++) {
		//If there is more than one word in the movie title
		if (i > 3 && i < nodeArgs.length){
			//Patch together movie name, replacing spaces with '+'s
			movieName = movieName + "+" + nodeArgs[i];
		}
	  	else{
	   		movieName += nodeArgs[i];
	  	}
	}
	//Creates a query URL based on movie name we just created
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

	//Using request package, pull the .json response from the OMDB API URL we created 
	request(queryUrl, function(error, response, body) {
	  	// If the request is successful
	  	if (!error && response.statusCode === 200) {
	  		console.log("<----------------------------------->");
	    	console.log("Movie Title: " + JSON.parse(body).Title);
	    	console.log("Year Released: " + JSON.parse(body).Year);
	    	console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	    	//Need to query the array within database to get rotten tomatoes rating
	    	console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings);
	    	console.log("Country: " + JSON.parse(body).Country);
	    	console.log("Language: " + JSON.parse(body).Language);
	    	console.log("Plot: " + JSON.parse(body).Plot);
	    	console.log("Notable Actors: " + JSON.parse(body).Actors);
	    	console.log("<----------------------------------->");
		}
	});
}

//If my-tweets is the third argument in command line
if(process.argv[2] === "my-tweets"){
	//Use the Twitter client to get tweets from my timeline
	client.get("https://api.twitter.com/1.1/statuses/user_timeline.json", function(error, tweets, response) {
		if(error) throw error;//if err show error message
		//For each tweet
  		for(var i=0;i<tweets.length;i++){
  			//log the tweet
  			console.log("Tweet "+(i+1)+": "+tweets[i].text)
  		};  
	});
}

//If spotify-this-song is the third argument in command line
if(process.argv[2] === "spotify-this-song"){
	var songTitle = "";
	//Starts a for loop that will patch the song title together with ' 's
	for (var i = 3; i < nodeArgs.length; i++) {
		//If there is more than one word in the song title
		if (i > 3 && i < nodeArgs.length){
			//Patch together song title
			songTitle = songTitle + " " + nodeArgs[i];
		}
	  	else{
	   		songTitle += nodeArgs[i];
	  	}
	}
	//Query the Spotify API
	spotify
		.search({ type: 'track', query: songTitle, limit: 1 })
		.then(function(response){
			//Display track information
			console.log("Artist: "+response.tracks.items[0].album.artists[0].name);
			console.log("Song Title: "+response.tracks.items[0].name);
			console.log("Preview Link: "+response.tracks.items[0].external_urls.spotify);
			console.log("Album: "+response.tracks.items[0].album.name);
		})
		.catch(function(err){
			console.log(err);
		});
}