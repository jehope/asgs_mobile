$(document).ready(function(){

	$('#scrubber').append('<input type="range" name="slider" id="slider" value="0" min="0" max="23" step="1" data-highlight="true" data-theme="a" data-track-theme="b"/>').trigger("create");
	$('#slider').slider({ highlight: "true" });
	
	CERAMAP.init();
});