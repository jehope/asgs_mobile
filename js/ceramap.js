var CERAMAP = ( function(_s, $){
	"use strict"; //for javascript parser...jslint likes this
    // initialize map when page ready
    var map;
    var ia_wms;
    var ceralayer;
    var warnings;
    var hurricanes;
    var gg = new OpenLayers.Projection("EPSG:4326");
    var sm = new OpenLayers.Projection("EPSG:900913");
    var drawObject=[];
    
	// initializer to start map
	_s.init = function(){
			
	    	initMap();
	    
	};
	
	function initMap() {
	    // create map
        var mycenter = new OpenLayers.LonLat(-83, 33);
        mycenter.transform(gg, sm);
        var mapDiv = $.find('#home');
        map = new OpenLayers.Map({
            div: mapDiv,
            theme: null,
            projection: sm,
    		displayProjection: gg,
            maxResolution: "auto",
            numZoomLevels: 18,
            controls: [
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.TouchNavigation({
                    dragPanOptions: {
                        enableKinetic: true
                    }
                }),
                toolbar

            ],
            layers: [
                new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                    transitionEffect: 'resize',

                })
            ],
            center: mycenter,
            zoom: 6
        });
        var toolbar = new OpenLayers.Control.Panel({
            displayClass: 'olControlEditingToolbar'
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
	}
	
	return _s;

}( CERAMAP || {},  jQuery))