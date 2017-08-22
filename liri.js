//Includes request npm package
var request = require("request");

//Checking for command line argument of movie-this
//  which will run a query of OMDB's api
if(process.argv[2] == "movie-this"){

	//Stores arguments into array
	var nodeArgs = process.argv;
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

	//Using request package, will pull the .json response from the 
	//  OMDB API URL we created 
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

/*Need to figure out how to connect to Twitter API and Spotify API
  The problem I ran into is figuring out how to utilize packages so
  that any developer using/editing this program can use the 
  npm install  command to install all of the needed packages.*/


