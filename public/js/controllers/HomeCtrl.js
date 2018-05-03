var app = angular.module('watchOut');

app.controller('HomeCtrl', function ($scope, $firebaseArray) {

    mapboxgl.accessToken = 'pk.eyJ1IjoibWV6YXIiLCJhIjoiY2pnZzh5amMyNDVidjJ3bGlveGEyeDZxaSJ9.eV1srEZNonNXeljsG18mww';


    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mezar/cjgp399qn00bc2rp3gjqgyqiy',
        center: [12.6914093,56.0573607],
        zoom: 16
    });







    var ref = firebase.database().ref().child('locations');
    var users = $firebaseArray(ref);


    $scope.watchOut = function () {
        navigator.geolocation.getCurrentPosition(function (pos) {
            console.log(pos.coords);
            var location = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            };
            var geojson = {
                "type": "FeatureCollection",
                "features": [
                   
                    {
                        "type": "Feature",
                        "properties": {
                            "message": "Baz",
                            "iconSize": [19, 22]
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                12.6914093,
                                56.0573607
                            ]
                        }
                    }
                ]
            };
            
            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mezar/cjgp399qn00bc2rp3gjqgyqiy',
                center: [location.latitude,location.longitude],
                zoom: 16
            });
            
            // add markers to map
            geojson.features.forEach(function(marker) {
                // create a DOM element for the marker
                var el = document.createElement('div');
                el.className = 'mapboxgl-user-location-dot';
                el.style.backgroundColor='#1da1f2';
                el.style.width = marker.properties.iconSize[0] + 'px';
                el.style.height = marker.properties.iconSize[1] + 'px';
            
                el.addEventListener('click', function() {
                    window.alert(marker.properties.message);
                });
            
                // add marker to map
                new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .addTo(map);
            });
            users.$add(location)
                .then(function (ref) {
                    var id = ref.key;
                    console.log('the location id is ' + id);
                    users.$indexFor(id);
                });
        });
    }

    var positions = firebase.database().ref('locations');
    positions.on('value', function (snap) {
        console.log(snapshotToArray(snap));
    });

    function snapshotToArray(snapshot) {
        var returnArr = [];

        snapshot.forEach(function (childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;

            returnArr.push(item);
        });

        return returnArr;
    };

    





});