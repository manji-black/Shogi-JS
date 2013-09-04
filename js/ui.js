$(function() {
	/*=== 持ち駒エリアの表示 ===*/
	$("#pieces_in_hand_area").hide();
	
	$("#pieces_in_hand_button").click(function() {
		$("#pieces_in_hand_area").toggle("slide", 500);
	});
	
	/*=== アプリ情報エリアの表示 ===*/
	$("#app_info_area")
		.accordion({header: "h5", 
					collapsible: true});
	
	$("#app_info_area").hide();
	
	$("#app_info_button").click(function() {
		$("#app_info_area").toggle("slide", 500);
	});
});