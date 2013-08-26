$(function() {
	$("#pieces_in_hand_area").hide();
	
	$("#pieces_in_hand_button").click(function() {
		$("#pieces_in_hand_area").toggle("slide", 500);
	});
});