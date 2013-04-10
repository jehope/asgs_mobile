var inc = 1;
var timer;
var dateO;
var validTimes = Array();
var dateS;
var activeLayer;
var timeSlot;
//init
$("#home").live('pageinit', function(event){
	var now = new Date();
	var dateValue = dateToYMD(now);
	dateO = dateValue;
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;

	
		showLegend('Water Height above MSL');
		

	//ajax get valid times for cera
	$.ajax({
		url:'https://ga.renci.org/cera/wms/?service=WMS&version=1.1.0&request=GetValidTimes',
	    data:"format=json",
	    dataType: 'jsonp',
	    error: function(xmlhttp,error_msg){}
	}).done(function(data) { 
		validTimes = data;
		createCeraTabs(validTimes);
	});
			
	$("#date").val(dateValue);
	$('#scrubber').html('<input type="range" name="slider" id="slider" value="0" min="0" max="23" step="1" data-highlight="true" data-theme="a" data-track-theme="b"/>').trigger("create");
	$('#slider').slider({ highlight: "true" });
	var sliderValue = updateSliderValue($( "#slider" ).val());
	
	$( "#slider" ).bind( "change", function(event, ui) {
		var nowLive = new Date();
		var notLive = new Date($("#date").val());
		var notLive2 = updateSliderValue(notLive.getDate() +1);
		var tempV = updateSliderValue($( "#slider" ).val())
	  	if( sliderValue!=tempV ) {
			inc = $('#slider').val();		
			var maxTime = convertMS(nowLive.getTime());
			if( (tempV<=maxTime) || (notLive2<nowLive.getDate()) ) {					
				sliderValue = tempV;
				console.log(sliderValue);
				var tempDate = dateValue+'T'+sliderValue+':00:00Z';
				console.log(tempDate);
				ia_wms.mergeNewParams({'time':tempDate});
			}
			else {
				var tempDate = dateValue+'T'+maxTime+':00:00Z';
				console.log(tempDate);
				$('#slider').val(maxTime);
				$('#slider').slider('refresh');
				ia_wms.mergeNewParams({'time':tempDate});
			}
		}
	});
	//date scroller for radar	
	$("#date").scroller({
		preset: 'date',
	    maxDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
	    theme: 'ios',
	    display: 'inline',
	    mode: 'scroller',
		'onChange': function(valueText, inst){ 
	        console.log(valueText);
			dateS=valueText;
			if ( window.map && window.map instanceof OpenLayers.Map ) {
				var newDate = dateS +'T'+sliderValue+':00:00Z';
				dateValue = dateS;
				ia_wms.mergeNewParams({'time':newDate});
			}
		}
	}); 
	//animation	for radar
	$("#play").click(function(){
		var $this = $(this);
		if($this.text() == 'Play Animation') {
			$this.children().children().text('Pause Animation');
			playAnimation();
		} else {
			$this.children().children().text('Play Animation');
	        clearTimeout(timer);
		}
	});
	
	$(window).bind("orientationchange resize pageshow", fixContentHeight);
	function findLayerByName(theName){
		for(var i=0;i<map.layers.length;i++) { 
			if(theName == map.layers[i].name) {
				return map.layers[i];
			}
			//Msg += map.layers[i].name + " :: " + map.layers[i].visibility + "\r\n";
		}
	}
	$('#ceraLayers input').click(function() {
		if ( window.map && window.map instanceof OpenLayers.Map ) {
			$("input[type='radio']").attr("checked",false).checkboxradio("refresh"); 
			//$('#ceraLayers').find('input').each(function() {console.log($(this).attr('checked')); $(this).attr('checked',false)});
			var tempLayerName = $(this).val();
			var tempLayer = findLayerByName(tempLayerName);
			showLegend(tempLayerName);
			activeLayer = tempLayer;
			hideCeraLayers(); 
			activeLayer.mergeNewParams({'time':timeSlot});
			tempLayer.setVisibility(true);
			$(this).attr('checked','checked');
			
		}
	});
	function showLegend(theName) {
		console.log(theName);
		$('#legend img').hide();
		switch (theName) {
		   case "Water Height above MSL":
		      $('.wave-height').show();  
		      break;
		   case "Inundation Depth above Ground":
		       $('.inundation').show();
		      break;
		   case "Significant Wave Height":
		      $('.significant-wave').show();      
		      break;
		   case "Relative Peak Wave Period":
		      $('.peak-wave').show();     
		      break;
		   case "Wind Speed":
		 	  $('.wind').show();
		      break;
		   default:
		      //document.write("Sorry, we are out of " + expr + ".<br>");
		}
	}
	function hideCeraLayers() {

		ceralayer.setVisibility(false);
		ceralayer2.setVisibility(false);
		ceralayer3.setVisibility(false);
		ceralayer4.setVisibility(false);
		ceralayer5.setVisibility(false);
	}

	$('#checkbox-2a').click(function() {
		if ( window.map && window.map instanceof OpenLayers.Map ) {
			if(ia_wms.visibility) {
				ia_wms.setVisibility(false);
			}
			else {
				ia_wms.setVisibility(true);
			}
		}
	});
	$('#checkbox-3a').click(function() {
		if ( window.map && window.map instanceof OpenLayers.Map ) {
			if(hurricanes.visibility) {
				hurricanes.setVisibility(false);
			}
			else {
				hurricanes.setVisibility(true);
			}
		}
	});
	$('#checkbox-4a').click(function() {
		if ( window.map && window.map instanceof OpenLayers.Map ) {
			if(warnings.visibility) {
				warnings.setVisibility(false);
			}
			else {
				warnings.setVisibility(true);
			}
		}
	});
	$('#checkbox-5a').click(function() {
		if ( window.map && window.map instanceof OpenLayers.Map ) {
			if(rainfall.visibility) {
				rainfall.setVisibility(false);
			}
			else {
				rainfall.setVisibility(true);
			}
		}
	});

});

//functions
function updateSliderValue(valueS) {
	if(valueS<10){
		return '0'+valueS;
	}
	else {
		return valueS;
	}
}
function dateToYMD(date)
{
    var d = date.getDate();
    var m = date.getMonth()+1;
    var y = date.getFullYear();
    return '' + y +'-'+ (m<=9?'0'+m:m) +'-'+ (d<=9?'0'+d:d);
}
function numericToAlpha(thi){
	var alphaArr = new Array('a','b','c','d','e','f','g','h');
	return alphaArr[thi];
}
function createCeraTabs(passArray){
	console.log(passArray.length);
	//get latest five 
	var tempArray = passArray.slice(passArray.length-5,passArray.length);
	console.log(tempArray[0]);
	//	$('#cera-tabs ul ')
	$('#cera-tabs li').each(function (index, domEle) {
		//$(this).find('a').attr('name',tempArray[index]);
		$(this).find('a').click(function() {
			ceraClick(tempArray[index]);

		});
	});
}
function ceraClick(changeTime){
	console.log(changeTime);
	timeSlot = changeTime;
	var tempActiveLayer = activeLayer;
	activeLayer.mergeNewParams({'time':timeSlot});
}
function convertMS(ms) {
    var seconds = ((ms / 1000) % 60);
    var minutes = (((ms / 1000) / 60) % 60);
    var hours = ((((ms / 1000) / 60) / 60) % 24);

    var sec, min, hrs;
    if(seconds<10)  sec="0"+seconds;
    else            sec= ""+seconds;
    if(minutes<10)  min="0"+minutes;
    else            min= ""+minutes;
    if(hours<10)    hrs="0"+hours;
    else            hrs= ""+hours;
	var tempHrs = hrs.split('.');
    return tempHrs[0];

}
function playAnimation(){
	console.log(inc);
	$('#slider').val(inc);
	$('#slider').slider('refresh');
	
	inc = inc+1;
	if(inc>23){inc = 0;}
	timer = setTimeout("playAnimation()",900);
}

// fix height of content
function fixContentHeight() {
    var footer = $("div[data-role='footer']:visible"),
        content = $("div[data-role='content']:visible:visible"),
        viewHeight = $(window).height(),
        contentHeight = viewHeight - footer.outerHeight();

    if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
        contentHeight -= (content.outerHeight() - content.height() + 1);
        content.height(contentHeight);
    }

    if (window.map && window.map instanceof OpenLayers.Map) {
        map.updateSize();
    } else {
        // initialize map
        init(function(feature) { 
            selectedFeature = feature; 
            $.mobile.changePage("#popup", "pop"); 
        });
        //initLayerList();
    }
}