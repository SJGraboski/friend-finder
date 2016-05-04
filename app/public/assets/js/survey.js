// relation mapper function
function relationMapper (subject, friendArr){
	// make array for collecting differences
	var allDifs = [];

	// for loop runs through array
	for (var i = 0; i < friendArr.length; i++) {
		// var for diffrence of particular friend
		var difference = 0;
		// nested for loop runs through each question
		for (var j = 0; j < 10; j++) {
			difference += Math.abs(subject.scores[j] - friendArr[i].scores[j]);
		}
		// push difference into allDifs array
		allDifs.push(difference);
	}
	// get the lowest value in the allDifs array
	var minValue = Math.min.apply(this, allDifs);

	// this will search the array, 
	// then grab the index for the first occurrence 
	// of the minimum value (minValue)
	var friendIndex = $.inArray(minValue, allDifs);

	// get the friend
	return friendArr[friendIndex];
}

// display friend data in bootstrap modal
function displayBestie(bestie) {
	// create div
	var theDiv = $("<div>").addClass('bestie');
	
	// create the headline
	var theHeadline = $("<h5>").addClass("friendHeadline");
	theHeadline.text("It's " + bestie.name + "!");
	
	// create the image
	var theImage = $('<img>').addClass("friendPhoto");
	theImage.attr("src", bestie.photo);
	
	// father the div
	theDiv.append(theHeadline, theImage);

	// change h4 of modal
	$("#myModalLabel").text("We found you a friend!");

	// append the div to the modal
	$("#friend-info").html(theDiv);
}

// display error message
function displayError(message) {
	// make modal show we got errors
	$("#myModalLabel").text("You didn't fill out everything!");
	// make the p elements
	var theError = $('<p>').addClass("error");
	theError.text(message);

	// put it in the error box
	$(".modal-body").append(theError);
}

// display missing field message
function displayMissing(area){
	// make div
	var theDiv = $("<div>");
	// make p tag
	var theP = $("<p>")
					.addClass("missing")
					.text("Missing Field");
	// append p to div
	theDiv.append(theP);
	// append div to designated area
	$(area).append(theDiv);
}

// main function (collects and sends data)
function main(){

	// remove existing error messages or friend info
	$('.error').remove();
	$('.missing').remove();
	$('.bestie').remove();

	// define data variable
	var data = {};

	// collect data in proper format
	data.name = $('input[name="name"]').val().trim();
	data.photo = $('input[name="photo"]').val().trim();
	data.scores = [];
	for (var i = 1; i <= 10; i++) {
		data.scores[i-1] = $('input[name="scores[' + i + ']"]:checked').val();
	};

	// check that name data is filled
	if (data.name) {
		var nameData = true;
	}
	else {
		var nameData = false;
	}

	// check that photo data is filled
	if (data.photo) {
		var photoData = true;
	}
	else {
		var photoData = false
	}

	// check that score data is filled
	var scoresData = true;
	for (var i = 0; i < 10; i++) {
		if (!data.scores[i]) {
			scoresData = false;
		}
	}

	// Ajax call for grabbing info for comparison
	if (nameData && photoData && scoresData) {
		$.ajax({
			url: "/api/friends",
		}).done(function(response) {
			// run relationMapper function, save nearest friend
			var bestie = relationMapper(data, response.friends);
			
			// run displayBestie to populate the modal with the bestie
			displayBestie(bestie);

			//run a POST ajax to save the data to the server
			$.ajax({
				url: "api/friends",
				method: "POST",
				data: data
			}).done(function(response) {
				// log response to prove that the new data is there
				return false
			})
		})
		return false;
	}

	// error drops
	else {
		// if not name data
		if (!nameData) {
			displayMissing('#name');
			displayError("You didn't enter a name.");
		}
		// if no photo data
		if (!photoData){
			displayMissing('#photo');
			displayError("You didn't give us a link to a photo.");
		}
		// if not all scores entered
		if (!scoresData){
			displayError("You didn't answer all of the questions.");
			// go through each score
			for (var i = 0; i < 10; i++) {
				// whenever you find one that's not there, show "missing field"
				// in apropos location
				if (!data.scores[i]) {
					displayMissing("#q" + (i+1));
				}
			}
		}
	}
	// return false to prevent refresh
	return false;

}

// ready a click event
$(document).ready(function() {
	$(document).on('click', '#theButton', function(){
		main();
		// prevent page from refreshing
		return false;
	});
})
