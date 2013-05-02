(function () {

    // because JSHint told me to
    'use strict';

	jQuery(document).ready(function($) {
		//layer config needs to load base, asgs, and nws layers respectively...use three LayerCollections

		var json_config = [{ 
		   	"type":"LayerCollection",
		   	"name":"Base Layers",
		   	"thelayers" : [
		   		{"type":"XYZ", "name":"OpenStreetMap MapQuest", "url":[
		   			"http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
                    "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
                    "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
                    "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png"
                    ], "options": {"isBaselayer":"true", "sphericalMercator":"true","transitionEffect":"resize"}
                }/*,
                {"type": "Google", "name":"Google Terrain", "options": {"type":google.maps.MapTypeId.TERRAIN, "isBaselayer":"true", "sphericalMercator":"true","transitionEffect":"resize","visibility":false}
                },
                {"type": "Google", "name":"Google Streets", "options": {"type":"", "isBaselayer":"true", "sphericalMercator":"true","transitionEffect":"resize","visibility":false}
                },
                {"type": "Google", "name":"Google Hybrid", "options": {"type":google.maps.MapTypeId.HYBRID, "isBaselayer":"true", "sphericalMercator":"true","transitionEffect":"resize","visibility":false}
                },
                {"type": "Google", "name":"Google Satellite", "options": {"type":google.maps.MapTypeId.SATELLITE, "isBaselayer":"true", "sphericalMercator":"true","transitionEffect":"resize","visibility":false}
                }*/
		   	]
	   },
	   { 
		   	"type":"LayerCollection",
		   	"name":"ASGS Layers",
		   	"thelayers" : [
		   		{"type":"WMS", "name":"Water Height above MSL", min:0, max:3, configurable: true, units:'m', "description":"The highest water level predicted during the model forecast.", "url":[
		   			"http://geocompute2.renci.org/cera/wms"
                    ],
                    "params" : { "layers": "maxelev.zeta","styles": "water_height", "transparent":"true", "format":"image/png", "renderers": ["Canvas", "SVG", "VML"]}, 
                    "options": { "opacity":"0.9", "ratio": "1","displayOutsideMaxExtent": "true", "sphericalMercator":"true","transitionEffect":"resize", "grouped":true}
                },
                {"type":"WMS", "name":"Inundation Depth above Ground", min:0, max:2, configurable: true, units:'m', "description":"The highest inundation depth predicted during the model forecast.", "url":[
		   			"http://geocompute2.renci.org/cera/wms"
                    ],
                    "visibility": "false",
                    "params" : { "layers": "maxelev.inundationZeta","styles": "inundation_depth", "transparent":"true", "format":"image/png", "renderers": ["Canvas", "SVG", "VML"]}, 
                    "options": { "opacity":"0.9", "ratio": "1","displayOutsideMaxExtent": "true", "sphericalMercator":"true","transitionEffect":"resize", "grouped":true, "visibility":false}
                },
                {"type":"WMS", "name":"Significant Wave Height", min:0, max:3, configurable: true, units:'m', "description":"The highest significant wave height predicted during the model forecast.", "url":[
		   			"http://geocompute2.renci.org/cera/wms"
                    ],
                    "params" : { "layers": "maxhsign.zeta","styles": "wave_height", "transparent":"true", "format":"image/png", "renderers": ["Canvas", "SVG", "VML"]}, 
                    "options": { "opacity":"0.9", "ratio": "1","displayOutsideMaxExtent": "true", "sphericalMercator":"true","transitionEffect":"resize", "grouped":true, "visibility":false}
                },
                {"type":"WMS", "name":"Relative Peak Wave Period", min:0, max:10, configurable: true, units:'', "description":"The highest peak wave period predicted during the model forecast.", "url":[
		   			"http://geocompute2.renci.org/cera/wms"
                    ],
                    "params" : { "layers": "maxtps.zeta","styles": "rel_peak", "transparent":"true", "format":"image/png", "renderers": ["Canvas", "SVG", "VML"]}, 
                    "options": { "opacity":"0.9", "ratio": "1","displayOutsideMaxExtent": "true", "sphericalMercator":"true","transitionEffect":"resize", "grouped":true, "visibility":false}
                },
                {"type":"WMS", "name":"Wind Speed", min:0, max:35, configurable: true, units:'m/sec', "description":"The highest wind speed predicted during the model forecast.", "url":[
		   			"http://geocompute2.renci.org/cera/wms"
                    ],
                    "visibility":"false",
                    "params" : { "layers": "maxwvel.zeta","styles": "wind_speed", "transparent":"true", "format":"image/png", "renderers": ["Canvas", "SVG", "VML"]}, 
                    "options": { "opacity":"0.9", "ratio": "1","displayOutsideMaxExtent": "true", "sphericalMercator":"true","transitionEffect":"resize", "grouped":true, "visibility":false}
                }
		   	]
	   },
	   { 
		   	"type":"LayerCollection",
		   	"name":"Weather Layers",
		   	"thelayers" : [
		   		{"type":"WMS", "name":"NWS Radar", "url":[
		   			"http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi?"
                    ],
                    "params" : { "layers": "nexrad-n0r-wmst", "transparent":"true", "format":"image/png",  "renderers": ["Canvas", "SVG", "VML"]}, 
                    "options": { "displayOutsideMaxExtent": "true", "opacity":"0.7", "ratio": "1", "sphericalMercator":"true","transitionEffect":"resize"}
                },
                {"type":"WMS", "name":"Rainfall Data", "url":[
		   			"http://descartes.renci.org:8080/geoserver/wms"
                    ],
                    "params" : { "layers": "surfaceobs_current", "transparent":"true", "format":"image/png", "renderers": ["Canvas", "SVG", "VML"]}, 
                    "options": { "displayOutsideMaxExtent": "true", "opacity":"0.7", "ratio": "1", "sphericalMercator":"true","transitionEffect":"resize"}
                },
                {"type":"WMS", "name":"Warnings and Watches", "url":[
		   			"http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/wwa?"
                    ],
                    "params" : { "layers": "WARN_SHORT_SVR,WARN_SHORT_TOR,WARN_SHORT_EWW,WARN_SHORT_FLW,WARN_SHORT_FFW", "transparent":"true", "format":"image/png", "renderers": ["Canvas", "SVG", "VML"]}, 
                    "options": { "displayOutsideMaxExtent": "true", "opacity":"1", "ratio": "1", "sphericalMercator":"true","transitionEffect":"resize","visibility":false}
                },
                {"type":"WMS", "name":"Cloud Imagery (GOES Visible)", "url":[
		   			"http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs?"
                    ],
                    "params" : { "layers": "RAS_GOES", "transparent":"true", "format":"image/png", "renderers": ["Canvas", "SVG", "VML"]}, 
                    "options": { "displayOutsideMaxExtent": "true", "opacity":"0.5", "ratio": "1", "sphericalMercator":"true","transitionEffect":"resize","visibility":false}
                },
                {"type":"WMS", "name":"Tropical Cyclone Track Forecast", "url":[
		   			"http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/wwa?"
                    ],
                    "params" : { "layers": "NHC_TRACK_LIN,NHC_TRACK_PT, NHC_TRACK_WWLIN,NHC_TRACK_PT_72DATE,NHC_TRACK_PT_120DATE, NHC_TRACK_PT_0NAMEDATE,NHC_TRACK_PT_MSLPLABELS, NHC_TRACK_PT_72WLBL,NHC_TRACK_PT_120WLBL'", "transparent":"true", "format":"image/png", "renderers": ["Canvas", "SVG", "VML"]}, 
                    "options": { "displayOutsideMaxExtent": "true", "opacity":"0.5", "ratio": "1", "sphericalMercator":"true","transitionEffect":"resize","visibility":false}
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
	    var layerHtml = [];
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
		
	    var lonlat_default = new OpenLayers.LonLat(-83, 33);
	    var totalTiles;
		asgs_app_layers = [];
		scanLayers(json_config);
		addLayerLoaders(asgs_app_layers);
	    map.addLayers(asgs_app_layers);

	    //update time param to get latest
		map.getLayersByName('NWS Radar')[0].mergeNewParams({'time':refreshTime()});

	    //initialize map position
		lonlat_default.transform(gg, sm);
		map.setCenter(lonlat_default, 6);

		//map.addControl(new OpenLayers.Control.LayerSwitcher());
		// create WMTS GetFeatureInfo control
	    // var control = new OpenLayers.Control.WMSGetFeatureInfo({
	    //     layers: [rainfall],
	    //     queryVisible: true
	    // });
	    // control.events.register("getfeatureinfo", this, pickStationid);
	    // map.addControl(control);
	    //control.activate();
	    if(localStorage && localStorage.mapExtent) {
            var me = JSON.parse(localStorage.mapExtent);
            map.setCenter(new OpenLayers.LonLat(me.lon, me.lat), me.zoom);
        }
        else {
            map.setCenter(lonlat_default, 6);
        }

	    /**
	     * [scanLayers loads json object as a recursive function]
	     * @param  {[object]} jsonS [contains layer collections and settings]
	     * @return {[type]}       [description]
	     */
		function scanLayers(obj) {
			
		    _.map(obj,function(val,key){
		    	if(val['type']=='LayerCollection'){
		    		//console.log(val)
	    	 		buildLayerControls(val);
	    	 	}
	    	 	if(key=='thelayers') {
	    	 		_.map(val, function(val2,key2){
	    	 			asgs_app_layers.push(createLayers(val2));	    	 			
	    	 		});
	    	 	}
	    	 	if(val instanceof Object) {
	    	 		scanLayers(val);
	    	 	}
	    	 		    	 	
	    	 });

		}
		function addLayerLoaders(layers){
			console.log('load layers into individual loaders and have a overall loader')
			console.log('overall loader will be in footer...click to popup individual list')
			
			_.map(layers,function(val,key){
				var visibleVar ='';
				console.log(key)
				if(val.options.visibility==false){
					visibleVar = 'hide';
				}
				$('.layer-loads').append('<li class="'+visibleVar+'"><a>'+val.name+' <div class="progress progress-striped active"><div class="bar"></div></div></a></li>');
				layerEvents(val,key);
			})
			$('loader-all-layers');
		}
		function buildLayerControls(layerO){

			var tempLayerGroup =[];
			var tempHtml = $('<ul class="nav nav-list layers"/>');
			tempLayerGroup.name = layerO.name;
			$(tempHtml).append('<li class="nav-header">Layer List <button class="btn btn-mini pull-right disable-layers" type="button">disble all</button></li>');
			_.map(layerO['thelayers'], function(val,key){
				var checkedVar ="checked";
				var tempType = 'checkbox';
				var tempConfigHtml ='';
				
				if(val.options.isBaselayer||val.options.grouped) {
					tempType = 'radio';
				}
				if(val.options.visibility==false) {
					checkedVar	=	'';
				}
				if(val.configurable) {
					tempConfigHtml = '<p class="config '+checkedVar+'">from <input type="text" size="4" class="pal-from span2" value="'+ val.min + '" name="' + val.name + '"> '+ val.units +
                        ' to <input type="text" size="4" class="pal-to span2" value="'+ val.max + '" name="' + val.name + '"> ' + val.units+'</p>';
                }
                

				$(tempHtml).append('<li><a href="#" title="'+val.description+'"><input type="'+tempType+'" name="optionsRadios" value="option1" '+checkedVar+'> '+val.name+'</a>'+tempConfigHtml+'</li>');
			})
			
			tempLayerGroup.html = tempHtml;
			layerHtml.push(tempLayerGroup);

		}
		/**
		 * [createLayers create a OpenLayers.Layer object]
		 * @param  {[object]} layerO [layer json object to build layer with]
		 * @return {[OpenLayers.Layer.type]}        [initialized layer object]
		 */
		function createLayers(layerO){
			var tempLayer;
			if(layerO.type=='XYZ') {
				tempLayer = new OpenLayers.Layer.XYZ(layerO.name, layerO.url,layerO.options);
				return tempLayer;
			}
			if(layerO.type=='WMS') {
				tempLayer = new OpenLayers.Layer.WMS(layerO.name, layerO.url[0],layerO.params,layerO.options);
				return tempLayer;
			}
			if(layerO.type=='Google') {
				tempLayer = new OpenLayers.Layer.Google(layerO.name,{type:layerO.options.type});
				return tempLayer;
			}
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
 			$('.disable-layers').on('click', function(e){
 				$('.layers li a').find('input').prop('checked',false);
 				_.map($('.layers li a'),function(val,key){
					map.getLayersByName($(val).text())[0].setVisibility(false);
 				});
 				
 				//map.layers[getLayerByName($('.layers li a').text())].setVisibility(false);
 			});
			$('.layers li a').on('click', function(e){
				$('.layers-modal .modal-body .desc').empty().append('<p class="text-success"><strong>Layer Description</strong><br/>'+this.title+'</p>');
				$(this).children('input:radio').prop('checked', true);
				
				hideRadioLayers();
				hideLayer($(this).text());
				$(this).siblings('.config').addClass('checked');
				if($(this).children('input').prop('checked')){				
					$(this).children('input').prop('checked',true);
					showLayer($(this).text());
				}
				else {
					$(this).children('input').prop('checked',false);
					hideLayer($(this).text());
				}

				//console.log($(this).text())
			});
			$('.pal-from').change(function() {
                var nm = $(this).attr('name');
                var fr = $(this).val();
                var to = $('.pal-to[name="' + nm + '"]').val();

                map.getLayersByName(nm)[0].mergeNewParams({ styles : fr + ":" + to });
            });
            $('.pal-to').change(function() {
                var nm = $(this).attr('name');
                var fr = $('.pal-from[name="' + nm + '"]').val();
                var to = $(this).val();

                map.getLayersByName(nm)[0].mergeNewParams({ styles : fr + ":" + to });
            });

			$('.close-modal').on('click', function(e){
				$('.layers-modal').modal('hide');
				//console.log($('.hide-nav').hasClass('in'))
				
			});
			$('.layers-modal').on('hide', function () {
  				if ($('.navbar-responsive-collapse').hasClass('in')) {
            		$(".hide-nav").click();
        		}
			});
			
		}
		function refreshTime(){
			var tempTime = new Date(Math.floor(Date.now()/3e5)*3e5);
			var freshTime = OpenLayers.Date.toISOString(tempTime);
			$('.map-details').empty().text(tempTime);
			return freshTime;
		}
		function hideRadioLayers(){
			_.map($('.layers li input:radio'),function(val,key){
				console.log($(val).parent().text())
				$(val).parent().siblings('.config').removeClass('checked');
				hideLayer($(val).parent().text());
			})
		}
		function layerEvents(layerO,loaderItem){
			var tempTotal;
			var loaderLi = $('.layer-loads li').eq(loaderItem);
			layerO.events.register("loadstart", layerO, function() {
				totalTiles += this.grid.length * this.grid[0].length;

				tempTotal = this.grid.length * this.grid[0].length;
				//$(loaderLi).find('.bar').show();
				$('.map-loader .msg').empty().append('Loading');
                console.log("Load Start "+this.grid.length * this.grid[0].length);
            });

            layerO.events.register("tileloaded", layerO, function() {
            	var tempRatio = tempTotal / this.numLoadingTiles;

            
            	$(loaderLi).find('.bar').css({'width':tempRatio * 10+'%'});
                console.log("Tile loaded. " + this.numLoadingTiles + " left.");
            });
            layerO.events.register("loadend", layerO, function() {
               $(loaderLi).find('.progress').removeClass('active');
				//$('.map-loader .msg').empty().append('Loaded');
            });
		}
		function overallLoader(leftToLoad) {
			//totalTiles;
			//leftToLoad
			//$(loaderLi).find('.bar').css({'width':tempRatio * 10+'%'});
		}
		function showLayer(layerName) {
			layerEvents(layerName);
			map.getLayersByName(layerName.trim())[0].setVisibility(true);
		}
		function hideLayer(layerName) {
			map.getLayersByName(layerName.trim())[0].setVisibility(false);
		}
		function redrawLayers(){
			_.map(map.layers,function(val){
				val.redraw();
			})
		}

		/**
		 * [ click events ]
		 * 
		 * 
		 * 
		 */
		$('.base-modal').on('click', function(e){			
			loadModal(layerHtml[0].name,layerHtml[0].html);
			$('.layers-modal').modal('show');
		});
		$('.asgs-modal').on('click', function(e){
			loadModal(layerHtml[1].name,layerHtml[1].html);
			$('.layers-modal').modal('show');
		});
		$('.data-overlays').on('click', function(e){
			loadModal(layerHtml[2].name,layerHtml[2].html);
			$('.layers-modal').modal('show');
		});
		$('.olMap').on('mouseup', function(e){			
			if ($('.navbar-responsive-collapse').hasClass('in')) {
            	$(".hide-nav").click();
        	}
		});
		
		
		$('.map-zoom button').on('click', function(e){
			if($(this).hasClass('zoom-in')) {
				map.setCenter('',map.getZoom()+1);
				//redrawLayers();
			}			
			if($(this).hasClass('zoom-out')) {
				map.setCenter('',map.getZoom()-1);
				//redrawLayers();
			}
			if($(this).hasClass('refresh-layers')) {
				map.getLayersByName('NWS Radar')[0].mergeNewParams({'time':refreshTime()});
			}
		});
		map.events.on({moveend: function(){
			redrawLayers();
			var center = map.getCenter();
            var zoom = map.getZoom();
            localStorage.mapExtent = JSON.stringify({ lon: center.lon , lat: center.lat, zoom: zoom });
            if ($('.navbar-responsive-collapse').hasClass('in')) {
            	$(".hide-nav").click();
        	}
		}});

		
		

	});



}());