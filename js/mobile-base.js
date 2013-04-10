// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

// initialize map when page ready
var map;
var ia_wms;
var ceralayer,ceralayer2,ceralayer3,ceralayer4,ceralayer5;
var warnings;
var hurricanes;
var rainfall;
var gg = new OpenLayers.Projection("EPSG:4326");
var sm = new OpenLayers.Projection("EPSG:900913");
var drawObject=[];
var init = function (onSelectFeatureFunction) {


 
    // create a vector layer for drawing
    var vector = new OpenLayers.Layer.Vector('Drawing Layer', {
        styleMap: new OpenLayers.StyleMap({
            temporary: OpenLayers.Util.applyDefaults({
                pointRadius: 16
            }, OpenLayers.Feature.Vector.style.temporary)
        })
    });

    // OpenLayers' EditingToolbar internally creates a Navigation control, we
    // want a TouchNavigation control here so we create our own editing toolbar
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
    drawer.events.register("featureadded",' ',controlDraw);
    function controlDraw(data) {
        drawObject.push(data);
        var wktwriter = new OpenLayers.Format.WKT();
        var wkt = wktwriter.write(data.feature);
        
        $.ajax({
          type: 'POST',
          url: 'http://ga.renci.org/cera/alerts/',
          data: wkt,
          dataType: 'jsonp',
          error: function(err){ alert(err);},
          success: successPost
        });
        $( "#popupPanel" ).on({
            popupbeforeposition: function() {
                var h = $( window ).height();

                $( "#popupPanel" ).css( "height", h );
            }
        });
        
        //ga.renci.org/cera/alerts 
        //alert('here:'+data.feature.geometry);
    }
    ceralayer = new OpenLayers.Layer.WMS("Water Height above MSL","http://geocompute2.renci.org/cera/wms",{
            layers:"maxelev.zeta",projection: gg,transparent:true,format:'image/png', renderers: ["Canvas", "SVG", "VML"], 
           styles: 'water_height'
            },{
                singleTile: true,
                opacity:.9, 
                ratio: 1
            });
    ceralayer2 = new OpenLayers.Layer.WMS("Inundation Depth above Ground","http://geocompute2.renci.org/cera/wms",{
            layers:"maxelev.inundationZeta",projection: gg,transparent:true,format:'image/png', renderers: ["Canvas", "SVG", "VML"], 
           styles: 'water_height'
            },{
                singleTile: true,
                opacity:.9, 
                ratio: 1,
                visibility: false
            });
    ceralayer3 = new OpenLayers.Layer.WMS("Significant Wave Height","http://geocompute2.renci.org/cera/wms",{
            layers:"maxhsign.zeta",projection: gg,transparent:true,format:'image/png', renderers: ["Canvas", "SVG", "VML"], 
           styles: 'water_height'
            },{
                singleTile: true,
                opacity:.9, 
                ratio: 1,
                visibility: false
            });
    ceralayer4 = new OpenLayers.Layer.WMS("Relative Peak Wave Period","http://geocompute2.renci.org/cera/wms",{
            layers:"maxtps.zeta",projection: gg,transparent:true,format:'image/png', renderers: ["Canvas", "SVG", "VML"], 
           styles: 'water_height'
            },{
                singleTile: true,
                opacity:.9, 
                ratio: 1,
                visibility: false
            });
    ceralayer5 = new OpenLayers.Layer.WMS("Wind Speed","http://geocompute2.renci.org/cera/wms",{
            layers:"maxwvel.zeta",projection: gg,transparent:true,format:'image/png', renderers: ["Canvas", "SVG", "VML"], 
           styles: 'default'
            },{
                singleTile: true,
                opacity:.9, 
                ratio: 1,
                visibility: false
            });
            //time format '2012-07-29T01:00:00Z'
    ia_wms = new OpenLayers.Layer.WMS("Nexrad","http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi?",{
            layers:"nexrad-n0r-wmst",projection: gg,transparent:true,format:'image/png',time:dateO+'T00:00:00Z',renderers: ["Canvas", "SVG", "VML"]
            },{
                singleTile: true,
                opacity:.7, 
                ratio: 1 
                
            });
    rainfall = new OpenLayers.Layer.WMS("Nexrad","http://descartes.renci.org:8080/geoserver/wms",{
            layers: 'surfaceobs_current',projection: gg,transparent:true,format:'image/png',renderers: ["Canvas", "SVG", "VML"]
            },{
                singleTile: true,
                opacity:.7, 
                ratio: 1 
                
            });       
    var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        geolocationOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 7000
        }
    });
    hurricanes = new OpenLayers.Layer.WMS(
                    "Tropical Cyclone Track Forecast", 
                    "http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/wwa?",
                    { layers:'NHC_TRACK_LIN,NHC_TRACK_PT,'+
                        'NHC_TRACK_WWLIN,NHC_TRACK_PT_72DATE,NHC_TRACK_PT_120DATE,'+
                        'NHC_TRACK_PT_0NAMEDATE,NHC_TRACK_PT_MSLPLABELS,'+
                        'NHC_TRACK_PT_72WLBL,NHC_TRACK_PT_120WLBL',
                       transparent: true,
                       format: 'image/png'
                    },
                    {isBaselayer: false,
                     singleTile: true,
                     ratio: 1
                     } 
                    );
     warnings = new OpenLayers.Layer.WMS(
                                    "Warnings", 
                                    "http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/wwa?",
                                    { layers:'	WARN_SHORT_SVR',
                                       transparent: true,
                                       format: 'image/png'
                                    },
                                    {isBaselayer: false,
                                     singleTile: true,
                                     ratio: 1
                                     } 
    );
    
    //var layerSwitcher = new OpenLayers.Control.LayerSwitcher();               
    // create map
    var mycenter = new OpenLayers.LonLat(-83, 33);
    mycenter.transform(gg, sm);
    map = new OpenLayers.Map({
        div: "mapDiv",
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
            geolocate,
            new OpenLayers.Control.Zoom(),
            toolbar
            
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize',
                
            }),
            ceralayer,
            ceralayer2,
            ceralayer3,
            ceralayer4,
            ceralayer5,
            warnings,
            ia_wms, 
            hurricanes,
            rainfall
        ],
        center: mycenter,
        zoom: 6
    });
    // create WMTS GetFeatureInfo control
    control = new OpenLayers.Control.WMSGetFeatureInfo({
        layers: [rainfall],
        queryVisible: true
    });
    control.events.register("getfeatureinfo", this, pickStationid);
    map.addControl(control);
    control.activate();

    //add drawing layer
    map.addLayer(vector);
    var style = {
        fillOpacity: 0.1,
        fillColor: '#000',
        strokeColor: '#f00',
        strokeOpacity: 0.6
    };
   function pickStationid(e) {
  if (e.features && e.features.length) {
     var val = e.features[0].attributes.id;
     console.log(val);
  }
}
    geolocate.events.register("locationupdated", this, function(e) {
        vector.removeAllFeatures();
        vector.addFeatures([
            new OpenLayers.Feature.Vector(
                e.point,
                {},
                {
                    graphicName: 'cross',
                    strokeColor: '#f00',
                    strokeWidth: 2,
                    fillOpacity: 0,
                    pointRadius: 10
                }
            ),
            new OpenLayers.Feature.Vector(
                OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                    e.position.coords.accuracy / 2,
                    50,
                    0
                ),
                {},
                style
            )
        ]);
        map.zoomToExtent(vector.getDataExtent());
    });

    var overlayLayers = map.getLayersBy("isBaseLayer", false);
    $.each(overlayLayers, function() {
        //addLayerToList(this);
        console.log(this.name);
    });
    
function finishDraw() {
    alert('done');
}
function successPost() {
    alert('done');
}
    //alert(ceralayer.getURL());

};
