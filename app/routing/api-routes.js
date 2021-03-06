// Load the data
var friendData = require('../data/friends.json');

// export to the express app
module.exports = function(app) {

	// get route with url /api/friends, 
	// display JSON of all possible friends
	app.get('/api/friends', function(req, res){
		res.json(friendData);
	});

	// POST routes /api/friends, 
	app.post('/api/friends', function(req, res){
		// friendData.push(req.body);
		friendData.friends.push(req.body);
		res.json(friendData);
	});
}