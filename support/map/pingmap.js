var map = null;
function initialize() {
  var y = (39.158542 + 39.701141) / 2;
  var x = (141.183678 + 141.136431) / 2;
  var latlng = new google.maps.LatLng(y, x);
  var myOptions = {
    zoom: 10,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

$("#map_canvas").ready(function() {
    initialize();

    $.ajax({
        url: 'http://log.blog.klab.org/support/map/pinglog.json',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $.each(data['events'], function(i, ev) {
                var loc0 = null, loc1 = null, t0 = null, t1 = null, thickness = 1;
                if ('sent' in ev) {
                    loc0 = new google.maps.LatLng(ev['sent'][1], ev['sent'][2]);
                    t0 = ev['sent'][0];
                }
                if ('received' in ev) {
                    loc1 = new google.maps.LatLng(ev['received'][1], ev['received'][2]);
                    t1 = ev['received'][0];
                }

                if (loc0 != null && loc1 != null) {
                    console.log('t0: ' + t0 + ' -  t1: ' + t1 + ' => ' + (t1 - t0));
                    var dt = t1 - t0;
                    if (dt <= 100) {
                        thickness = 20;
                    } else if (dt <= 200) {
                        thickness = 12;
                    } else if (dt <= 400) {
                        thickness = 7;
                    } else if (dt <= 1000) {
                        thickness = 4;
                    } else if (dt <= 2000) {
                        thickness = 2;
                    }

                    var path = new google.maps.Polyline({
                        path: [loc0, loc1],
                        strokeColor: "#FF0000",
                        strokeOpacity: 1.0,
                        strokeWeight: thickness 
                    });
                    path.setMap(map);
                    google.maps.event.addListener(path, 'click', function() {
                        alert('clicked')
                    });
                }
            });
        }
    });
});
