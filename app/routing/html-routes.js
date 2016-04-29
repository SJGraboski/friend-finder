var path = require('path');
// exports
module.exports = function(app){

	// get route to survey
	app.get("/survey", function(req, res){
		res.sendFile(path.join("/../../app/public/survey.html"));
	});

	// use route to home
	app.use(function(req, res){
		res.sendFile(path.join(__dirname + "/../../app/public/home.html"));
	});

}