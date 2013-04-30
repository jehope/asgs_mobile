(function () {

    // because JSHint told me to
    'use strict';

	jQuery(document).ready(function($) {
		//layer config needs to load base, asgs, and nws layers respectively...use three LayerCollections

		var json_config = [{ 
		   	"type":"LayerCollection",
		   	"name":"Base Layers",
		   	"thelayers" : [
		   		{"type":"XYZ", "name":"OpenStreetMap", "url":[
		   			"http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
                    "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
                    "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
                    "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png"
                    ], "options": {"isBaselayer":"true", "sphericalMercator":"true","transitionEffect":"resize"}
                }
		   	]
	   },
	   { 
		   	"type":"LayerCollection",
		   	"name":"NWS Data",
		   	"thelayers" : [
		   		{"type":"WMS", "name":"Nextrad Radar", "url":[
		   			"http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi?"
                    ],
                    "params" : { "layers": "nexrad-n0r-wmst", "transparent":true, "format":"image/png",  "renderers": ["Canvas", "SVG", "VML"]}, 
                    "options": { "singleTile":true,"displayOutsideMaxExtent": true, "opacity":0.7, "ratio": "1", "sphericalMercator":true,"transitionEffect":"resize"}
                },
                {"type":"WMS", "name":"Rainfall Data", "url":[
		   			"http://descartes.renci.org:8080/geoserver/wms"
                    ],
                    "params" : { "layers": "surfaceobs_current", "transparent":"true", "format":"image/png", "renderers": ["Canvas", "SVG", "VML"]}, 
                    "options": { "singleTile":true,"displayOutsideMaxExtent": true, "opacity":0.7, "ratio": 1, "sphericalMercator":"true","transitionEffect":"resize"}
                }
		   	]
	   }]
		// OpenLayers' EditingToolbar internally creates a Navigation control, we
	    // want a TouchNavigation control here so we create our own editing toolbar
	    var toolbar = new OpenLayers.Control.Panel({
	        displayClass: 'olControlEditingToolbar'
	    });
	    var drawer;
	    var drawObject=[];
		var asgs_app_layers = [],
		gg = new OpenLayers.Projection('EPSG:4326'),
    	sm = new OpenLayers.Projection('EPSG:900913'),
	    map = new OpenLayers.Map({
	        div: 'map-fullwidth',
	        projection: sm,
	        displayProjection: gg,
        	numZoomLevels: 18,
        	controls: [
            	new OpenLayers.Control.Attribution(),
            	new OpenLayers.Control.Navigation(),
            	new OpenLayers.Control.LayerSwitcher(),
            	toolbar
            ]
	    });

	    var tempasgs_app_layers =[];
	    loadLayers(json_config);
	    var lonlat_default = new OpenLayers.LonLat(-83, 33);
		var last5min = new Date(Math.floor(Date.now()/3e5)*3e5);

        var warnings = new OpenLayers.Layer.WMS(
            "Warnings", 
            "http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/wwa?",
            { 
            	layers:'WARN_SHORT_SVR,WARN_SHORT_TOR,WARN_SHORT_EWW,WARN_SHORT_FLW,WARN_SHORT_FFW',
            	transparent: true,
            	format: 'image/png'
            },
            {
            	isBaselayer: false,
	            singleTile: true,
	            ratio: 1,
                transitionEffect:'resize',
                isBaseLayer: false, 
                displayOutsideMaxExtent: true
             } 
   		); 
        console.log(last5min);
	   	    // create a vector layer for drawing
	    var vector = new OpenLayers.Layer.Vector('Drawing Layer', {
	        styleMap: new OpenLayers.StyleMap({
	            temporary: OpenLayers.Util.applyDefaults({
	                pointRadius: 16
	            }, OpenLayers.Feature.Vector.style.temporary)
	        })
	    });

	    
	    toolbar.addControls([
	        // this control is just there to be able to deactivate the drawing
	        // tools
	        new OpenLayers.Control({
	            displayClass: 'olControlNavigation'
	        }),

	        drawer = new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Polygon, {
	            displayClass: 'olControlDrawFeaturePolygon',
	            callback: finishDraw
	        })
	    ]);
	    drawer.events.register("featureadded",' ',controlDraw);
	    function controlDraw(data) {
	        drawObject.push(data);
	        var wktwriter = new OpenLayers.Format.WKT();
	        var wkt = wktwriter.write(data.feature);
	        console.log(wkt)
	        // $.ajax({
	        //   type: 'POST',
	        //   url: 'http://ga.renci.org/cera/alerts/',
	        //   data: wkt,
	        //   dataType: 'jsonp',
	        //   error: function(err){ alert(err);},
	        //   success: successPost
	        // });
	        // $( "#popupPanel" ).on({
	        //     popupbeforeposition: function() {
	        //         var h = $( window ).height();

	        //         $( "#popupPanel" ).css( "height", h );
	        //     }
	        // });
	        
	        //ga.renci.org/cera/alerts 
	        //alert('here:'+data.feature.geometry);
	    }
function finishDraw() {
    alert('done');
}
function successPost() {
    alert('done');
}
	    console.log(map)
	    map.addLayers(tempasgs_app_layers);
		map.layers[1].mergeNewParams({'time':OpenLayers.Date.toISOString(last5min)});
	    //initialize map position
		lonlat_default.transform(gg, sm);
		map.setCenter(lonlat_default, 5);

		//map.addControl(new OpenLayers.Control.LayerSwitcher());
		// create WMTS GetFeatureInfo control
	    // var control = new OpenLayers.Control.WMSGetFeatureInfo({
	    //     layers: [rainfall],
	    //     queryVisible: true
	    // });
	    // control.events.register("getfeatureinfo", this, pickStationid);
	    // map.addControl(control);
	    //control.activate();



	    function loadLayers(jsonS){
	    	var layerObject =  jsonS;
	
	    	scanLayers(layerObject);
	    	return '';
	    }

		function scanLayers(obj)
		{
		    _.map(obj,function(val,key){
	    	 	
	    	 	if(key=='thelayers') {
	    	 		
	    	 		console.log(key+':'+val)
	    	 		_.map(val, function(key2,val2){
	    	 			createLayers(key2)
	    	 		})
	    	 	}
	    	 	if(val instanceof Object) {
	    	 		scanLayers(val);
	    	 	}
	    	 	
	    	 	
	    	 });

		}
		function createLayers(layerO){
			console.log(layerO)
			var tempLayer;
			
			if(layerO.type=='XYZ') {
				tempLayer = new OpenLayers.Layer.XYZ(layerO.name, layerO.url,layerO.options);
				tempasgs_app_layers.push(tempLayer);
			}
			if(layerO.type=='WMS') {
				tempLayer = new OpenLayers.Layer.WMS(layerO.name, layerO.url[0],layerO.params,layerO.options);
				tempasgs_app_layers.push(tempLayer);
			}
			// _.map(layerO, function(key,val){
			// 	console.log(key)
				
			// 	// var tempLayer = new OpenLayers.Layer
			
			// })
			console.log(tempasgs_app_layers)
			
		}
    	function createASGSLayers(){
	   		var layer_list = $('<ul class="nav nav-list layers"/>');
	   		var layer_string = ['Water Height above MSL','Inundation Depth above Ground','Significant Wave Height','Relative Peak Wave Period','Wind Speed'];

	   		$(layer_list).append('<li class="nav-header">Layer List <button class="btn btn-mini pull-right" type="button">disble all</button></li>');
	   		$(layer_list).append('<li><a href="#" title="Maximum Water Height, Forecast Time Range:  Sat, 27-Apr-2013, 8 PM EDT  -  Wed, 01-May-2013, 8 AM EDT"><input type="radio" name="optionsRadios" value="option1" checked> Water Height above MSL</a></li>');
	   		$(layer_list).append('<li><a href="#" title="Maximum Inundation Depth, Forecast Time Range:  Sat, 27-Apr-2013, 8 PM EDT  -  Wed, 01-May-2013, 8 AM EDT"><input type="radio" name="optionsRadios"  value="option1" > Inundation Depth above Ground</a></li>');
	   		$(layer_list).append('<li><a href="#"><input type="radio" name="optionsRadios" value="option1" > Significant Wave Height</a></li>');
	   		return layer_list;
    	}
    	function createNWSLayers(){
	   		var layer_list = $('<ul class="nav nav-list layers"/>');
	   		var layer_string = ['Water Height above MSL','Inundation Depth above Ground','Significant Wave Height','Relative Peak Wave Period','Wind Speed'];

	   		$(layer_list).append('<li class="nav-header">Layer List <button class="btn btn-mini pull-right" type="button">disble all</button></li>');
	   		$(layer_list).append('<li><a href="#" title="Nexrad Radar"><input type="checkbox" name="optionsRadios" value="option1" checked> Radar</a></li>');
	   		$(layer_list).append('<li><a href="#" title="Rainfall stations"><input type="checkbox" name="optionsRadios"  value="option1" checked> Rainfall</a></li>');
	   		$(layer_list).append('<li><a href="#"><input type="checkbox" name="optionsRadios" value="option1" checked> Watches & Warnings</a></li>');
	   		return layer_list;
    	}
			

	    function pickStationid(e) {
		  if (e.features && e.features.length) {
		     var val = e.feature;
		     console.log(val);
		  }
		}
		function loadModal(title,content) {
			console.log(content)
			$('.layers-modal .modal-header h3').empty().append(title);
			$('.layers-modal .modal-body').empty().append(content);
			$('.layers-modal .modal-body').append('<div class="desc"/>');
			$('.layers-modal .modal-body .desc').empty().append('<p class="text-success"><strong>Layer Description</strong><br/>'+$('li',content).find(':checked').closest('a').attr('title')+'</p>');

			$('.layers li a').on('click', function(e){
				$('.layers-modal .modal-body .desc').empty().append('<p class="text-success"><strong>Layer Description</strong><br/>'+this.title+'</p>');
				$(this).children('input:radio').prop('checked', true);

				if($(this).children('input:checkbox').prop('checked')){				
					$(this).children('input:checkbox').prop('checked',true);
				}
				else {
					$(this).children('input:checkbox').prop('checked',false);
				}
			});
		}

		/**
		 * [ click events ]
		 * 
		 * 
		 * 
		 */
		$('.asgs-modal').on('click', function(e){
			console.log('click')
			console.log(asgs_app_layers)
			//e.preventDefault();
			
			loadModal('ASGS Layers',createASGSLayers());
			$('.layers-modal').modal('show');
			

		});
		$('.data-overlays').on('click', function(e){
			loadModal('NWS Layers',createNWSLayers());
			$('.layers-modal').modal('show');
		});
		

	});



}());