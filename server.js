/* Friend-Finder 
 *  -Steve G, Homework for Rutgers Coding Bootcamp
 ================================================= */

// 1. Dependencies and Global Vars
// ===============================

// express
var express = require('express');
var app = express();

// body parser
var bodyParser = require('body-parser')

// set up port for listener
var PORT = process.env.PORT || 8000;

// set up static content
var staticContentFolder = __dirname + '/app/public';
console.log(staticContentFolder);
app.use(express.static(staticContentFolder));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

// Router files
require('./app/routing/api-routes')(app);
require('./app/routing/html-routes.js')(app);

// Listener
app.listen(PORT, function(){
	console.log("Listening on PORT " + PORT);
})