var request = require("request");//Includes request npm package
var Twitter = require("twitter");//Include twitter package
var Spotify = require("node-spotify-api");//Include spotify package
const fs = require("fs");

var twitterKeys = require("./keys.js");//Keep twitterKeys private
//Create our Twitter client
var client = new Twitter({
  consumer_key: twitterKeys.twitterKeys.consumer_key,
  consumer_secret: twitterKeys.twitterKeys.consumer_secret,
  access_token_key: twitterKeys.twitterKeys.access_token_key,
  access_token_secret: twitterKeys.twitterKeys.access_token_secret
});
//Create the Spotify client
var spotify = new Spotify({
  id: "7084abeda56d4bcb9b19cf6aa1e640c4", 
  secret: "4911edbea69e4c989dae8b52fbe9581b"
});
//Store process.argv for easy access
var nodeArgs = process.argv;

//movieThis function
var movieThis = function(movieName){
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
//Function that patches together the users query/runs movieThis
var patchMovie = function(){
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
	movieThis(movieName);
}
//myTweets function
var myTweets = function(){
	//Use the Twitter client to get tweets from my timeline
	client.get("https://api.twitter.com/1.1/statuses/user_timeline.json", function(error, tweets, response) {
		if(error) throw error;//if err show error message
		//For each tweet
  		for(var i=0;i<tweets.length;i++){
  			//Log the tweet
  			console.log("Tweet "+(i+1)+": "+tweets[i].text)
  		};  
	});
}
//spotifyThisSong function
var spotifyThisSong = function(song){
	//Query the Spotify API
	spotify
		.search({ type: 'track', query: song, limit: 1 })
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
//Function that patches together the users query/runs spotifyThisSong
var patchSong = function(){
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
	spotifyThisSong(songTitle); //Spotify the song
}
//doWhatItSaysCommand function
var doWhatItSaysCommand= function(){
	//Use file system to read random.txt
	fs.readFile("random.txt", "utf8", function(error, data){
		var commands = data.split(",");//Split the commands from the .txt files
		var command = commands[0]; //The first item in array is the command
		commands = commands[1].split(" "); //Split the second command if more than 1 word
		var query = commands[0];
		console.log(commands);
		for(var i=1;i<commands.length;i++){
			query = query+"+"+commands[i];
		}
		//Remove quotations
		query = query.replace("\"", "");
		query = query.replace("\"", "");
		console.log(query);
		//checks the command and executes the appropriate function
		switch(command){
			case "spotify-this-song":
				console.log(query);
				spotifyThisSong(query);
				break;
			default:
				console.log("LIRI doesn't know that");
		}
	});
}
//Pick which function to executed
var pickFunction = function(command){
	switch(command){
		case "movie-this":
			patchMovie();
			break;
		case "my-tweets":
			myTweets();
			break;
		case "spotify-this-song":
			patchSong();
			break;
		case "do-what-it-says":
			doWhatItSaysCommand();
			break;
		default: 
			console.log("Liri doesn't know that");

	}
}
//Run the program
var run = function(argOne){
	pickFunction(argOne);
}
run(nodeArgs[2]);