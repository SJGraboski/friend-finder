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
	var theDiv = $("<div>");
	
	// create the headline
	var theHeadline = $("<h5>").addClass("friendHeadline");
	theHeadline.text("It's " + bestie.name + "!");
	
	// create the image
	var theImage = $('<img>').addClass("friendPhoto");
	theImage.attr("src", bestie.photo);
	
	// father the div
	theDiv.append(theHeadline, theImage);

	// append the div to the modal
	$("#friend-info").html(theDiv);
}

// main function (collects and sends data)
function main(){


	// define data variable
	var data = {};

	// collect data in proper format
	data.name = $('input[name="name"]').val();
	data.photo = $('input[name="photo"]').val();
	data.scores = [];
	for (var i = 1; i <= 10; i++) {
		data.scores[i-1] = $('input[name="scores[' + i + ']"]:checked').val();
	}

	// for debugging's sake
	console.log(data);

	// Ajax call for grabbing info for comparison
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
			console.log(response);
			return false
		})
	})

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
